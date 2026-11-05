import { useState } from 'react'
import type { FormEvent } from 'react'
import { aportarAEspacio, retirarDeEspacio } from '../../services/espacios'
import type { Espacio } from '../../services/espacios'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import { useOperaciones } from '../../context/OperacionesContext'
import { leerMonto } from './leerMonto'
import styles from './Formularios.module.css'

type Props = {
  espacio: Espacio
  tipo: 'aportar' | 'retirar'
  onListo: (espacio: Espacio) => void
  onCancelar: () => void
}

export default function FormularioMovimiento({ espacio, tipo, onListo, onCancelar }: Props) {
  const { token } = useUsuario()
  const { operacionRealizada } = useOperaciones()
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const esRetiro = tipo === 'retirar'
  const prefijo = infoMonedas[espacio.moneda].prefijo

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError('')

    const valor = leerMonto(monto)
    if (valor === null) {
      setError('Ingresá un monto mayor a 0, con hasta 2 decimales.')
      return
    }
    if (esRetiro && valor > espacio.ahorrado) {
      setError('No podés retirar más de lo que tenés ahorrado en este espacio.')
      return
    }

    setEnviando(true)
    try {
      const mover = esRetiro ? retirarDeEspacio : aportarAEspacio
      const { espacio: actualizado } = await mover(espacio.id, valor, token)
      operacionRealizada() // para que se actualicen los saldos en el resto de la app
      onListo(actualizado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el movimiento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      <div className={styles.resumen}>
        <span>Ahorrado en este espacio</span>
        <strong>
          {prefijo} {formatearMonto(espacio.ahorrado)} {espacio.moneda}
        </strong>
      </div>

      <label className={styles.campo}>
        <span>Monto a {esRetiro ? 'retirar' : 'aportar'}</span>
        <div className={styles.conMoneda}>
          <input
            type="text"
            inputMode="decimal"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0,00"
            autoFocus
          />
          <span>{espacio.moneda}</span>
        </div>
      </label>

      {esRetiro && espacio.ahorrado > 0 && (
        <button
          type="button"
          className={styles.enlace}
          onClick={() => setMonto(String(espacio.ahorrado))}
        >
          Retirar todo
        </button>
      )}

      <p className={styles.nota}>
        {esRetiro
          ? `La plata vuelve a tu saldo disponible en ${espacio.moneda}.`
          : `La plata sale de tu saldo disponible en ${espacio.moneda}.`}
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.botones}>
        <button type="button" className={styles.secundario} onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className={styles.principal} disabled={enviando}>
          {enviando ? 'Procesando...' : esRetiro ? 'Retirar' : 'Aportar'}
        </button>
      </div>
    </form>
  )
}