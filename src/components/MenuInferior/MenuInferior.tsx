import { NavLink } from 'react-router-dom'
import { LayoutGrid, Coins, FolderOpen, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import styles from './MenuInferior.module.css'

type Item = {
  ruta: string
  texto: string
  icono: LucideIcon
}

const items: Item[] = [
  { ruta: '/inicio', texto: 'Inicio', icono: LayoutGrid },
  { ruta: '/monedas', texto: 'Monedas', icono: Coins },
  { ruta: '/espacios', texto: 'Espacios', icono: FolderOpen },
]

export default function MenuInferior() {
  const { abierto, abrirChat } = useChat()

  return (
    <nav className={styles.menu}>
      {items.map((item) => {
        const Icono = item.icono
        return (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.activo}` : styles.item
            }
          >
            <Icono size={20} />
            <span>{item.texto}</span>
          </NavLink>
        )
      })}

      {/* NEXAPAY AI abre el chat flotante */}
      <button
        type="button"
        className={`${styles.item} ${styles.itemBoton} ${abierto ? styles.activo : ''}`}
        onClick={abrirChat}
      >
        <Sparkles size={20} />
        <span>NEXAPAY AI</span>
      </button>
    </nav>
  )
}