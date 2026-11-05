import { useCallback, useEffect, useState } from 'react'
import { FolderOpen, Minus, Plus } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import Modal from '../../components/Modal/Modal'
import { obtenerEspacios, porcentajeEspacio } from '../../services/espacios'
import type { Espacio } from '../../services/espacios'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import FormularioEspacio from './FormularioEspacio'
import FormularioMovimiento from './FormularioMovimiento'
import styles from './Espacios.module.css'

// Qué ventana está abierta (o ninguna)
type ModalAbierto =
  | { tipo: 'crear' }
  | { tipo: 'aportar' | 'retirar'; espacio: Espacio }
  | null

function tituloModal(modal: ModalAbierto) {
  if (!modal) return ''
  if (modal.tipo === 'crear') return 'Nuevo espacio'
  if (modal.tipo === 'aportar') return `Aportar a "${modal.espacio.nombre}"`
  return `Retirar de "${modal.espacio.nombre}"`
}

export default function Espacios() {
  const { token } = useUsuario()
  const [espacios, setEspacios] = useState<Espacio[] | null>(null)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<ModalAbierto>(null)

  useEffect(() => {
    let activo = true

    obtenerEspacios(token)
      .then((datos) => {
        if (activo) {
          setEspacios(datos)
          setError('')
        }
      })
      .catch((err: Error) => {
        if (activo) setError(err.message)
      })

    return () => {
      activo = false
    }
  }, [token])

  const cerrarModal = useCallback(() => setModal(null), [])

  // Suma el espacio nuevo al principio de la lista
  function alCrear(nuevo: Espacio) {
    setEspacios((anteriores) => [nuevo, ...(anteriores ?? [])])
    setModal(null)
  }

  // Reemplaza el espacio que cambió después de aportar o retirar
  function alMover(actualizado: Espacio) {
    setEspacios((anteriores) =>
      anteriores ? anteriores.map((e) => (e.id === actualizado.id ? actualizado : e)) : anteriores,
    )
    setModal(null)
  }

  return (
    <AppLayout>
      <header className={styles.encabezado}>
        <div className={styles.encabezadoFila}>
          <div>
            <h1>Mis espacios</h1>
            <p>Separá plata de tu billetera para cada objetivo y seguí cuánto llevás ahorrado.</p>
          </div>
          {espacios && espacios.length > 0 && (
            <button type="button" className={styles.nuevo} onClick={() => setModal({ tipo: 'crear' })}>
              <Plus size={16} /> Nuevo espacio
            </button>
          )}
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!error && !espacios && <p className={styles.vacio}>Cargando...</p>}

      {espacios && espacios.length === 0 && (
        <div className={styles.sinEspacios}>
          <FolderOpen size={28} />
          <strong>Todavía no tenés espacios</strong>
          <p>Creá uno para empezar a ahorrar para un objetivo.</p>
          <button type="button" className={styles.nuevo} onClick={() => setModal({ tipo: 'crear' })}>
            <Plus size={16} /> Crear mi primer espacio
          </button>
        </div>
      )}

      {espacios && espacios.length > 0 && (
        <div className={styles.grilla}>
          {espacios.map((espacio) => {
            const avance = porcentajeEspacio(espacio)
            const prefijo = infoMonedas[espacio.moneda].prefijo

            return (
              <article key={espacio.id} className={styles.tarjeta}>
                <div className={styles.cabecera}>
                  <span className={styles.icono}>
                    <FolderOpen size={18} />
                  </span>
                  <div className={styles.titulo}>
                    <strong>{espacio.nombre}</strong>
                    <small>{infoMonedas[espacio.moneda].nombre}</small>
                  </div>
                  {avance !== null && <span className={styles.porcentaje}>{avance}%</span>}
                </div>

                <p className={styles.ahorrado}>
                  {prefijo} {formatearMonto(espacio.ahorrado)} <span>{espacio.moneda}</span>
                </p>

                {avance !== null ? (
                  <>
                    <div
                      className={styles.barra}
                      role="progressbar"
                      aria-valuenow={avance}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Avance de ${espacio.nombre}`}
                    >
                      <div style={{ width: `${avance}%` }} />
                    </div>
                    <small className={styles.meta}>
                      Meta: {prefijo} {formatearMonto(espacio.meta ?? 0)} {espacio.moneda}
                    </small>
                  </>
                ) : (
                  <small className={styles.meta}>Sin meta definida</small>
                )}

                <div className={styles.acciones}>
                  <button
                    type="button"
                    className={styles.accion}
                    onClick={() => setModal({ tipo: 'aportar', espacio })}
                  >
                    <Plus size={14} /> Aportar
                  </button>
                  <button
                    type="button"
                    className={`${styles.accion} ${styles.accionSecundaria}`}
                    onClick={() => setModal({ tipo: 'retirar', espacio })}
                    disabled={espacio.ahorrado <= 0}
                  >
                    <Minus size={14} /> Retirar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal titulo={tituloModal(modal)} abierto={modal !== null} onCerrar={cerrarModal}>
        {modal?.tipo === 'crear' && (
          <FormularioEspacio onCreado={alCrear} onCancelar={cerrarModal} />
        )}
        {modal && modal.tipo !== 'crear' && (
          <FormularioMovimiento
            key={`${modal.tipo}-${modal.espacio.id}`}
            espacio={modal.espacio}
            tipo={modal.tipo}
            onListo={alMover}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>
    </AppLayout>
  )
}