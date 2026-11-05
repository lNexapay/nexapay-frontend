import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { obtenerOperaciones } from '../../services/billetera'
import type { Operacion, CodigoMoneda } from '../../services/billetera'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import { useOperaciones } from '../../context/OperacionesContext'
import styles from './Notificaciones.module.css'

type Props = {
  claseBoton: string // el estilo de la campanita viene del Encabezado
  clasePunto: string // el puntito rojo, también del Encabezado
}

type Aviso = {
  Icono: LucideIcon
  clase: string
  texto: string
}

const CANTIDAD = 8 // cuántos movimientos mostramos
const CADA_CUANTO = 60_000 // revisa si hay novedades cada 1 minuto

// ---------- Guardar cuándo se abrió por última vez ----------

function leerUltimaVista(clave: string): number {
  try {
    return Number(localStorage.getItem(clave)) || 0
  } catch {
    return 0
  }
}

function guardarUltimaVista(clave: string, momento: number) {
  try {
    localStorage.setItem(clave, String(momento))
  } catch {
    // Si el navegador no deja guardar, simplemente no se recuerda
  }
}

// ---------- Textos ----------

function monto(valor: number, codigo: CodigoMoneda) {
  return `${infoMonedas[codigo].prefijo} ${formatearMonto(valor)} ${codigo}`
}

// "Recién", "Hace 5 min", "Hace 2 h", "Ayer", "Hace 3 días" o "25/10"
function haceCuanto(fecha: Date) {
  const minutos = Math.floor((Date.now() - fecha.getTime()) / 60_000)
  if (minutos < 1) return 'Recién'
  if (minutos < 60) return `Hace ${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Hace ${horas} h`

  const dias = Math.floor(horas / 24)
  if (dias === 1) return 'Ayer'
  if (dias < 7) return `Hace ${dias} días`

  return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

function armarAviso(op: Operacion): Aviso {
  switch (op.tipo) {
    case 'transferencia_recibida':
      return {
        Icono: ArrowDownLeft,
        clase: styles.verde,
        texto: `Recibiste ${monto(op.montoOrigen, op.monedaOrigen)}`,
      }
    case 'transferencia_enviada':
      return {
        Icono: ArrowUpRight,
        clase: styles.naranja,
        texto: `Enviaste ${monto(op.montoOrigen, op.monedaOrigen)}`,
      }
    case 'deposito':
      return {
        Icono: ArrowDown,
        clase: styles.verde,
        texto: `Ingresaste ${monto(op.montoDestino, op.monedaDestino)}`,
      }
    default:
      return {
        Icono: ArrowLeftRight,
        clase: styles.azul,
        texto: `Convertiste ${monto(op.montoOrigen, op.monedaOrigen)} a ${op.monedaDestino}`,
      }
  }
}

// ---------- Componente ----------

export default function Notificaciones({ claseBoton, clasePunto }: Props) {
  const { usuario, token } = useUsuario()
  const { version } = useOperaciones()

  // Cada cuenta guarda su propia "última vista"
  const clave = `nexapay-notificaciones-${usuario?.cuenta ?? 'sin-cuenta'}`

  const [abierto, setAbierto] = useState(false)
  const [operaciones, setOperaciones] = useState<Operacion[] | null>(null)
  const [error, setError] = useState('')
  const [ultimaVista, setUltimaVista] = useState(() => leerUltimaVista(clave))
  const [resaltarDesde, setResaltarDesde] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Pide los movimientos al entrar, después de cada operación y cada 1 minuto
  useEffect(() => {
    if (!token) return
    let activo = true

    function cargar() {
      obtenerOperaciones(token, CANTIDAD)
        .then((datos) => {
          if (activo) {
            setOperaciones(datos)
            setError('')
          }
        })
        .catch((err: Error) => {
          if (activo) setError(err.message)
        })
    }

    cargar()
    const intervalo = setInterval(cargar, CADA_CUANTO)

    return () => {
      activo = false
      clearInterval(intervalo)
    }
  }, [token, version])

  // Cerrar al tocar afuera o con Escape
  useEffect(() => {
    if (!abierto) return

    function alTocarAfuera(e: PointerEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false)
    }
    function alApretarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }

    document.addEventListener('pointerdown', alTocarAfuera)
    document.addEventListener('keydown', alApretarTecla)
    return () => {
      document.removeEventListener('pointerdown', alTocarAfuera)
      document.removeEventListener('keydown', alApretarTecla)
    }
  }, [abierto])

  const nuevas = operaciones?.filter((op) => op.fecha.getTime() > ultimaVista).length ?? 0

  function alternar() {
    if (abierto) {
      setAbierto(false)
      return
    }

    // Resaltamos las que eran nuevas y las marcamos como vistas
    setResaltarDesde(ultimaVista)
    const masReciente = Math.max(Date.now(), ...(operaciones ?? []).map((op) => op.fecha.getTime()))
    setUltimaVista(masReciente)
    guardarUltimaVista(clave, masReciente)
    setAbierto(true)
  }

  return (
    <div className={styles.contenedor} ref={contenedorRef}>
      <button
        type="button"
        className={claseBoton}
        onClick={alternar}
        aria-label={nuevas > 0 ? `Notificaciones, ${nuevas} nuevas` : 'Notificaciones'}
        aria-expanded={abierto}
      >
        <Bell size={18} />
        {nuevas > 0 && <span className={clasePunto} />}
      </button>

      {abierto && (
        <div className={styles.panel} role="dialog" aria-label="Notificaciones">
          <div className={styles.cabecera}>
            <strong>Notificaciones</strong>
            <small>Últimos movimientos</small>
          </div>

          {error && <p className={styles.vacio}>{error}</p>}

          {!error && !operaciones && <p className={styles.vacio}>Cargando...</p>}

          {operaciones && operaciones.length === 0 && (
            <p className={styles.vacio}>Todavía no tenés notificaciones.</p>
          )}

          {operaciones && operaciones.length > 0 && (
            <ul className={styles.lista}>
              {operaciones.map((op) => {
                const aviso = armarAviso(op)
                const Icono = aviso.Icono
                const esNueva = op.fecha.getTime() > resaltarDesde

                return (
                  <li key={op.id} className={`${styles.item} ${esNueva ? styles.nueva : ''}`}>
                    <span className={`${styles.icono} ${aviso.clase}`}>
                      <Icono size={16} />
                    </span>
                    <div className={styles.texto}>
                      <span>{aviso.texto}</span>
                      <small>{haceCuanto(op.fecha)}</small>
                    </div>
                    {esNueva && <span className={styles.puntoNueva} aria-label="Nueva" />}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}