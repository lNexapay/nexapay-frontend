import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Sparkles, X } from 'lucide-react'
import Chat from '../Chat/Chat'
import { useChat } from '../../context/ChatContext'
import styles from './ChatFlotante.module.css'

type Posicion = { x: number; y: number }

const TAMANO = 56 // medida de la burbuja
const MARGEN = 16 // distancia mínima a los bordes
const CLAVE = 'nexapay-burbuja'

// Mantiene la burbuja dentro de la pantalla (y arriba del menú inferior en celular)
function limitar(x: number, y: number): Posicion {
  const espacioAbajo = window.innerWidth <= 900 ? 84 : MARGEN
  const maxX = window.innerWidth - TAMANO - MARGEN
  const maxY = window.innerHeight - TAMANO - espacioAbajo
  return {
    x: Math.min(Math.max(MARGEN, x), maxX),
    y: Math.min(Math.max(MARGEN, y), maxY),
  }
}

// Lee la posición guardada (si el navegador lo permite)
function leerPosicion(): Posicion | null {
  try {
    const guardada = localStorage.getItem(CLAVE)
    if (!guardada) return null
    const p = JSON.parse(guardada) as Posicion
    return limitar(p.x, p.y)
  } catch {
    return null
  }
}

function guardarPosicion(p: Posicion) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p))
  } catch {
    // Si no se puede guardar, no pasa nada
  }
}

export default function ChatFlotante() {
  const { abierto, abrirChat, cerrarChat } = useChat()
  const [posicion, setPosicion] = useState<Posicion | null>(leerPosicion)
  const [arrastrando, setArrastrando] = useState(false)

  // Datos del arrastre en curso (no hace falta redibujar por esto)
  const arrastre = useRef<{ dx: number; dy: number; inicioX: number; inicioY: number } | null>(
    null,
  )
  const ignorarClic = useRef(false)

  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return

    function alApretarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrarChat()
    }

    window.addEventListener('keydown', alApretarTecla)
    return () => window.removeEventListener('keydown', alApretarTecla)
  }, [abierto, cerrarChat])

  // Si cambia el tamaño de la ventana, que la burbuja no quede afuera
  useEffect(() => {
    function alRedimensionar() {
      setPosicion((p) => (p ? limitar(p.x, p.y) : p))
    }
    window.addEventListener('resize', alRedimensionar)
    return () => window.removeEventListener('resize', alRedimensionar)
  }, [])

  function alPresionar(e: PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    arrastre.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      inicioX: e.clientX,
      inicioY: e.clientY,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function alMover(e: PointerEvent<HTMLButtonElement>) {
    const a = arrastre.current
    if (!a) return

    // Hasta que no se mueva unos píxeles, lo tomamos como un toque, no un arrastre
    if (!arrastrando) {
      const distancia = Math.hypot(e.clientX - a.inicioX, e.clientY - a.inicioY)
      if (distancia < 6) return
      setArrastrando(true)
    }

    setPosicion(limitar(e.clientX - a.dx, e.clientY - a.dy))
  }

  function alSoltar() {
    arrastre.current = null
    if (!arrastrando) return

    setArrastrando(false)
    ignorarClic.current = true // el "clic" que viene después de soltar no abre el chat

    // Se pega al borde más cercano (izquierdo o derecho)
    setPosicion((p) => {
      if (!p) return p
      const mitad = window.innerWidth / 2
      const x = p.x + TAMANO / 2 < mitad ? MARGEN : window.innerWidth - TAMANO - MARGEN
      const nueva = { x, y: p.y }
      guardarPosicion(nueva)
      return nueva
    })
  }

  function alHacerClic() {
    if (ignorarClic.current) {
      ignorarClic.current = false
      return
    }
    abrirChat()
  }

  return (
    <>
      {!abierto && (
        <button
          type="button"
          className={`${styles.burbuja} ${arrastrando ? styles.arrastrando : ''}`}
          style={
            posicion ? { left: posicion.x, top: posicion.y, right: 'auto', bottom: 'auto' } : undefined
          }
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
          onClick={alHacerClic}
          aria-label="Abrir NEXAPAY AI (podés arrastrarla)"
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