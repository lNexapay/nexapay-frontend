import { pedir } from './api'
import type { CodigoMoneda } from './billetera'

// ---------- Tipos que usa el front ----------

export type Espacio = {
  id: string
  nombre: string
  moneda: CodigoMoneda
  meta: number | null // la meta es opcional
  ahorrado: number
  creado: Date
}

// ---------- Cómo responde el back ----------

type EspacioBack = {
  id: string
  name: string
  currencyCode: CodigoMoneda
  targetAmount: number | null
  amount: number
  createdAt: string
  updatedAt: string
}

type RespuestaMovimiento = {
  message: string
  space: EspacioBack
  availableBalance: number
}

// Traduce un espacio del back al formato del front
function aEspacio(e: EspacioBack): Espacio {
  return {
    id: e.id,
    nombre: e.name,
    moneda: e.currencyCode,
    meta: e.targetAmount,
    ahorrado: e.amount,
    creado: new Date(e.createdAt),
  }
}

// Porcentaje de avance, entre 0 y 100 (null si no tiene meta)
export function porcentajeEspacio(espacio: Espacio) {
  if (!espacio.meta || espacio.meta <= 0) return null
  return Math.min(100, Math.round((espacio.ahorrado / espacio.meta) * 100))
}

// ---------- Funciones que usan las pantallas ----------

export async function obtenerEspacios(token?: string | null): Promise<Espacio[]> {
  const data = await pedir<{ spaces: EspacioBack[] }>('/api/spaces', token)
  return data.spaces.map(aEspacio)
}

export async function crearEspacio(
  nombre: string,
  moneda: CodigoMoneda,
  meta: number | null,
  token?: string | null,
): Promise<Espacio> {
  const data = await pedir<{ space: EspacioBack }>('/api/spaces', token, {
    method: 'POST',
    body: JSON.stringify({ name: nombre, currencyCode: moneda, targetAmount: meta }),
  })
  return aEspacio(data.space)
}

export async function aportarAEspacio(
  id: string,
  monto: number,
  token?: string | null,
): Promise<{ espacio: Espacio; disponible: number }> {
  const data = await pedir<RespuestaMovimiento>(`/api/spaces/${id}/deposit`, token, {
    method: 'POST',
    body: JSON.stringify({ amount: monto }),
  })
  return { espacio: aEspacio(data.space), disponible: data.availableBalance }
}

export async function retirarDeEspacio(
  id: string,
  monto: number,
  token?: string | null,
): Promise<{ espacio: Espacio; disponible: number }> {
  const data = await pedir<RespuestaMovimiento>(`/api/spaces/${id}/withdraw`, token, {
    method: 'POST',
    body: JSON.stringify({ amount: monto }),
  })
  return { espacio: aEspacio(data.space), disponible: data.availableBalance }
}