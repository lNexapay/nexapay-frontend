import { useEffect } from 'react'
import { Sparkles, X } from 'lucide-react'
import Chat from '../Chat/Chat'
import { useChat } from '../../context/ChatContext'
import styles from './ChatFlotante.module.css'

export default function ChatFlotante() {
  const { abierto, abrirChat, cerrarChat } = useChat()

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return

    function alApretarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrarChat()
    }

    window.addEventListener('keydown', alApretarTecla)
    return () => window.removeEventListener('keydown', alApretarTecla)
  }, [abierto, cerrarChat])

  return (
    <>
      {!abierto && (
        <button
          type="button"
          className={styles.burbuja}
          onClick={abrirChat}
          aria-label="Abrir NEXAPAY AI"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* El panel siempre existe (para no perder la conversación), solo se oculta */}
      <section
        className={`${styles.panel} ${abierto ? styles.visible : ''}`}
        aria-label="Chat con NEXAPAY AI"
        aria-hidden={!abierto}
      >
        <header className={styles.cabecera}>
          <span className={styles.icono}>
            <Sparkles size={16} />
          </span>
          <div className={styles.titulo}>
            <strong>NEXAPAY AI</strong>
            <small>Tu copiloto financiero</small>
          </div>
          <button type="button" className={styles.cerrar} onClick={cerrarChat} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className={styles.cuerpo}>
          <Chat />
        </div>
      </section>
    </>
  )
}