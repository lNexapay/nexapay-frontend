import { useState } from 'react'
import { ArrowLeftRight, Plus, ArrowUpRight } from 'lucide-react'
import Modal from '../../components/Modal/Modal'
import FormularioDeposito from './FormularioDeposito'
import styles from './AccionesBalance.module.css'

type Props = {
  onOperacion?: () => void
}

export default function AccionesBalance({ onOperacion }: Props) {
  const [modal, setModal] = useState<'deposito' | null>(null)

  function cerrar() {
    setModal(null)
  }

  function alTerminar() {
    cerrar()
    onOperacion?.()
  }

  return (
    <>
      <div className={styles.acciones}>
        <button type="button" className={`${styles.boton} ${styles.principal}`}>
          <ArrowLeftRight size={15} /> Convertir
        </button>
        <button type="button" className={styles.boton} onClick={() => setModal('deposito')}>
          <Plus size={15} /> Ingresar
        </button>
        <button type="button" className={styles.boton}>
          <ArrowUpRight size={15} /> Transferir
        </button>
      </div>

      <Modal titulo="Ingresar dinero" abierto={modal === 'deposito'} onCerrar={cerrar}>
        <FormularioDeposito onListo={alTerminar} />
      </Modal>
    </>
  )
}