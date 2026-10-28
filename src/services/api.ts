const API_URL = import.meta.env.VITE_API_URL

// Error que además del mensaje guarda el código HTTP (400, 401, 409...)
export class ErrorApi extends Error {
  status: number

  constructor(mensaje: string, status: number) {
    super(mensaje)
    this.status = status
  }
}

// ---------- Renovación automática del token ----------

// Función que avisa al Context: token nuevo (string) o sesión terminada (null)
type AvisoToken = (token: string | null) => void
let avisarToken: AvisoToken | null = null

export function registrarAvisoToken(fn: AvisoToken | null) {
  avisarToken = fn
}

// Si ya hay una renovación en curso, todos esperan la misma
let renovacionEnCurso: Promise<string> | null = null

function pedirTokenNuevo(): Promise<string> {
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      let res: Response
      try {
        res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        throw new ErrorApi('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.', 0)
      }

      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.token) {
        throw new ErrorApi('Tu sesión venció. Iniciá sesión de nuevo.', 401)
      }
      return data.token as string
    })().finally(() => {
      renovacionEnCurso = null
    })
  }
  return renovacionEnCurso
}

// ---------- Función principal ----------

// Única función que habla con el back: arma la URL, manda la cookie y el token, y maneja errores
export async function pedir<T>(
  ruta: string,
  token?: string | null,
  opciones: RequestInit = {},
  esReintento = false,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      credentials: 'include',
      headers: {
        ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    // fetch falla así cuando el servidor no responde (apagado o sin conexión)
    throw new ErrorApi('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.', 0)
  }

  // Token vencido: lo renovamos y reintentamos una sola vez
  if (res.status === 401 && token && !esReintento) {
    try {
      const nuevoToken = await pedirTokenNuevo()
      avisarToken?.(nuevoToken)
      return pedir<T>(ruta, nuevoToken, opciones, true)
    } catch (err) {
      // Si la renovación dio 401, la sesión terminó: avisamos para mandar al Login
      if (err instanceof ErrorApi && err.status === 401) avisarToken?.(null)
      throw err
    }
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // El back manda los errores como { "error": "..." } o { "message": "..." }
    throw new ErrorApi(
      data?.error ?? data?.message ?? 'Ocurrió un error con el servidor.',
      res.status,
    )
  }

  return data as T
}