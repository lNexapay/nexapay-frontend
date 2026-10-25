import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Usuario = {
  nombre: string
  email: string
}

type UsuarioContextType = {
  usuario: Usuario | null
  token: string | null
  iniciarSesion: (usuario: Usuario, recordar: boolean, token?: string) => void
  cerrarSesion: () => void
}

const UsuarioContext = createContext<UsuarioContextType | null>(null)

const CLAVE = 'nexapay-usuario'

// Al abrir la app, busca si había un usuario guardado
function leerUsuarioGuardado(): Usuario | null {
  try {
    const guardado = localStorage.getItem(CLAVE) ?? sessionStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(leerUsuarioGuardado)
  // El token vive solo en memoria: no se guarda en el navegador
  const [token, setToken] = useState<string | null>(null)

  function iniciarSesion(nuevo: Usuario, recordar: boolean, nuevoToken?: string) {
    setUsuario(nuevo)
    setToken(nuevoToken ?? null)
    const almacen = recordar ? localStorage : sessionStorage
    almacen.setItem(CLAVE, JSON.stringify(nuevo))
  }

  function cerrarSesion() {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem(CLAVE)
    sessionStorage.removeItem(CLAVE)
  }

  return (
    <UsuarioContext.Provider value={{ usuario, token, iniciarSesion, cerrarSesion }}>
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