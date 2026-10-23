import { Wallet } from 'lucide-react'
import styles from './Logo.module.css'

export default function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.icono}>
        <Wallet size={18} />
      </div>
      <div>
        <strong>NEXAPAY</strong>
        <span>Billetera Multidivisa</span>
      </div>
    </div>
  )
}