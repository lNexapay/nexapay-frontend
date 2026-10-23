import Logo from '../../components/Logo/Logo'
import styles from './Login.module.css'

export default function Login() {
  return (
    <div className={styles.pagina}>
      <section className={styles.formulario}>
        <header className={styles.header}>
          <Logo />
          <span className={styles.badge}>
            <span className={styles.punto} /> Simulación Activa
          </span>
        </header>
      </section>

      <aside className={styles.visual}></aside>
    </div>
  )
}