import Sidebar from '../../components/Sidebar/Sidebar'
import MenuInferior from '../../components/MenuInferior/MenuInferior'
import Encabezado from './Encabezado'
import TarjetaBalance from './TarjetaBalance'
import TarjetaActividad from './TarjetaActividad'
import TarjetaAI from './TarjetaAI'
import styles from './Inicio.module.css'

export default function Inicio() {
  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>
        <Encabezado />

        <div className={styles.grilla}>
          <div className={styles.columna}>
            <TarjetaBalance />
            <TarjetaActividad />
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