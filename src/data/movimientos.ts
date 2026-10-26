export type TipoMovimiento = 'ingreso' | 'conversion' | 'aporte'

export type Movimiento = {
  id: number
  tipo: TipoMovimiento
  titulo: string
  detalle: string
  monto: number // positivo = entra, negativo = sale
  moneda: 'USD' | 'EUR' | 'ARS' | 'COP'
  nota: string
}

// Datos simulados: después se reemplazan por los del backend
export const movimientos: Movimiento[] = [
  {
    id: 1,
    tipo: 'ingreso',
    titulo: 'Carga simulada - Depósito automático ARS',
    detalle: 'Hoy, 10:45 AM • Banco Simulado',
    monto: 500000,
    moneda: 'ARS',
    nota: 'Completado',
  },
  {
    id: 2,
    tipo: 'conversion',
    titulo: 'Conversión ficticia USD a EUR',
    detalle: 'Hoy, 08:30 AM • Tasa interbancaria 0.92',
    monto: -200,
    moneda: 'USD',
    nota: '+ € 184,00 EUR',
  },
  {
    id: 3,
    tipo: 'aporte',
    titulo: 'Aporte a Mi estudio',
    detalle: 'Ayer, 18:20 PM • Regla de ahorro 10%',
    monto: -50,
    moneda: 'USD',
    nota: 'Espacio activo',
  },
]