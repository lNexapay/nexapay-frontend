import Sidebar from '../../components/Sidebar/Sidebar'
import Encabezado from './Encabezado'
import styles from './Inicio.module.css'

export default function Inicio() {
  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>
        <Encabezado />
      </main>
    </div>
  )
}