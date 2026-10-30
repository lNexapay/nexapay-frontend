import { useEffect, useRef, useState } from 'react'
import { Bell, LogOut } from 'lucide-react'
import { useUsuario, inicial } from '../../context/UsuarioContext'
import { useCerrarSesion } from '../../hooks/useCerrarSesion'
import styles from './Encabezado.module.css'

export default function Encabezado() {
  const { usuario } = useUsuario()
  const salir = useCerrarSesion()
  const nombre = usuario?.nombre ?? 'Invitado'

  const [menuAbierto, setMenuAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Cerrar el menú al tocar afuera
  useEffect(() => {
    if (!menuAbierto) return

    function alTocarAfuera(e: PointerEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) setMenuAbierto(false)
    }

    document.addEventListener('pointerdown', alTocarAfuera)
    return () => document.removeEventListener('pointerdown', alTocarAfuera)
  }, [menuAbierto])

  return (
    <header className={styles.encabezado}>
      <div>
        <h1 className={styles.saludo}>
          Hola, {nombre} 👋 <span className={styles.entorno}>Entorno Demo</span>
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

        <div className={styles.perfil} ref={contenedorRef}>
          <button
            type="button"
            className={styles.avatar}
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú de usuario"
            aria-expanded={menuAbierto}
          >
            {inicial(nombre)}
          </button>

          {menuAbierto && (
            <div className={styles.menu} role="menu">
              <div className={styles.menuUsuario}>
                <strong>{nombre}</strong>
                <small>{usuario?.email}</small>
              </div>
              <button type="button" className={styles.menuSalir} onClick={salir} role="menuitem">
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}