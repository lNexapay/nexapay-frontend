import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import Input from '../../components/Input/Input'
import { registrarUsuario } from '../../services/auth'
import base from '../Login/Login.module.css'
import styles from './Registro.module.css'

export default function Registro() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [acepta, setAcepta] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // Validaciones antes de llamar al backend
    if (!nombre.trim() || !email.trim()) {
      setError('Completá tu nombre y tu correo electrónico.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!acepta) {
      setError('Tenés que aceptar los términos para continuar.')
      return
    }

    setCargando(true)
    try {
      await registrarUsuario(nombre.trim(), email.trim(), password)
      // El registro no inicia sesión: lo mandamos al login
      navigate('/login', { state: { registrado: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AuthLayout>
      <h1>Creá tu cuenta</h1>
      <p className={base.subtitulo}>
        Unite a la nueva generación de finanzas simuladas con NEXAPAY AI.
      </p>

      <form onSubmit={handleSubmit} className={base.campos}>
        <Input
          id="nombre"
          label="Nombre completo"
          placeholder="Natalia Gómez"
          value={nombre}
          onChange={setNombre}
          icono={User}
        />

        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="nati@nexapay.io"
          value={email}
          onChange={setEmail}
          icono={Mail}
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={setPassword}
          icono={Lock}
        />

        <Input
          id="confirmar"
          label="Confirmar contraseña"
          type="password"
          placeholder="Repetí tu contraseña"
          value={confirmar}
          onChange={setConfirmar}
          icono={Lock}
        />

        <label className={`${base.recordar} ${styles.terminos}`}>
          <input
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
          />
          <span>
            Acepto los Términos del Servicio y la Política de Privacidad, y reconozco que
            opero en un entorno de simulación ficticio con fondos de prueba.
          </span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={base.boton} disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          {!cargando && <ArrowRight size={16} />}
        </button>
      </form>

      <p className={base.registro}>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </AuthLayout>
  )
}