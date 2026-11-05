import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { obtenerOperaciones } from '../../services/billetera'
import type { Operacion, CodigoMoneda } from '../../services/billetera'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import { useOperaciones } from '../../context/OperacionesContext'
import type { Filtros } from '../Historial/FiltrosHistorial'
import styles from './TarjetaActividad.module.css'

type Props = {
  completo?: boolean // true: muestra todo el historial (sin "Ver todo")
  filtros?: Filtros // solo se usan en el historial
  alLimpiarFiltros?: () => void
}

// Lo que se dibuja de cada operación
type Vista = {
  Icono: LucideIcon
  claseIcono: string
  titulo: string
  detalle: string
  monto: string
  positivo: boolean
  secundario: string
}

// "Hoy, 02:49", "Ayer, 18:20" o "25/10, 14:00"
function formatearFecha(fecha: Date) {
  const hoy = new Date()
  const ayer = new Date()
  ayer.setDate(hoy.getDate() - 1)

  const hora = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  if (fecha.toDateString() === hoy.toDateString()) return `Hoy, ${hora}`
  if (fecha.toDateString() === ayer.toDateString()) return `Ayer, ${hora}`
  return `${fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}, ${hora}`
}

// "$ 50,00 USD" o "€ 92,34 EUR"
function montoConMoneda(monto: number, codigo: CodigoMoneda) {
  return `${infoMonedas[codigo].prefijo} ${formatearMonto(monto)} ${codigo}`
}

function textoEstado(estado: string) {
  return estado === 'completed' ? 'Completado' : estado
}

// ¿La operación coincide con los filtros elegidos?
function cumpleFiltros(op: Operacion, filtros?: Filtros) {
  if (!filtros) return true
  if (filtros.tipo !== 'todos' && op.tipo !== filtros.tipo) return false
  if (
    filtros.moneda !== 'todas' &&
    op.monedaOrigen !== filtros.moneda &&
    op.monedaDestino !== filtros.moneda
  ) {
    return false
  }
  return true
}

// Decide ícono, título, montos y colores según el tipo de operación
function armarVista(op: Operacion): Vista {
  const fecha = formatearFecha(op.fecha)
  const nota = op.descripcion ? ` • ${op.descripcion}` : ''
  const comision =
    op.comision > 0 && op.monedaComision
      ? ` • Comisión ${formatearMonto(op.comision)} ${op.monedaComision}`
      : ''

  switch (op.tipo) {
    case 'deposito':
      return {
        Icono: ArrowDown,
        claseIcono: styles.ingreso,
        titulo: op.descripcion || `Depósito en ${op.monedaDestino}`,
        detalle: fecha,
        monto: `+ ${montoConMoneda(op.montoDestino, op.monedaDestino)}`,
        positivo: true,
        secundario: textoEstado(op.estado),
      }

    case 'transferencia_enviada':
      return {
        Icono: ArrowUpRight,
        claseIcono: styles.enviada,
        titulo: 'Transferencia enviada',
        detalle: `${fecha}${nota}${comision}`,
        monto: `- ${montoConMoneda(op.montoOrigen, op.monedaOrigen)}`,
        positivo: false,
        secundario: textoEstado(op.estado),
      }

    case 'transferencia_recibida':
      return {
        Icono: ArrowDownLeft,
        claseIcono: styles.ingreso,
        titulo: 'Transferencia recibida',
        detalle: `${fecha}${nota}`,
        monto: `+ ${montoConMoneda(op.montoOrigen, op.monedaOrigen)}`,
        positivo: true,
        secundario: textoEstado(op.estado),
      }

    default:
      return {
        Icono: ArrowLeftRight,
        claseIcono: styles.conversion,
        titulo: `Conversión ${op.monedaOrigen} a ${op.monedaDestino}`,
        detalle: `${fecha} • Tasa ${op.tasa}${comision}`,
        monto: `- ${montoConMoneda(op.montoOrigen, op.monedaOrigen)}`,
        positivo: false,
        secundario: `+ ${montoConMoneda(op.montoDestino, op.monedaDestino)}`,
      }
  }
}

export default function TarjetaActividad({ completo = false, filtros, alLimpiarFiltros }: Props) {
  const { token } = useUsuario()
  const { version } = useOperaciones()
  const [operaciones, setOperaciones] = useState<Operacion[] | null>(null)
  const [error, setError] = useState('')

  // En el Dashboard mostramos las últimas 5; en el historial, hasta 100 (el máximo del back)
  const limite = completo ? 100 : 5

  // Pide las operaciones al abrir y cada vez que se hace una nueva
  useEffect(() => {
    let activo = true

    obtenerOperaciones(token, limite)
      .then((datos) => {
        if (activo) {
          setOperaciones(datos)
          setError('')
        }
      })
      .catch((err: Error) => {
        if (activo) setError(err.message)
      })

    return () => {
      activo = false
    }
  }, [token, version, limite])

  const visibles = operaciones?.filter((op) => cumpleFiltros(op, filtros)) ?? []
  const hayFiltros = !!filtros && (filtros.tipo !== 'todos' || filtros.moneda !== 'todas')
  const hayOperaciones = !!operaciones && operaciones.length > 0

  return (
    <section className={styles.tarjeta}>
      <div className={styles.cabecera}>
        <h2>
          {completo ? 'Todas las operaciones' : 'Actividad reciente'}
          {!completo && <span className={styles.chip}>Últimas 5</span>}
        </h2>
        {!completo && (
          <Link to="/historial" className={styles.verTodo}>
            Ver todo el historial <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!error && !operaciones && <p className={styles.vacio}>Cargando...</p>}

      {operaciones && operaciones.length === 0 && (
        <p className={styles.vacio}>Todavía no hay operaciones.</p>
      )}

      {hayOperaciones && hayFiltros && (
        <p className={styles.contador}>
          Mostrando {visibles.length} de {operaciones.length} movimientos
        </p>
      )}

      {hayOperaciones && visibles.length === 0 && (
        <div className={styles.sinResultados}>
          <p>No hay movimientos con estos filtros.</p>
          {alLimpiarFiltros && (
            <button type="button" className={styles.limpiar} onClick={alLimpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {visibles.length > 0 && (
        <ul className={styles.lista}>
          {visibles.map((op) => {
            const vista = armarVista(op)
            const Icono = vista.Icono

            return (
              <li key={op.id} className={styles.item}>
                <span className={`${styles.icono} ${vista.claseIcono}`}>
                  <Icono size={16} />
                </span>

                <div className={styles.info}>
                  <strong>{vista.titulo}</strong>
                  <small>{vista.detalle}</small>
                </div>

                <div className={styles.monto}>
                  <strong className={vista.positivo ? styles.positivo : ''}>{vista.monto}</strong>
                  <small>{vista.secundario}</small>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}