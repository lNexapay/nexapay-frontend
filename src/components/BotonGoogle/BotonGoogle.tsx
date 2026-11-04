import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { loginConGoogle } from '../../services/auth'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './BotonGoogle.module.css'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function BotonGoogle() {
  const navigate = useNavigate()
  const { iniciarSesion } = useUsuario()
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Sin Client ID configurado, no mostramos el botón (así no se rompe nada)
  if (!CLIENT_ID) return null

  async function alElegirCuenta(idToken?: string) {
    setError('')
    if (!idToken) {
      setError('Google no devolvió los datos de la cuenta. Probá de nuevo.')
      return
    }

    setCargando(true)
    try {
      const { usuario, token } = await loginConGoogle(idToken)
      iniciarSesion(usuario, true, token)
      navigate('/inicio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión con Google.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={styles.contenedor}>
        {cargando ? (
          <p className={styles.cargando}>Ingresando con Google...</p>
        ) : (
          <GoogleLogin
            onSuccess={(respuesta) => alElegirCuenta(respuesta.credential)}
            onError={() => setError('No se pudo conectar con Google. Probá de nuevo.')}
            text="continue_with"
            shape="rectangular"
          />
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </GoogleOAuthProvider>
  )
}