import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react'
import Logo from '../../components/Logo/Logo'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './Landing.module.css'

// Monedas de ejemplo para la tarjeta de la portada (no son datos reales)
const ejemploMonedas = [
  { codigo: 'USD', monto: '$ 1.250,00' },
  { codigo: 'ARS', monto: '$ 480.000' },
  { codigo: 'COP', monto: '$ 2.100.000' },
  { codigo: 'EUR', monto: '€ 320,00' },
]

export default function Landing() {
  const { usuario } = useUsuario()

  // Si ya inició sesión, no le mostramos la portada
  if (usuario) return <Navigate to="/inicio" replace />

  return (
    <div className={styles.pagina}>
      <header className={styles.barra}>
        <Logo />
        <nav className={styles.accesos}>
          <Link to="/login" className={styles.ingresar}>
            Iniciar sesión
          </Link>
          <Link to="/registro" className={styles.crear}>
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.portada}>
          <div className={styles.texto}>
            <span className={styles.etiqueta}>
              <Sparkles size={14} /> Billetera multimoneda con IA
            </span>
            <h1>
              Tu plata en <span>cuatro monedas</span>, en una sola billetera
            </h1>
            <p>
              Guardá, convertí y transferí dólares, pesos argentinos, pesos colombianos y euros.
              Separá tus ahorros por objetivos y preguntale a NEXAPAY AI cómo vas.
            </p>

            <div className={styles.botones}>
              <Link to="/registro" className={styles.principal}>
                Crear mi cuenta gratis <ArrowRight size={18} />
              </Link>
              <Link to="/login" className={styles.secundario}>
                Ya tengo cuenta
              </Link>
            </div>

            <p className={styles.aviso}>
              <ShieldCheck size={14} /> Entorno de simulación: usás fondos ficticios, sin datos
              bancarios reales.
            </p>
          </div>

          <div className={styles.visual} aria-hidden="true">
            <div className={styles.tarjeta}>
              <div className={styles.tarjetaFila}>
                <span>Balance total estimado</span>
                <span className={styles.subida}>
                  <TrendingUp size={12} /> Ejemplo
                </span>
              </div>
              <p className={styles.monto}>
                $ 2.840,50 <span>USD</span>
              </p>
              <div className={styles.monedas}>
                {ejemploMonedas.map((m) => (
                  <div key={m.codigo} className={styles.moneda}>
                    <strong>{m.codigo}</strong>
                    <span>{m.monto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}