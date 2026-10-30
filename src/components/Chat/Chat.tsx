import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Send } from 'lucide-react'
import styles from './Chat.module.css'

type Mensaje = {
  id: number
  autor: 'ia' | 'usuario'
  texto: string
}

const BIENVENIDA: Mensaje = {
  id: 0,
  autor: 'ia',
  texto: '¡Hola! Soy NEXAPAY AI. ¿En qué puedo ayudarte hoy?',
}

export default function Chat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA])
  const [texto, setTexto] = useState('')
  const finRef = useRef<HTMLDivElement>(null)

  // Cada vez que llega un mensaje, bajamos hasta el último
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  function enviar(e: FormEvent) {
    e.preventDefault()
    const pregunta = texto.trim()
    if (!pregunta) return

    setTexto('')
    setMensajes((prev) => [...prev, { id: Date.now(), autor: 'usuario', texto: pregunta }])

    // TODO: cuando el back tenga el endpoint de IA, pedir la respuesta real
    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          autor: 'ia',
          texto:
            'Todavía estoy en desarrollo 🛠️. Muy pronto vas a poder preguntarme por tus saldos y tu presupuesto.',
        },
      ])
    }, 600)
  }

  return (
    <div className={styles.chat}>
      <div className={styles.mensajes}>
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`${styles.burbuja} ${m.autor === 'ia' ? styles.ia : styles.usuario}`}
          >
            {m.texto}
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <form className={styles.barra} onSubmit={enviar}>
        <input
          placeholder="Escribí tu pregunta..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" aria-label="Enviar" disabled={!texto.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}