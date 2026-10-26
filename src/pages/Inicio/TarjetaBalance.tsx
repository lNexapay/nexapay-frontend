import { useState } from 'react'
import { Eye, EyeOff, TrendingUp } from 'lucide-react'
import { monedas, balanceTotalUSD, formatearMonto } from '../../data/monedas'
import TarjetaMoneda from './TarjetaMoneda'
import AccionesBalance from './AccionesBalance'
import styles from './TarjetaBalance.module.css'

export default function TarjetaBalance() {
  const [visible, setVisible] = useState(true)

  return (
    <section className={styles.tarjeta}>
      <div className={styles.cabecera}>
        <div>
          <div className={styles.fila}>
            <span className={styles.titulo}>Balance total estimado</span>
            <button
              type="button"
              className={styles.ojo}
              onClick={() => setVisible(!visible)}
              aria-label={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <span className={styles.chip}>Fondos Simulados</span>
          </div>

          <p className={styles.monto}>
            {visible ? `$ ${formatearMonto(balanceTotalUSD)}` : '$ ••••••'} <span>USD</span>
          </p>

          <span className={styles.variacion}>
            <TrendingUp size={12} /> +8.4%
          </span>
        </div>

        <AccionesBalance />
      </div>

      <div className={styles.monedas}>
        {monedas.map((m) => (
          <TarjetaMoneda key={m.codigo} moneda={m} visible={visible} />
        ))}
      </div>
    </section>
  )
}