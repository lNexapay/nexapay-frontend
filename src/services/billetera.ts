const API_URL = import.meta.env.VITE_API_URL

export type CodigoMoneda = 'USD' | 'EUR' | 'ARS' | 'COP'

// Cómo usa los datos el front
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

// Cómo los devuelve el back (GET /api/balances/total)
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

export async function obtenerBalanceTotal(token?: string | null): Promise<BalanceTotal> {
  const res = await fetch(`${API_URL}/api/balances/total?base=USD`, {
    credentials: 'include',
    // Si hay sesión, mandamos el token (lo va a pedir cuando protejan la wallet)
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  if (!res.ok) {
    throw new Error('No se pudieron cargar los saldos.')
  }

  const data = (await res.json()) as RespuestaTotal

  // Traducimos los nombres del back a los del front
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