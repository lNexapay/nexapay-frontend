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

        <div className={styles.contenido}>
          <h1>Bienvenido de nuevo</h1>
          <p className={styles.subtitulo}>
            Accedé a tu billetera multimoneda y tu copiloto NEXAPAY AI
          </p>
        </div>
      </section>

      <aside className={styles.visual}></aside>
    </div>
  )
}