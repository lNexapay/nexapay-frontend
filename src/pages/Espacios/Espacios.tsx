import { useEffect, useState } from 'react'
import { FolderOpen } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import { obtenerEspacios, porcentajeEspacio } from '../../services/espacios'
import type { Espacio } from '../../services/espacios'
import { infoMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './Espacios.module.css'

export default function Espacios() {
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
    <AppLayout>
      <header className={styles.encabezado}>
        <h1>Mis espacios</h1>
        <p>Separá plata de tu billetera para cada objetivo y seguí cuánto llevás ahorrado.</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {!error && !espacios && <p className={styles.vacio}>Cargando...</p>}

      {espacios && espacios.length === 0 && (
        <div className={styles.sinEspacios}>
          <FolderOpen size={28} />
          <strong>Todavía no tenés espacios</strong>
          <p>Creá uno para empezar a ahorrar para un objetivo.</p>
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
              </article>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}