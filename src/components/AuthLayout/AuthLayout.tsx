import type { ReactNode } from 'react'
import Logo from '../Logo/Logo'
import PanelVisual from './PanelVisual'
import styles from './AuthLayout.module.css'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pagina}>
      <section className={styles.formulario}>
        <header className={styles.header}>
          <Logo />
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