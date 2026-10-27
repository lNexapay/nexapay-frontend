import { pedir } from './api'

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

// Traduce una operación del back al formato del front
function aOperacion(op: OperacionBack): Operacion {
  return {
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
  }
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
  return data.map(aOperacion)
}

export async function realizarDeposito(
  moneda: CodigoMoneda,
  monto: number,
  descripcion: string,
  token?: string | null,
): Promise<Operacion> {
  const data = await pedir<OperacionBack>('/api/deposit', token, {
    method: 'POST',
    body: JSON.stringify({ currency: moneda, amount: monto, description: descripcion }),
  })
  return aOperacion(data)
}

export async function realizarConversion(
  desde: CodigoMoneda,
  hacia: CodigoMoneda,
  monto: number,
  descripcion: string,
  token?: string | null,
): Promise<Operacion> {
  const data = await pedir<OperacionBack>('/api/convert', token, {
    method: 'POST',
    body: JSON.stringify({ from: desde, to: hacia, amount: monto, description: descripcion }),
  })
  return aOperacion(data)
}