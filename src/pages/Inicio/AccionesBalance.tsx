import { ArrowLeftRight, Plus, ArrowUpRight } from 'lucide-react'
import styles from './AccionesBalance.module.css'

export default function AccionesBalance() {
  return (
    <div className={styles.acciones}>
      <button type="button" className={`${styles.boton} ${styles.principal}`}>
        <ArrowLeftRight size={15} /> Convertir
      </button>
      <button type="button" className={styles.boton}>
        <Plus size={15} /> Ingresar
      </button>
      <button type="button" className={styles.boton}>
        <ArrowUpRight size={15} /> Transferir
      </button>
    </div>
  )
}