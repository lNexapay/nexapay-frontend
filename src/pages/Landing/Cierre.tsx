import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import styles from './Cierre.module.css'

export default function Cierre() {
  const anio = new Date().getFullYear()

  return (
    <>
      <section className={styles.llamado}>
        <div className={styles.caja}>
          <h2>Empezá a manejar tus monedas en un solo lugar</h2>
          <p>Creá tu cuenta en un minuto, con tu email o con Google.</p>
          <div className={styles.botones}>
            <Link to="/registro" className={styles.principal}>
              Crear mi cuenta <ArrowRight size={18} />
            </Link>
            <Link to="/login" className={styles.secundario}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.pie}>
        <div className={styles.pieContenido}>
          <Logo />
          <p>
            NEXAPAY es una plataforma de simulación financiera con fondos ficticios. No requiere
            información bancaria real.
          </p>
          <small>© {anio} NEXAPAY · Proyecto académico</small>
        </div>
      </footer>
    </>
  )
}