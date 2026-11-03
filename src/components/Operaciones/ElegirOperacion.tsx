import { Plus, ArrowLeftRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useOperaciones } from '../../context/OperacionesContext'
import type { TipoOperacion } from '../../context/OperacionesContext'
import styles from './ElegirOperacion.module.css'

type Opcion = {
  tipo: TipoOperacion
  titulo: string
  texto: string
  icono: LucideIcon
  color: string
}

const opciones: Opcion[] = [
  {
    tipo: 'deposito',
    titulo: 'Ingresar dinero',
    texto: 'Sumá saldo a tu billetera',
    icono: Plus,
    color: styles.verde,
  },
  {
    tipo: 'conversion',
    titulo: 'Convertir moneda',
    texto: 'Cambiá entre USD, ARS, COP y EUR',
    icono: ArrowLeftRight,
    color: styles.azul,
  },
  {
    tipo: 'transferencia',
    titulo: 'Transferir',
    texto: 'Enviá dinero a otra cuenta',
    icono: ArrowUpRight,
    color: styles.violeta,
  },
]

export default function ElegirOperacion() {
  const { abrirOperacion } = useOperaciones()

  return (
    <div className={styles.lista}>
      {opciones.map((opcion) => {
        const Icono = opcion.icono
        return (
          <button
            key={opcion.tipo}
            type="button"
            className={styles.opcion}
            onClick={() => abrirOperacion(opcion.tipo)}
          >
            <span className={`${styles.icono} ${opcion.color}`}>
              <Icono size={18} />
            </span>
            <span className={styles.textos}>
              <strong>{opcion.titulo}</strong>
              <small>{opcion.texto}</small>
            </span>
            <ChevronRight size={16} className={styles.flecha} />
          </button>
        )
      })}
    </div>
  )
}