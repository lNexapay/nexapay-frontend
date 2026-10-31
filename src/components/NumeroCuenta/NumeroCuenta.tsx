import { useEffect, useState } from 'react'
import { Landmark, Copy, Check } from 'lucide-react'
import styles from './NumeroCuenta.module.css'

type Props = {
  cuenta: string
}

// "58301742" → "5830 1742"
function formatear(cuenta: string) {
  return cuenta.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export default function NumeroCuenta({ cuenta }: Props) {
  const [copiado, setCopiado] = useState(false)

  // El "¡Copiado!" desaparece solo después de 1,5 segundos
  useEffect(() => {
    if (!copiado) return
    const temporizador = setTimeout(() => setCopiado(false), 1500)
    return () => clearTimeout(temporizador)
  }, [copiado])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(cuenta)
      setCopiado(true)
    } catch {
      // Si el navegador no deja copiar, no hacemos nada
    }
  }

  return (
    <div className={styles.cuenta}>
      <Landmark size={14} />
      <span>
        Cuenta: <strong>{formatear(cuenta)}</strong>
      </span>
      <button
        type="button"
        className={styles.copiar}
        onClick={copiar}
        aria-label="Copiar número de cuenta"
        title={copiado ? '¡Copiado!' : 'Copiar'}
      >
        {copiado ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {copiado && <span className={styles.aviso}>¡Copiado!</span>}
    </div>
  )
}