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
}

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icono: Icono,
}: Props) {
  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.input}>
        <Icono size={16} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}