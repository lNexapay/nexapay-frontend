import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import { useUsuario } from '../../context/UsuarioContext'
import { enviarMensajeIA, LARGO_MAXIMO } from '../../services/ia'
import type { MensajeHistorial } from '../../services/ia'
import styles from './Chat.module.css'

type Mensaje = {
  id: number
  autor: 'ia' | 'usuario'
  texto: string
  error?: boolean
}

const BIENVENIDA: Mensaje = {
  id: 0,
  autor: 'ia',
  texto: '¡Hola! Soy NEXAPAY AI. ¿En qué puedo ayudarte hoy?',
}

// A partir de cuántos caracteres mostramos el contador
const AVISO_LARGO = 400

// Pasa nuestros mensajes al formato del back (sin la bienvenida ni los errores)
function aHistorial(mensajes: Mensaje[]): MensajeHistorial[] {
  return mensajes
    .filter((m) => m.id !== BIENVENIDA.id && !m.error)
    .map((m) => ({
      role: m.autor === 'usuario' ? 'user' : 'assistant',
      content: m.texto,
    }))
}

export default function Chat() {
  const { token } = useUsuario()
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA])
  const [texto, setTexto] = useState('')
  const [esperando, setEsperando] = useState(false)
  const finRef = useRef<HTMLDivElement>(null)
  const siguienteId = useRef(1)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, esperando])

  function agregar(autor: Mensaje['autor'], texto: string, error = false) {
    const nuevo: Mensaje = { id: siguienteId.current++, autor, texto, error }
    setMensajes((anteriores) => [...anteriores, nuevo])
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const pregunta = texto.trim()
    if (!pregunta || esperando) return

    // El historial se arma ANTES de sumar la pregunta nueva
    const historial = aHistorial(mensajes)
    agregar('usuario', pregunta)
    setTexto('')

    if (!token) {
      agregar('ia', 'Tu sesión venció. Volvé a iniciar sesión para usar NEXAPAY AI.', true)
      return
    }

    setEsperando(true)
    try {
      const respuesta = await enviarMensajeIA(pregunta, historial, token)
      agregar('ia', respuesta)
    } catch (error) {
      const mensaje =
        error instanceof Error ? error.message : 'No pude responder. Probá de nuevo.'
      agregar('ia', mensaje, true)
    } finally {
      setEsperando(false)
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.mensajes}>
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`${styles.burbuja} ${m.autor === 'ia' ? styles.ia : styles.usuario} ${
              m.error ? styles.error : ''
            }`}
          >
            {m.texto}
          </div>
        ))}

        {esperando && (
          <div className={`${styles.burbuja} ${styles.ia} ${styles.escribiendo}`}>
            NEXAPAY AI está escribiendo...
          </div>
        )}

        <div ref={finRef} />
      </div>

      {texto.length >= AVISO_LARGO && (
        <p className={styles.contador}>
          {texto.length}/{LARGO_MAXIMO}
        </p>
      )}

      <form className={styles.barra} onSubmit={enviar}>
        <input
          type="text"
          placeholder="Escribí tu pregunta..."
          value={texto}
          maxLength={LARGO_MAXIMO}
          onChange={(e) => setTexto(e.target.value)}
          aria-label="Escribí tu pregunta"
        />
        <button type="submit" disabled={!texto.trim() || esperando} aria-label="Enviar">
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}