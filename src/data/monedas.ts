import type { CodigoMoneda } from '../services/billetera'

// Nombre y símbolo de cada moneda (el back solo manda el código)
export const infoMonedas: Record<
  CodigoMoneda,
  { nombre: string; simbolo: string; prefijo: string }
> = {
  USD: { nombre: 'Dólar Estadounidense', simbolo: 'US$', prefijo: '$' },
  ARS: { nombre: 'Peso Argentino', simbolo: 'ARS', prefijo: '$' },
  COP: { nombre: 'Peso Colombiano', simbolo: 'COL$', prefijo: '$' },
  EUR: { nombre: 'Euro', simbolo: '€', prefijo: '€' },
}

// Orden en que se muestran, como en el diseño
export const ordenMonedas: CodigoMoneda[] = ['USD', 'ARS', 'COP', 'EUR']

// Formatea al estilo argentino: 14850 → "14.850,00"
export function formatearMonto(monto: number, decimales = 2) {
  return monto.toLocaleString('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })
}