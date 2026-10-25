import { Sparkles, Globe } from 'lucide-react'
import styles from './PanelVisual.module.css'

export default function PanelVisual() {
  return (
    <aside className={styles.visual}>
      <div className={styles.top}>
        <span className={styles.chip}>
          <Sparkles size={14} /> NEXAPAY AI Copiloto v2.4
        </span>
        <span className={styles.cobertura}>
          <Globe size={14} /> Cobertura Global Multidivisa
        </span>
      </div>
    </aside>
  )
}