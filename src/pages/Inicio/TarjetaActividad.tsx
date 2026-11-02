import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowLeftRight, ChevronRight } from 'lucide-react'
import { obtenerOperaciones } from '../../services/billetera'
import type { Operacion, CodigoMoneda } from '../../services/billetera'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './TarjetaActividad.module.css'

type Props = {
  actualizacion?: number
  completo?: boolean // true: muestra todo el historial (sin "Ver todo")
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

export default function TarjetaActividad({ actualizacion = 0, completo = false }: Props) {
  const { token } = useUsuario()
  const [operaciones, setOperaciones] = useState<Operacion[] | null>(null)
  const [error, setError] = useState('')

  // En el Dashboard mostramos las últimas 5; en el historial, hasta 100 (el máximo del back)
  const limite = completo ? 100 : 5

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
  }, [token, actualizacion, limite])

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

      {operaciones && operaciones.length > 0 && (
        <ul className={styles.lista}>
          {operaciones.map((op) => {
            const esDeposito = op.tipo === 'deposito'
            const Icono = esDeposito ? ArrowDown : ArrowLeftRight

            const titulo = esDeposito
              ? op.descripcion || `Depósito en ${op.monedaDestino}`
              : `Conversión ${op.monedaOrigen} a ${op.monedaDestino}`

            const detalle = esDeposito
              ? formatearFecha(op.fecha)
              : `${formatearFecha(op.fecha)} • Tasa ${op.tasa}`

            return (
              <li key={op.id} className={styles.item}>
                <span
                  className={`${styles.icono} ${esDeposito ? styles.ingreso : styles.conversion}`}
                >
                  <Icono size={16} />
                </span>

                <div className={styles.info}>
                  <strong>{titulo}</strong>
                  <small>{detalle}</small>
                </div>

                <div className={styles.monto}>
                  {esDeposito ? (
                    <>
                      <strong className={styles.positivo}>
                        + {montoConMoneda(op.montoDestino, op.monedaDestino)}
                      </strong>
                      <small>{op.estado === 'completed' ? 'Completado' : op.estado}</small>
                    </>
                  ) : (
                    <>
                      <strong>- {montoConMoneda(op.montoOrigen, op.monedaOrigen)}</strong>
                      <small>+ {montoConMoneda(op.montoDestino, op.monedaDestino)}</small>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}