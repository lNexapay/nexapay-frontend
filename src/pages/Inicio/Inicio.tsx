import Sidebar from '../../components/Sidebar/Sidebar'
import styles from './Inicio.module.css'

export default function Inicio() {
  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>
        <h1>Hola, Nati 👋</h1>
      </main>
    </div>
  )
}