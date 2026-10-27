import type { SaldoMoneda } from '../../services/billetera'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import styles from './TarjetaMoneda.module.css'

type Props = {
  saldo: SaldoMoneda
  visible: boolean
}

export default function TarjetaMoneda({ saldo, visible }: Props) {
  const info = infoMonedas[saldo.codigo]

  return (
    <div className={styles.tarjeta}>
      <span className={styles.icono}>{info.simbolo}</span>
      <div className={styles.info}>
        <small>{info.nombre}</small>
        <strong>
          {visible ? `${info.prefijo} ${formatearMonto(saldo.saldo)}` : `${info.prefijo} ••••`}
        </strong>
      </div>
      <span className={styles.codigo}>{saldo.codigo}</span>
    </div>
  )
}