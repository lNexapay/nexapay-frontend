const API_URL = import.meta.env.VITE_API_URL

export type CodigoMoneda = 'USD' | 'EUR' | 'ARS' | 'COP'

// ---------- Tipos que usa el front ----------

export type SaldoMoneda = {
  codigo: CodigoMoneda
  saldo: number
  saldoEnUSD: number
}

export type BalanceTotal = {
  total: number
  monedaBase: string
  monedas: SaldoMoneda[]
}

export type Operacion = {
  id: string
  tipo: 'deposito' | 'conversion'
  monedaOrigen: CodigoMoneda
  monedaDestino: CodigoMoneda
  montoOrigen: number
  montoDestino: number
  tasa: number
  estado: string
  descripcion: string
  fecha: Date
}

// ---------- Cómo responde el back ----------

type RespuestaTotal = {
  walletId: string
  baseCurrency: string
  total: number
  breakdown: {
    currencyCode: CodigoMoneda
    amount: number
    convertedAmount: number
  }[]
}

type OperacionBack = {
  id: string
  walletId: string
  type: string
  currencyFrom: CodigoMoneda
  currencyTo: CodigoMoneda
  amountFrom: number
  amountTo: number
  rateUsed: number
  status: string
  description: string
  createdAt: string
}

// ---------- Función interna para hablar con el back ----------

async function pedir<T>(ruta: string, token?: string | null, opciones: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      credentials: 'include',
      headers: {
        ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
        // Si hay sesión, mandamos el token (lo van a pedir cuando protejan la wallet)
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    // fetch falla así cuando el servidor no responde (apagado o sin conexión)
    throw new Error('No se pudo conectar con el servidor. Probá de nuevo en unos minutos.')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // El back manda los errores como { "error": "..." }
    throw new Error(data?.error ?? data?.message ?? 'Ocurrió un error con el servidor.')
  }

  return data as T
}

// ---------- Funciones que usan las pantallas ----------

export async function obtenerBalanceTotal(token?: string | null): Promise<BalanceTotal> {
  const data = await pedir<RespuestaTotal>('/api/balances/total?base=USD', token)

  return {
    total: data.total,
    monedaBase: data.baseCurrency,
    monedas: data.breakdown.map((b) => ({
      codigo: b.currencyCode,
      saldo: b.amount,
      saldoEnUSD: b.convertedAmount,
    })),
  }
}

export async function obtenerOperaciones(
  token?: string | null,
  limite = 5,
): Promise<Operacion[]> {
  const data = await pedir<OperacionBack[]>(`/api/transactions?limit=${limite}`, token)

  return data.map((op) => ({
    id: op.id,
    tipo: op.type === 'deposit' ? 'deposito' : 'conversion',
    monedaOrigen: op.currencyFrom,
    monedaDestino: op.currencyTo,
    montoOrigen: op.amountFrom,
    montoDestino: op.amountTo,
    tasa: op.rateUsed,
    estado: op.status,
    descripcion: op.description,
    fecha: new Date(op.createdAt),
  }))
}