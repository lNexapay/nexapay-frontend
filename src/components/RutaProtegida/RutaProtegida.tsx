import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useUsuario } from '../../context/UsuarioContext'

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { usuario } = useUsuario()

  // Si no hay nadie logueado, lo mandamos al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}