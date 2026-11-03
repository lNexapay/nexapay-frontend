import { ArrowLeftRight, Plus, ArrowUpRight } from 'lucide-react'
import { useOperaciones } from '../../context/OperacionesContext'
import styles from './AccionesBalance.module.css'

export default function AccionesBalance() {
  const { abrirOperacion } = useOperaciones()

  return (
    <div className={styles.acciones}>
      <button
        type="button"
        className={`${styles.boton} ${styles.principal}`}
        onClick={() => abrirOperacion('conversion')}
      >
        <ArrowLeftRight size={15} /> Convertir
      </button>
      <button type="button" className={styles.boton} onClick={() => abrirOperacion('deposito')}>
        <Plus size={15} /> Ingresar
      </button>
      <button
        type="button"
        className={styles.boton}
        onClick={() => abrirOperacion('transferencia')}
      >
        <ArrowUpRight size={15} /> Transferir
      </button>
    </div>
  )
}