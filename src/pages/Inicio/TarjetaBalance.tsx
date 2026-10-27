import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { obtenerBalanceTotal } from '../../services/billetera'
import type { BalanceTotal } from '../../services/billetera'
import { ordenMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import TarjetaMoneda from './TarjetaMoneda'
import AccionesBalance from './AccionesBalance'
import styles from './TarjetaBalance.module.css'

export default function TarjetaBalance() {
  const { token } = useUsuario()
  const [visible, setVisible] = useState(true)
  const [balance, setBalance] = useState<BalanceTotal | null>(null)
  const [error, setError] = useState('')

  // Al abrir el Dashboard, pedimos los saldos al back
  useEffect(() => {
    let activo = true

    obtenerBalanceTotal(token)
      .then((datos) => {
        if (activo) setBalance(datos)
      })
      .catch((err: Error) => {
        if (activo) setError(err.message)
      })

    return () => {
      activo = false
    }
  }, [token])

  // Ordenamos las monedas como en el diseño: USD, ARS, COP, EUR
  const monedas = balance
    ? [...balance.monedas].sort(
        (a, b) => ordenMonedas.indexOf(a.codigo) - ordenMonedas.indexOf(b.codigo),
      )
    : []

  function textoTotal() {
    if (error) return '—'
    if (!balance) return 'Cargando...'
    return visible ? `$ ${formatearMonto(balance.total)}` : '$ ••••••'
  }

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
            {textoTotal()} {balance && <span>{balance.monedaBase}</span>}
          </p>
        </div>

        <AccionesBalance />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.monedas}>
        {monedas.map((m) => (
          <TarjetaMoneda key={m.codigo} saldo={m} visible={visible} />
        ))}
      </div>
    </section>
  )
}