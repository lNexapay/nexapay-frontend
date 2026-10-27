const API_URL = import.meta.env.VITE_API_URL

// Error que además del mensaje guarda el código HTTP (400, 401, 409...)
export class ErrorApi extends Error {
  status: number

  constructor(mensaje: string, status: number) {
    super(mensaje)
    this.status = status
  }
}

// Única función que habla con el back: arma la URL, manda la cookie y el token, y maneja errores
export async function pedir<T>(
  ruta: string,
  token?: string | null,
  opciones: RequestInit = {},
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