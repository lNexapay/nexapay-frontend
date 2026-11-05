import { useState } from 'react'
import type { FormEvent } from 'react'
import { crearEspacio } from '../../services/espacios'
import type { Espacio } from '../../services/espacios'
import type { CodigoMoneda } from '../../services/billetera'
import { infoMonedas, ordenMonedas } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import { leerMonto } from './leerMonto'
import styles from './Formularios.module.css'

type Props = {
  onCreado: (espacio: Espacio) => void
  onCancelar: () => void
}

export default function FormularioEspacio({ onCreado, onCancelar }: Props) {
  const { token } = useUsuario()
  const [nombre, setNombre] = useState('')
  const [moneda, setMoneda] = useState<CodigoMoneda>('USD')
  const [meta, setMeta] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError('')

    const nombreLimpio = nombre.trim()
    if (!nombreLimpio) {
      setError('Poné un nombre para el espacio.')
      return
    }

    // La meta es opcional: si está vacía, se manda null
    let metaNumero: number | null = null
    if (meta.trim()) {
      metaNumero = leerMonto(meta)
      if (metaNumero === null) {
        setError('La meta tiene que ser un monto mayor a 0, con hasta 2 decimales.')
        return
      }
    }

    setEnviando(true)
    try {
      const espacio = await crearEspacio(nombreLimpio, moneda, metaNumero, token)
      onCreado(espacio)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el espacio.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <label className={styles.campo}>
        <span>Nombre</span>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Vacaciones"
          maxLength={40}
          autoFocus
        />
      </label>

      <label className={styles.campo}>
        <span>Moneda</span>
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as CodigoMoneda)}>
          {ordenMonedas.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo} · {infoMonedas[codigo].nombre}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        <span>
          Meta <small>(opcional)</small>
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          placeholder="Ej: 1500"
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.botones}>
        <button type="button" className={styles.secundario} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className={styles.principal} disabled={enviando}>
          {enviando ? 'Creando...' : 'Crear espacio'}
        </button>
      </div>
    </form>
  )
}