import { Link } from 'react-router-dom'
import { ArrowLeft, Coins, LogOut, Mail, ShieldCheck, User } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import NumeroCuenta from '../../components/NumeroCuenta/NumeroCuenta'
import { useUsuario, inicial } from '../../context/UsuarioContext'
import { useCerrarSesion } from '../../hooks/useCerrarSesion'
import { infoMonedas, ordenMonedas } from '../../data/monedas'
import styles from './Perfil.module.css'

export default function Perfil() {
  const { usuario } = useUsuario()
  const salir = useCerrarSesion()
  const nombre = usuario?.nombre ?? 'Invitado'

  return (
    <AppLayout>
      <header className={styles.encabezado}>
        <Link to="/inicio" className={styles.volver}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        <h1>Mi perfil</h1>
        <p>Los datos de tu cuenta en NEXAPAY.</p>
      </header>

      <section className={styles.tarjeta}>
        <div className={styles.cabecera}>
          <span className={styles.avatar}>{inicial(nombre)}</span>
          <div>
            <h2>{nombre}</h2>
            <span className={styles.etiqueta}>
              <ShieldCheck size={14} /> Cuenta de simulación
            </span>
          </div>
        </div>

        <ul className={styles.datos}>
          <li>
            <span className={styles.icono}>
              <User size={16} />
            </span>
            <div>
              <small>Nombre</small>
              <strong>{nombre}</strong>
            </div>
          </li>

          <li>
            <span className={styles.icono}>
              <Mail size={16} />
            </span>
            <div>
              <small>Correo electrónico</small>
              <strong>{usuario?.email ?? '—'}</strong>
            </div>
          </li>

          {usuario?.cuenta && (
            <li>
              <span className={styles.icono}>
                <ShieldCheck size={16} />
              </span>
              <div>
                <small>Número de cuenta</small>
                <NumeroCuenta cuenta={usuario.cuenta} />
              </div>
            </li>
          )}

          <li>
            <span className={styles.icono}>
              <Coins size={16} />
            </span>
            <div>
              <small>Monedas habilitadas</small>
              <div className={styles.monedas}>
                {ordenMonedas.map((codigo) => (
                  <span key={codigo} className={styles.moneda} title={infoMonedas[codigo].nombre}>
                    {codigo}
                  </span>
                ))}
              </div>
            </div>
          </li>
        </ul>

        <button type="button" className={styles.salir} onClick={salir}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </section>
    </AppLayout>
  )
}