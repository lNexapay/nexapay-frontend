// "1500", "1500,5" o "1500.50" → 1500.5
// Devuelve null si no es un monto válido (mayor a 0, con hasta 2 decimales)
export function leerMonto(texto: string): number | null {
  const limpio = texto.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) return null

  const monto = Number(limpio)
  return monto > 0 ? monto : null
}