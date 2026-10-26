import { NavLink } from 'react-router-dom'
import { Plus, LayoutGrid, Coins, FolderOpen, Sparkles, CircleUser } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Logo from '../Logo/Logo'
import { useUsuario, inicial } from '../../context/UsuarioContext'
import styles from './Sidebar.module.css'

type ItemMenu = {
  ruta: string
  texto: string
  icono: LucideIcon
  etiqueta?: string
}

const menu: ItemMenu[] = [
  { ruta: '/inicio', texto: 'Inicio', icono: LayoutGrid },
  { ruta: '/monedas', texto: 'Monedas', icono: Coins },
  { ruta: '/espacios', texto: 'Mis espacios', icono: FolderOpen },
  { ruta: '/ai', texto: 'NEXAPAY AI', icono: Sparkles, etiqueta: 'COPILOTO' },
]

export default function Sidebar() {
  const { usuario } = useUsuario()
  const nombre = usuario?.nombre ?? 'Invitado'

  return (
    <aside className={styles.sidebar}>
      <Logo />

      <button type="button" className={styles.nueva}>
        <Plus size={16} /> Nueva Operación
      </button>

      <nav className={styles.menu}>
        {menu.map((item) => {
          const Icono = item.icono
          return (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.activo}` : styles.item
              }
            >
              <Icono size={16} />
              {item.texto}
              {item.etiqueta && <span className={styles.etiqueta}>{item.etiqueta}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className={styles.usuario}>
        <span className={styles.avatar}>{inicial(nombre)}</span>
        <div className={styles.usuarioTexto}>
          <strong>Hola, {nombre}</strong>
          <small>{usuario?.email}</small>
        </div>
        <CircleUser size={18} className={styles.perfil} />
      </div>
    </aside>
  )
}