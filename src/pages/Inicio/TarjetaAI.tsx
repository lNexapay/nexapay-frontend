import { Sparkles, ChevronRight, MessageSquare } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import styles from './TarjetaAI.module.css'

export default function TarjetaAI() {
  const { abrirChat } = useChat()

  return (
    <section className={styles.tarjeta}>
      <div className={styles.fila}>
        <span className={styles.chip}>
          <Sparkles size={12} /> Asistente inteligente
        </span>
        <span className={styles.version}>NEXAPAY v2.4</span>
      </div>

      <h2 className={styles.titulo}>NEXAPAY AI</h2>
      <p className={styles.subtitulo}>¿En qué puedo ayudarte hoy?</p>

      <button type="button" className={styles.sugerencia} onClick={abrirChat}>
        <Sparkles size={13} />
        <span>¿Cómo va mi presupuesto?</span>
        <ChevronRight size={14} />
      </button>

      <button type="button" className={styles.preguntar} onClick={abrirChat}>
        <MessageSquare size={15} /> Preguntar
      </button>
    </section>
  )
}