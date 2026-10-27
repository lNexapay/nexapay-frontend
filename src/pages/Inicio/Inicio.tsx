import { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import MenuInferior from '../../components/MenuInferior/MenuInferior'
import Encabezado from './Encabezado'
import TarjetaBalance from './TarjetaBalance'
import TarjetaActividad from './TarjetaActividad'
import TarjetaAI from './TarjetaAI'
import styles from './Inicio.module.css'

export default function Inicio() {
  // Cada vez que se hace una operación, sube y las tarjetas recargan sus datos
  const [actualizacion, setActualizacion] = useState(0)

  function alHacerOperacion() {
    setActualizacion((n) => n + 1)
  }

  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>
        <Encabezado />

        <div className={styles.grilla}>
          <div className={styles.columna}>
            <TarjetaBalance actualizacion={actualizacion} onOperacion={alHacerOperacion} />
            <TarjetaActividad actualizacion={actualizacion} />
          </div>

          <div className={styles.columna}>
            <TarjetaAI />
          </div>
        </div>
      </main>
      <MenuInferior />
    </div>
  )
}