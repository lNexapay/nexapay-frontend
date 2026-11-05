import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import TarjetaActividad from '../Inicio/TarjetaActividad'
import FiltrosHistorial from './FiltrosHistorial'
import type { Filtros } from './FiltrosHistorial'
import styles from './Historial.module.css'

const SIN_FILTROS: Filtros = { tipo: 'todos', moneda: 'todas' }

export default function Historial() {
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS)

  return (
    <AppLayout>
      <header className={styles.encabezado}>
        <Link to="/inicio" className={styles.volver}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1>Historial</h1>
        <p>Todos tus depósitos, conversiones y transferencias.</p>
      </header>

      <FiltrosHistorial filtros={filtros} onChange={setFiltros} />

      <TarjetaActividad
        completo
        filtros={filtros}
        alLimpiarFiltros={() => setFiltros(SIN_FILTROS)}
      />
    </AppLayout>
  )
}