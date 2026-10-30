import { useNavigate } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'
import { logoutUsuario } from '../services/auth'

// Devuelve una función que cierra la sesión en el back y en el front, y va al Login
export function useCerrarSesion() {
  const navigate = useNavigate()
  const { cerrarSesion } = useUsuario()

  return async function salir() {
    await logoutUsuario()
    cerrarSesion()
    navigate('/login')
  }
}