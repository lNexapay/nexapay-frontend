import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo/Logo'
import PanelVisual from './PanelVisual'
import styles from './AuthLayout.module.css'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pagina}>
      <section className={styles.formulario}>
        <header className={styles.header}>
          <Link to="/" aria-label="Ir al inicio de NEXAPAY">
            <Logo />
          </Link>
          <span className={styles.badge}>
            <span className={styles.punto} /> Simulación Activa
          </span>
        </header>

        <div className={styles.contenido}>{children}</div>
      </section>

      <PanelVisual />
    </div>
  )
}