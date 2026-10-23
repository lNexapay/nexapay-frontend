import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()

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
        </div>
      </section>

      <aside className={styles.visual}></aside>
    </div>
  )
}