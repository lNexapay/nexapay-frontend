import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { renovarSesion, obtenerUsuarioActual } from '../services/auth'
import { ErrorApi } from '../services/api'

export type Usuario = {
  nombre: string
  email: string
  demo?: boolean // el usuario demo no tiene sesión en el back
}

type UsuarioContextType = {
  usuario: Usuario | null
  token: string | null
  cargando: boolean
  iniciarSesion: (usuario: Usuario, recordar: boolean, token?: string) => void
  cerrarSesion: () => void
}

const UsuarioContext = createContext<UsuarioContextType | null>(null)

const CLAVE = 'nexapay-usuario'

// Busca si había un usuario guardado en el navegador
function leerUsuarioGuardado(): Usuario | null {
  try {
    const guardado = localStorage.getItem(CLAVE) ?? sessionStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

function guardarUsuario(usuario: Usuario, recordar: boolean) {
  localStorage.removeItem(CLAVE)
  sessionStorage.removeItem(CLAVE)
  const almacen = recordar ? localStorage : sessionStorage
  almacen.setItem(CLAVE, JSON.stringify(usuario))
}

function borrarUsuarioGuardado() {
  localStorage.removeItem(CLAVE)
  sessionStorage.removeItem(CLAVE)
}

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado)
  // El token vive solo en memoria: no se guarda en el navegador
  const [token, setToken] = useState<string | null>(null)
  // Si hay un usuario real guardado, arrancamos "cargando" hasta renovar su sesión
  const [cargando, setCargando] = useState(() => {
    const guardado = leerUsuarioGuardado()
    return guardado !== null && !guardado.demo
  })

  // Al abrir la app: renovar el token con la cookie y traer los datos del usuario
  useEffect(() => {
    if (!cargando) return

    let activo = true
    const recordar = localStorage.getItem(CLAVE) !== null

    async function recuperarSesion() {
      try {
        const nuevoToken = await renovarSesion()
        const actual = await obtenerUsuarioActual(nuevoToken)
        if (!activo) return
        setToken(nuevoToken)
        setUsuario(actual)
        guardarUsuario(actual, recordar)
      } catch (err) {
        if (!activo) return
        // 401: la sesión venció o la cerraron → hay que volver a iniciar sesión
        if (err instanceof ErrorApi && err.status === 401) {
          setUsuario(null)
          borrarUsuarioGuardado()
        }
        // Si el back no responde, dejamos al usuario: el Dashboard mostrará el error
      } finally {
        if (activo) setCargando(false)
      }
    }

    recuperarSesion()

    return () => {
      activo = false
    }
  }, [cargando])

  function iniciarSesion(nuevo: Usuario, recordar: boolean, nuevoToken?: string) {
    setUsuario(nuevo)
    setToken(nuevoToken ?? null)
    guardarUsuario(nuevo, recordar)
  }

  function cerrarSesion() {
    setUsuario(null)
    setToken(null)
    borrarUsuarioGuardado()
  }

  return (
    <UsuarioContext.Provider value={{ usuario, token, cargando, iniciarSesion, cerrarSesion }}>
      {children}
    </UsuarioContext.Provider>
  )
}

// Para leer el usuario desde cualquier pantalla
export function useUsuario() {
  const contexto = useContext(UsuarioContext)
  if (!contexto) throw new Error('useUsuario debe usarse dentro de UsuarioProvider')
  return contexto
}

// Primera letra del nombre, para el avatar
export function inicial(nombre: string) {
  return nombre.charAt(0).toUpperCase()
}