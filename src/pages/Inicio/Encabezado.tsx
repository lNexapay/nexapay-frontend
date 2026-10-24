import { Bell } from 'lucide-react'
import styles from './Encabezado.module.css'

export default function Encabezado() {
  return (
    <header className={styles.encabezado}>
      <div>
        <h1 className={styles.saludo}>
          Hola, Nati 👋 <span className={styles.entorno}>Entorno Demo</span>
        </h1>
        <p className={styles.subtitulo}>
          Seguimos construyendo tu futuro con algoritmos en tiempo real
        </p>
      </div>

      <div className={styles.acciones}>
        <span className={styles.simulacion}>
          <span className={styles.puntoVerde} /> Simulación Activa
        </span>
        <span className={styles.modo}>Modo Demo</span>
        <button type="button" className={styles.campana} aria-label="Notificaciones">
          <Bell size={18} />
          <span className={styles.notificacion} />
        </button>
        <span className={styles.avatar}>N</span>
      </div>
    </header>
  )
}