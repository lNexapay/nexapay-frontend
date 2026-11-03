import { NavLink } from 'react-router-dom'
import { Plus, LayoutGrid, Coins, FolderOpen, Sparkles, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Logo from '../Logo/Logo'
import NumeroCuenta from '../NumeroCuenta/NumeroCuenta'
import { useUsuario, inicial } from '../../context/UsuarioContext'
import { useChat } from '../../context/ChatContext'
import { useOperaciones } from '../../context/OperacionesContext'
import { useCerrarSesion } from '../../hooks/useCerrarSesion'
import styles from './Sidebar.module.css'

type ItemMenu = {
  ruta: string
  texto: string
  icono: LucideIcon
}

const menu: ItemMenu[] = [
  { ruta: '/inicio', texto: 'Inicio', icono: LayoutGrid },
  { ruta: '/monedas', texto: 'Monedas', icono: Coins },
  { ruta: '/espacios', texto: 'Mis espacios', icono: FolderOpen },
]

export default function Sidebar() {
  const { usuario } = useUsuario()
  const { abierto, abrirChat } = useChat()
  const { abrirOperacion } = useOperaciones()
  const salir = useCerrarSesion()
  const nombre = usuario?.nombre ?? 'Invitado'

  return (
    <aside className={styles.sidebar}>
      <Logo />

      <button type="button" className={styles.nueva} onClick={() => abrirOperacion('elegir')}>
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
            </NavLink>
          )
        })}

        {/* NEXAPAY AI no es una página: abre el chat flotante */}
        <button
          type="button"
          className={`${styles.item} ${styles.itemBoton} ${abierto ? styles.activo : ''}`}
          onClick={abrirChat}
        >
          <Sparkles size={16} />
          NEXAPAY AI
          <span className={styles.etiqueta}>COPILOTO</span>
        </button>
      </nav>

      <div className={styles.pie}>
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

        {usuario?.cuenta && (
          <div className={styles.cuenta}>
            <NumeroCuenta cuenta={usuario.cuenta} compacto />
          </div>
        )}
      </div>
    </aside>
  )
}