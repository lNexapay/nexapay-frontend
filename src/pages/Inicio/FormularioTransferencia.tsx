import { useState } from 'react'
import type { FormEvent } from 'react'
import { realizarTransferencia } from '../../services/billetera'
import type { CodigoMoneda } from '../../services/billetera'
import { infoMonedas, ordenMonedas } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './FormularioOperacion.module.css'

type Props = {
  onListo: () => void
}

export default function FormularioTransferencia({ onListo }: Props) {
  const { token } = useUsuario()
  const [cuenta, setCuenta] = useState('')
  const [moneda, setMoneda] = useState<CodigoMoneda>('USD')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // Sacamos los espacios por si lo pegan como "5830 1742"
    const numero = cuenta.replace(/\s/g, '')

    if (!/^\d{8}$/.test(numero)) {
      setError('El número de cuenta tiene que tener 8 dígitos.')
      return
    }

    if (numero === usuarioCuenta()) {
      setError('No podés transferirte a tu propia cuenta.')
      return
    }

    const valor = Number(monto)
    if (!valor || valor <= 0) {
      setError('Ingresá un monto mayor a 0.')
      return
    }

    setCargando(true)
    try {
      await realizarTransferencia(
        numero,
        moneda,
        valor,
        descripcion.trim() || 'Transferencia',
        token,
      )
      onListo()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setCargando(false)
    }
  }

  // Número de cuenta del usuario logueado (sin espacios)
  const { usuario } = useUsuario()
  function usuarioCuenta() {
    return usuario?.cuenta?.replace(/\s/g, '')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.campo}>
        <span>Número de cuenta del destinatario</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={9}
          placeholder="Ej: 5830 1742"
          value={cuenta}
          onChange={(e) => setCuenta(e.target.value)}
        />
      </label>

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
        <span>Monto en {moneda}</span>
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
          placeholder="Ej: Cena del viernes"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.boton} disabled={cargando}>
        {cargando ? 'Transfiriendo...' : 'Transferir'}
      </button>
    </form>
  )
}