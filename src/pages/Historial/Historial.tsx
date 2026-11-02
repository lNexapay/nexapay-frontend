import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import TarjetaActividad from '../Inicio/TarjetaActividad'
import styles from './Historial.module.css'

export default function Historial() {
  return (
    <AppLayout>
      <header className={styles.encabezado}>
        <Link to="/inicio" className={styles.volver}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1>Historial</h1>
        <p>Todos tus depósitos, conversiones y transferencia.</p>
      </header>

      <TarjetaActividad completo />
    </AppLayout>
  )
}