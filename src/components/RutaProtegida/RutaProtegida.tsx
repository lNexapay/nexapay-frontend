import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useUsuario } from '../../context/UsuarioContext'

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useUsuario()

  // Mientras se recupera la sesión, no mostramos nada todavía
  if (cargando) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--texto-suave)',
        }}
      >
        Cargando...
      </div>
    )
  }

  // Si no hay nadie logueado, lo mandamos al login
  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}