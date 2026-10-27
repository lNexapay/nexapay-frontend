import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, ShieldCheck, ArrowRight, CircleCheck } from 'lucide-react'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import Input from '../../components/Input/Input'
import { loginUsuario } from '../../services/auth'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { iniciarSesion } = useUsuario()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // ¿Viene recién registrado desde /registro?
  const recienRegistrado = (location.state as { registrado?: boolean } | null)?.registrado

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Completá tu email y tu contraseña.')
      return
    }

    setCargando(true)
    try {
      const { usuario, token } = await loginUsuario(email.trim(), password)
      iniciarSesion(usuario, recordar, token)
      navigate('/inicio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  // Acceso rápido con la usuaria demo (sin pasar por el backend)
  function entrarComoDemo() {
    iniciarSesion({ nombre: 'Nati', email: 'nati@nexapay.demo', demo: true }, false)
    navigate('/inicio')
  }

  return (
    <AuthLayout>
      <h1>Bienvenido de nuevo</h1>
      <p className={styles.subtitulo}>
        Accedé a tu billetera multimoneda y tu copiloto NEXAPAY AI
      </p>

      {recienRegistrado && (
        <p className={styles.exito}>
          <CircleCheck size={16} /> ¡Cuenta creada! Ya podés iniciar sesión.
        </p>
      )}

      <button type="button" className={styles.demo} onClick={entrarComoDemo}>
        <span className={styles.avatar}>N</span>
        <span className={styles.demoTexto}>
          <strong>
            Ingresar como Nati (Demo) <em>EXPRESS</em>
          </strong>
          <small>nati@nexapay.demo • Simulación cargada</small>
        </span>
        <Zap size={16} className={styles.demoIcono} />
      </button>

      <div className={styles.separador}>o continuá con tu email</div>

      <form onSubmit={handleSubmit} className={styles.campos}>
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@nexapay.io"
          value={email}
          onChange={setEmail}
          icono={Mail}
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          icono={Lock}
          accion={<a href="#">¿Olvidaste tu contraseña?</a>}
        />

        <div className={styles.opciones}>
          <label className={styles.recordar}>
            <input
              type="checkbox"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
            />
            Recordar mi sesión
          </label>
          <span className={styles.seguro}>
            <ShieldCheck size={14} /> Sesión Segura
          </span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.boton} disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          {!cargando && <ArrowRight size={16} />}
        </button>
      </form>

      <p className={styles.registro}>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </AuthLayout>
  )
}