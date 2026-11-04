import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  realizarConversion,
  obtenerComisiones,
  obtenerTasas,
  porcentajeComision,
} from '../../services/billetera'
import type { CodigoMoneda, Comisiones, Tasas } from '../../services/billetera'
import { infoMonedas, ordenMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './FormularioOperacion.module.css'

type Props = {
  onListo: () => void
}

export default function FormularioConversion({ onListo }: Props) {
  const { token } = useUsuario()
  const [desde, setDesde] = useState<CodigoMoneda>('USD')
  const [hacia, setHacia] = useState<CodigoMoneda>('ARS')
  const [monto, setMonto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Para la estimación: comisiones y tasas del back
  const [comisiones, setComisiones] = useState<Comisiones | null>(null)
  const [tasas, setTasas] = useState<Tasas | null>(null)

  useEffect(() => {
    let activo = true
    Promise.all([obtenerComisiones(), obtenerTasas()])
      .then(([datosComisiones, datosTasas]) => {
        if (!activo) return
        setComisiones(datosComisiones)
        setTasas(datosTasas)
      })
      .catch(() => {
        // Si falla, no mostramos la estimación; la conversión funciona igual
      })
    return () => {
      activo = false
    }
  }, [])

  // ---------- Estimación ----------
  const valor = Number(monto) || 0
  const porcentaje = comisiones ? porcentajeComision(comisiones, desde, hacia) : 0
  const comision = (valor * porcentaje) / 100
  const seConvierte = valor - comision
  const recibis = tasas ? (seConvierte / tasas.valores[desde]) * tasas.valores[hacia] : 0
  const mostrarEstimacion = comisiones && tasas && valor > 0 && desde !== hacia

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (desde === hacia) {
      setError('Elegí dos monedas distintas.')
      return
    }

    if (!valor || valor <= 0) {
      setError('Ingresá un monto mayor a 0.')
      return
    }

    setCargando(true)
    try {
      await realizarConversion(
        desde,
        hacia,
        valor,
        descripcion.trim() || `Conversión ${desde} a ${hacia}`,
        token,
      )
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
        <span>Convertir desde</span>
        <select value={desde} onChange={(e) => setDesde(e.target.value as CodigoMoneda)}>
          {ordenMonedas.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo} — {infoMonedas[codigo].nombre}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        <span>Hacia</span>
        <select value={hacia} onChange={(e) => setHacia(e.target.value as CodigoMoneda)}>
          {ordenMonedas.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo} — {infoMonedas[codigo].nombre}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        <span>Monto en {desde}</span>
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
          placeholder="Ej: Ahorro en euros"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {mostrarEstimacion ? (
        <dl className={styles.resumen}>
          <div>
            <dt>Comisión ({formatearMonto(porcentaje, 1)} %)</dt>
            <dd>
              {formatearMonto(comision)} {desde}
            </dd>
          </div>
          <div>
            <dt>Se convierte</dt>
            <dd>
              {formatearMonto(seConvierte)} {desde}
            </dd>
          </div>
          <div className={styles.recibis}>
            <dt>Recibís aprox.</dt>
            <dd>
              {infoMonedas[hacia].prefijo} {formatearMonto(recibis)} {hacia}
            </dd>
          </div>
        </dl>
      ) : (
        <p className={styles.nota}>
          Se cobra una comisión según el par de monedas. Se descuenta del monto que convertís.
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.boton} disabled={cargando}>
        {cargando ? 'Convirtiendo...' : 'Convertir'}
      </button>
    </form>
  )
}