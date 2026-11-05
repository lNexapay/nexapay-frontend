import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './NoEncontrada.module.css'

export default function NoEncontrada() {
  const { usuario } = useUsuario()

  // Si tiene sesión lo mandamos a su billetera; si no, a la portada
  const destino = usuario ? '/inicio' : '/'
  const textoBoton = usuario ? 'Volver a mi billetera' : 'Volver al inicio'

  return (
    <main className={styles.pagina}>
      <div className={styles.contenido}>
        <span className={styles.icono}>
          <Compass size={32} />
        </span>

        <p className={styles.codigo}>404</p>
        <h1>Esta página no existe</h1>
        <p className={styles.texto}>
          Puede que la dirección esté mal escrita o que la página se haya movido.
        </p>

        <Link to={destino} className={styles.boton}>
          <ArrowLeft size={16} /> {textoBoton}
        </Link>
      </div>
    </main>
  )
}