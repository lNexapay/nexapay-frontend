import type { CodigoMoneda, Operacion } from '../../services/billetera'
import { ordenMonedas } from '../../data/monedas'
import styles from './FiltrosHistorial.module.css'

export type Filtros = {
  tipo: 'todos' | Operacion['tipo']
  moneda: 'todas' | CodigoMoneda
}

const OPCIONES_TIPO: { valor: Filtros['tipo']; texto: string }[] = [
  { valor: 'todos', texto: 'Todos' },
  { valor: 'deposito', texto: 'Ingresos' },
  { valor: 'conversion', texto: 'Conversiones' },
  { valor: 'transferencia_enviada', texto: 'Enviadas' },
  { valor: 'transferencia_recibida', texto: 'Recibidas' },
]

type Props = {
  filtros: Filtros
  onChange: (filtros: Filtros) => void
}

export default function FiltrosHistorial({ filtros, onChange }: Props) {
  return (
    <div className={styles.filtros}>
      <div className={styles.chips} role="group" aria-label="Filtrar por tipo">
        {OPCIONES_TIPO.map((opcion) => {
          const activo = filtros.tipo === opcion.valor

          return (
            <button
              key={opcion.valor}
              type="button"
              className={`${styles.chip} ${activo ? styles.activo : ''}`}
              aria-pressed={activo}
              onClick={() => onChange({ ...filtros, tipo: opcion.valor })}
            >
              {opcion.texto}
            </button>
          )
        })}
      </div>

      <label className={styles.moneda}>
        <span>Moneda</span>
        <select
          value={filtros.moneda}
          onChange={(e) => onChange({ ...filtros, moneda: e.target.value as Filtros['moneda'] })}
        >
          <option value="todas">Todas</option>
          {ordenMonedas.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}