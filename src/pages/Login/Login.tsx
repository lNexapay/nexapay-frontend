import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import Input from '../../components/Input/Input'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

          <div className={styles.campos}>
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
          </div>
        </div>
      </section>

      <aside className={styles.visual}></aside>
    </div>
  )
}