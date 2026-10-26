import type { Moneda } from '../../data/monedas'
import { formatearMonto } from '../../data/monedas'
import styles from './TarjetaMoneda.module.css'

type Props = {
  moneda: Moneda
  visible: boolean
}

export default function TarjetaMoneda({ moneda, visible }: Props) {
  const prefijo = moneda.codigo === 'EUR' ? '€' : '$'

  return (
    <div className={styles.tarjeta}>
      <span className={styles.icono}>{moneda.simbolo}</span>
      <div className={styles.info}>
        <small>{moneda.nombre}</small>
        <strong>{visible ? `${prefijo} ${formatearMonto(moneda.saldo)}` : `${prefijo} ••••`}</strong>
      </div>
      <span className={styles.codigo}>{moneda.codigo}</span>
    </div>
  )
}