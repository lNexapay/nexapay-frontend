import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import Input from '../../components/Input/Input'
import PanelVisual from './PanelVisual'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recordar, setRecordar] = useState(true)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // TODO: enviar email y password a la API del backend
    navigate('/inicio')
  }

  return (
    <div className={styles.pagina}>
      <section className={styles.formulario}>
        <header className={styles.header}>
          <Logo />
          <span className={styles.badge}>
            <span className={styles.punto} /> Simulación Activa
          </span>
        </header>

        <div className={styles.contenido}>
          <h1>Bienvenido de nuevo</h1>
          <p className={styles.subtitulo}>
            Accedé a tu billetera multimoneda y tu copiloto NEXAPAY AI
          </p>

          <button type="button" className={styles.demo} onClick={() => navigate('/inicio')}>
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

            <button type="submit" className={styles.boton}>
              Iniciar sesión <ArrowRight size={16} />
            </button>
          </form>

          <p className={styles.registro}>
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </div>
      </section>

      <PanelVisual />
    </div>
  )
}