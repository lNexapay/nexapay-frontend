import { useState } from 'react'
import type { ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './Input.module.css'

type Props = {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (valor: string) => void
  icono: LucideIcon
  accion?: ReactNode
}

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icono: Icono,
  accion,
}: Props) {
  const [verPassword, setVerPassword] = useState(false)
  const esPassword = type === 'password'
  const tipoReal = esPassword && verPassword ? 'text' : type

  return (
    <div className={styles.campo}>
      <div className={styles.labelFila}>
        <label htmlFor={id}>{label}</label>
        {accion}
      </div>
      <div className={styles.input}>
        <Icono size={16} />
        <input
          id={id}
          type={tipoReal}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {esPassword && (
          <button
            type="button"
            className={styles.ojo}
            onClick={() => setVerPassword(!verPassword)}
            aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}