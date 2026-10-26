import { NavLink, useNavigate } from 'react-router-dom'
import { Plus, LayoutGrid, Coins, FolderOpen, Sparkles, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Logo from '../Logo/Logo'
import { useUsuario, inicial } from '../../context/UsuarioContext'
import { logoutUsuario } from '../../services/auth'
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
  const navigate = useNavigate()
  const { usuario, cerrarSesion } = useUsuario()
  const nombre = usuario?.nombre ?? 'Invitado'

  async function salir() {
    await logoutUsuario()
    cerrarSesion()
    navigate('/login')
  }

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
        <button
          type="button"
          className={styles.salir}
          onClick={salir}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}