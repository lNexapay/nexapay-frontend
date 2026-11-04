import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, ChevronRight, Plus } from 'lucide-react'
import { obtenerEspacios, porcentajeEspacio } from '../../services/espacios'
import type { Espacio } from '../../services/espacios'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './TarjetaEspacios.module.css'

const MAXIMO = 3 // cuántos espacios mostramos en el Dashboard

export default function TarjetaEspacios() {
  const { token } = useUsuario()
  const [espacios, setEspacios] = useState<Espacio[] | null>(null)
  const [error, setError] = useState('')

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

  return (
    <section className={styles.tarjeta}>
      <div className={styles.cabecera}>
        <h2>Mis espacios</h2>
        <Link to="/espacios" className={styles.verTodos}>
          Ver todos <ChevronRight size={14} />
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!error && !espacios && <p className={styles.vacio}>Cargando...</p>}

      {espacios && espacios.length === 0 && (
        <Link to="/espacios" className={styles.crear}>
          <Plus size={16} /> Creá tu primer espacio de ahorro
        </Link>
      )}

      {espacios && espacios.length > 0 && (
        <ul className={styles.lista}>
          {espacios.slice(0, MAXIMO).map((espacio) => {
            const avance = porcentajeEspacio(espacio)
            const prefijo = infoMonedas[espacio.moneda].prefijo

            return (
              <li key={espacio.id} className={styles.item}>
                <div className={styles.fila}>
                  <span className={styles.icono}>
                    <FolderOpen size={15} />
                  </span>
                  <strong className={styles.nombre}>{espacio.nombre}</strong>
                  {avance !== null && <span className={styles.porcentaje}>{avance}%</span>}
                </div>

                {avance !== null && (
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
                )}

                <small className={styles.montos}>
                  {prefijo} {formatearMonto(espacio.ahorrado)}
                  {espacio.meta ? ` de ${prefijo} ${formatearMonto(espacio.meta)}` : ''}{' '}
                  {espacio.moneda}
                </small>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}