import { ArrowDown, ArrowLeftRight, PiggyBank, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { movimientos } from '../../data/movimientos'
import type { TipoMovimiento } from '../../data/movimientos'
import { formatearMonto } from '../../data/monedas'
import styles from './TarjetaActividad.module.css'

// Ícono y color según el tipo de movimiento
const estilosPorTipo: Record<TipoMovimiento, { icono: LucideIcon; clase: string }> = {
  ingreso: { icono: ArrowDown, clase: styles.ingreso },
  conversion: { icono: ArrowLeftRight, clase: styles.conversion },
  aporte: { icono: PiggyBank, clase: styles.aporte },
}

export default function TarjetaActividad() {
  return (
    <section className={styles.tarjeta}>
      <div className={styles.cabecera}>
        <h2>
          Actividad simulada reciente <span className={styles.chip}>Hoy</span>
        </h2>
        <a href="#" className={styles.verTodo}>
          Ver todo el historial <ChevronRight size={14} />
        </a>
      </div>

      <ul className={styles.lista}>
        {movimientos.map((mov) => {
          const { icono: Icono, clase } = estilosPorTipo[mov.tipo]
          const signo = mov.monto > 0 ? '+' : '-'
          const prefijo = mov.moneda === 'EUR' ? '€' : '$'

          return (
            <li key={mov.id} className={styles.item}>
              <span className={`${styles.icono} ${clase}`}>
                <Icono size={16} />
              </span>

              <div className={styles.info}>
                <strong>{mov.titulo}</strong>
                <small>{mov.detalle}</small>
              </div>

              <div className={styles.monto}>
                <strong className={mov.monto > 0 ? styles.positivo : ''}>
                  {signo} {prefijo} {formatearMonto(Math.abs(mov.monto))} {mov.moneda}
                </strong>
                <small>{mov.nota}</small>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}