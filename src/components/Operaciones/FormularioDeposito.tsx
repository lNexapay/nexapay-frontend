import { useState } from 'react'
import type { FormEvent } from 'react'
import { realizarDeposito } from '../../services/billetera'
import type { CodigoMoneda } from '../../services/billetera'
import { infoMonedas, ordenMonedas } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './FormularioOperacion.module.css'

type Props = {
  onListo: () => void
}

export default function FormularioDeposito({ onListo }: Props) {
  const { token } = useUsuario()
  const [moneda, setMoneda] = useState<CodigoMoneda>('USD')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const valor = Number(monto)
    if (!valor || valor <= 0) {
      setError('Ingresá un monto mayor a 0.')
      return
    }

    setCargando(true)
    try {
      await realizarDeposito(moneda, valor, descripcion.trim() || 'Depósito simulado', token)
      onListo()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.campo}>
        <span>Moneda</span>
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as CodigoMoneda)}>
          {ordenMonedas.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo} — {infoMonedas[codigo].nombre}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        <span>Monto</span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0,00"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </label>

      <label className={styles.campo}>
        <span>Descripción (opcional)</span>
        <input
          type="text"
          maxLength={80}
          placeholder="Ej: Ahorro del mes"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.boton} disabled={cargando}>
        {cargando ? 'Ingresando...' : 'Ingresar dinero'}
      </button>
    </form>
  )
}