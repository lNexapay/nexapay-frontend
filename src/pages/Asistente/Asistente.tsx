import { Sparkles, Send } from 'lucide-react'
import Sidebar from '../../components/Sidebar/Sidebar'
import styles from './Asistente.module.css'

export default function Asistente() {
  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>
        <header className={styles.encabezado}>
          <span className={styles.icono}>
            <Sparkles size={20} />
          </span>
          <div>
            <h1>NEXAPAY AI</h1>
            <p>Tu copiloto financiero. Preguntame sobre tus saldos y tu presupuesto.</p>
          </div>
        </header>

        <section className={styles.chat}>
          <div className={styles.mensajes}>
            <div className={`${styles.burbuja} ${styles.ia}`}>
              ¡Hola! Soy NEXAPAY AI. ¿En qué puedo ayudarte hoy?
            </div>
          </div>

          <form className={styles.barra} onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Escribí tu pregunta..." />
            <button type="submit" aria-label="Enviar">
              <Send size={18} />
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}