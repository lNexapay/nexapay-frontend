import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

type Props = {
  titulo: string
  abierto: boolean
  onCerrar: () => void
  children: ReactNode
}

export default function Modal({ titulo, abierto, onCerrar, children }: Props) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return

    function alApretarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }

    window.addEventListener('keydown', alApretarTecla)
    return () => window.removeEventListener('keydown', alApretarTecla)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        className={styles.ventana}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.cabecera}>
          <h2>{titulo}</h2>
          <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}