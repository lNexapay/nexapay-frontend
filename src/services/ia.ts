import { pedir, ErrorApi } from './api'

// Formato que espera el back para cada mensaje del historial
export type MensajeHistorial = {
  role: 'user' | 'assistant'
  content: string
}

type RespuestaChat = {
  reply: string
}

// Los mismos límites que tiene el back
export const LARGO_MAXIMO = 500
export const MAXIMO_HISTORIAL = 10

export async function enviarMensajeIA(
  mensaje: string,
  historial: MensajeHistorial[],
  token: string
): Promise<string> {
  try {
    const data = await pedir<RespuestaChat>('/api/ai/chat', token, {
      method: 'POST',
      body: JSON.stringify({
        message: mensaje,
        history: historial.slice(-MAXIMO_HISTORIAL),
      }),
    })
    return data.reply
  } catch (error) {
    if (error instanceof ErrorApi && error.status === 429) {
      throw new ErrorApi('Hiciste muchas preguntas seguidas. Esperá un minuto y probá de nuevo.', 429)
    }
    if (error instanceof ErrorApi && error.status === 404) {
      throw new ErrorApi('NEXAPAY AI todavía no está disponible en el servidor.', 404)
    }
    throw error
  }
}