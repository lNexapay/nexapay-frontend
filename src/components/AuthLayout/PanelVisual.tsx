import { Sparkles, Globe, TrendingUp, ShieldCheck } from 'lucide-react'
import styles from './PanelVisual.module.css'

// Datos de ejemplo: el panel es decorativo, no muestra datos reales
const ejemploMonedas = [
  { codigo: 'USD', monto: '$1.250' },
  { codigo: 'ARS', monto: '$480.000' },
  { codigo: 'COP', monto: '$2.100.000' },
  { codigo: 'EUR', monto: '€320' },
]

export default function PanelVisual() {
  return (
    <aside className={styles.visual} aria-hidden="true">
      <div className={styles.top}>
        <span className={styles.chip}>
          <Sparkles size={14} /> NEXAPAY AI Copiloto v2.4
        </span>
        <span className={styles.cobertura}>
          <Globe size={14} /> Cobertura Global Multidivisa
        </span>
      </div>

      <div className={styles.tarjetas}>
        <div className={styles.vidrio}>
          <div className={styles.balanceFila}>
            <span>Balance total estimado</span>
            <span className={styles.subida}>
              <TrendingUp size={12} /> Ejemplo
            </span>
          </div>
          <p className={styles.monto}>
            $2.840,50 <span>USD</span>
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

        <div className={styles.vidrio}>
          <div className={styles.sugerenciaFila}>
            <span className={styles.sugerenciaIcono}>
              <Sparkles size={16} />
            </span>
            <strong>Sugerencia de NEXAPAY AI</strong>
            <small>Ahora</small>
          </div>
          <p className={styles.sugerenciaTexto}>
            Tu espacio "Vacaciones" está al 75% de la meta. Con un aporte más de USD 150 la
            alcanzás.
          </p>
          <div className={styles.barra}>
            <div />
          </div>
          <div className={styles.barraInfo}>
            <span>$450,00 ahorrados</span>
            <span>Meta: $600,00 USD</span>
          </div>
        </div>
      </div>

      <div className={`${styles.vidrio} ${styles.cita}`}>
        <ShieldCheck size={28} />
        <p>
          "Finanzas simuladas, claras y pensadas para tomar mejores decisiones en cualquier
          moneda."
          <small>Fondos ficticios · Sin datos bancarios reales</small>
        </p>
      </div>
    </aside>
  )
}