import { Coins, ArrowLeftRight, Send, PiggyBank, Sparkles, Smartphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './Funcionalidades.module.css'

type Funcionalidad = {
  icono: LucideIcon
  titulo: string
  texto: string
}

const funcionalidades: Funcionalidad[] = [
  {
    icono: Coins,
    titulo: 'Cuatro monedas',
    texto: 'Manejá dólares, pesos argentinos, pesos colombianos y euros, y mirá tu balance total en USD.',
  },
  {
    icono: ArrowLeftRight,
    titulo: 'Conversiones claras',
    texto: 'Antes de convertir ves la comisión y cuánto vas a recibir. Sin sorpresas.',
  },
  {
    icono: Send,
    titulo: 'Transferencias',
    texto: 'Mandale plata a otra persona solo con su número de cuenta de 8 dígitos.',
  },
  {
    icono: PiggyBank,
    titulo: 'Espacios de ahorro',
    texto: 'Separá plata para cada objetivo, poné una meta y seguí tu avance.',
  },
  {
    icono: Sparkles,
    titulo: 'NEXAPAY AI',
    texto: 'Tu copiloto financiero: preguntale por tus saldos, movimientos y comisiones.',
  },
  {
    icono: Smartphone,
    titulo: 'Desde cualquier lugar',
    texto: 'Funciona en la compu y en el celular, con tu sesión siempre protegida.',
  },
]

export default function Funcionalidades() {
  return (
    <section className={styles.seccion} id="funcionalidades">
      <div className={styles.encabezado}>
        <h2>Todo lo que necesitás para manejar tu plata</h2>
        <p>Una billetera pensada para moverte entre monedas sin complicaciones.</p>
      </div>

      <div className={styles.grilla}>
        {funcionalidades.map((f) => {
          const Icono = f.icono
          return (
            <article key={f.titulo} className={styles.tarjeta}>
              <span className={styles.icono}>
                <Icono size={20} />
              </span>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}