import { NavLink } from 'react-router-dom'
import { LayoutGrid, Coins, FolderOpen, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
  { ruta: '/ai', texto: 'NEXAPAY AI', icono: Sparkles },
]

export default function MenuInferior() {
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
    </nav>
  )
}