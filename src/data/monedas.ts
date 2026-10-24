export type Moneda = {
  codigo: 'USD' | 'EUR' | 'ARS' | 'COP'
  nombre: string
  simbolo: string
  saldo: number
}

// Datos simulados: después se reemplazan por los del backend
export const monedas: Moneda[] = [
  { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: 'US$', saldo: 4200 },
  { codigo: 'ARS', nombre: 'Peso Argentino', simbolo: '$', saldo: 4850000 },
  { codigo: 'COP', nombre: 'Peso Colombiano', simbolo: 'COL$', saldo: 18200000 },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€', saldo: 3150 },
]

export const balanceTotalUSD = 14850

// Formatea al estilo argentino: 14850 → "14.850,00"
export function formatearMonto(monto: number, decimales = 2) {
  return monto.toLocaleString('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}