import { Sparkles } from 'lucide-react'
import Sidebar from '../../components/Sidebar/Sidebar'
import MenuInferior from '../../components/MenuInferior/MenuInferior'
import Chat from '../../components/Chat/Chat'
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
          <Chat />
        </section>
      </main>
      <MenuInferior />
    </div>
  )
}