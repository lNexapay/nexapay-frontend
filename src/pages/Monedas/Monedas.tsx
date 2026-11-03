import { useEffect, useState } from 'react'
import { RefreshCw, Calculator } from 'lucide-react'
import AppLayout from '../../components/AppLayout/AppLayout'
import { obtenerBalanceTotal, obtenerTasas } from '../../services/billetera'
import type { BalanceTotal, Tasas, CodigoMoneda } from '../../services/billetera'
import { infoMonedas, ordenMonedas, formatearMonto } from '../../data/monedas'
import { useUsuario } from '../../context/UsuarioContext'
import styles from './Monedas.module.css'

// Qué moneda se está editando y qué escribió el usuario
type Simulacion = {
  codigo: CodigoMoneda
  texto: string
}

// "15.000,50" o "15000.5" → 15000.5
function leerNumero(texto: string) {
  const limpio = texto.replace(/\./g, '').replace(',', '.')
  return Number(limpio) || 0
}

export default function Monedas() {
  const { token } = useUsuario()
  const [balance, setBalance] = useState<BalanceTotal | null>(null)
  const [tasas, setTasas] = useState<Tasas | null>(null)
  const [error, setError] = useState('')
  const [simulacion, setSimulacion] = useState<Simulacion | null>(null)

  // Pedimos los saldos y las tasas al mismo tiempo
  useEffect(() => {
    let activo = true

    Promise.all([obtenerBalanceTotal(token), obtenerTasas()])
      .then(([datosBalance, datosTasas]) => {
        if (!activo) return
        setBalance(datosBalance)
        setTasas(datosTasas)
        setError('')
      })
      .catch((err: Error) => {
        if (activo) setError(err.message)
      })

    return () => {
      activo = false
    }
  }, [token])

  const cargando = !error && (!balance || !tasas)

  // Saldo real del usuario en una moneda
  function saldoDe(codigo: CodigoMoneda) {
    return balance?.monedas.find((m) => m.codigo === codigo)?.saldo ?? 0
  }

  // Monto que se muestra en cada tarjeta: el saldo, o el equivalente si se está calculando
  function montoDe(codigo: CodigoMoneda) {
    if (!simulacion || !tasas) return saldoDe(codigo)
    const valor = leerNumero(simulacion.texto)
    const enBase = valor / tasas.valores[simulacion.codigo] // pasamos a USD
    return enBase * tasas.valores[codigo] // y de USD a esta moneda
  }

  // Al tocar un monto, empezamos a editar esa moneda desde el valor que tenía
  function alEnfocar(codigo: CodigoMoneda) {
    if (simulacion?.codigo === codigo) return
    const actual = montoDe(codigo)
    setSimulacion({ codigo, texto: actual ? formatearMonto(actual) : '' })
  }

  return (
    <AppLayout>
      <header className={styles.encabezado}>
        <h1>Monedas</h1>
        <p>Tocá el monto de cualquier moneda para ver cuánto equivale en las demás.</p>
        {tasas && (
          <span className={styles.actualizado}>
            <RefreshCw size={12} />
            Tasas actualizadas:{' '}
            {tasas.actualizado.toLocaleString('es-AR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </span>
        )}
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {cargando && <p className={styles.vacio}>Cargando...</p>}

      {simulacion && (
        <div className={styles.aviso}>
          <Calculator size={16} />
          <span>
            <strong>Modo calculadora:</strong> los montos son equivalentes, no tu saldo.
          </span>
          <button type="button" onClick={() => setSimulacion(null)}>
            Ver mis saldos
          </button>
        </div>
      )}

      {balance && tasas && (
        <div className={styles.grilla}>
          {ordenMonedas.map((codigo) => {
            const info = infoMonedas[codigo]
            const monto = montoDe(codigo)
            const editando = simulacion?.codigo === codigo

            return (
              <article
                key={codigo}
                className={`${styles.tarjeta} ${editando ? styles.editando : ''}`}
              >
                <div className={styles.cabecera}>
                  <span className={styles.icono}>{info.simbolo}</span>
                  <div className={styles.nombre}>
                    <strong>{info.nombre}</strong>
                    <small>{codigo}</small>
                  </div>
                </div>

                <label className={styles.montoCampo}>
                  <span className={styles.prefijo}>{info.prefijo}</span>
                  <input
                    className={styles.montoInput}
                    type="text"
                    inputMode="decimal"
                    aria-label={`Monto en ${info.nombre}`}
                    value={editando ? simulacion.texto : formatearMonto(monto)}
                    onFocus={() => alEnfocar(codigo)}
                    onChange={(e) => setSimulacion({ codigo, texto: e.target.value })}
                  />
                </label>

                {simulacion && (
                  <small className={styles.tuSaldo}>
                    Tu saldo: {info.prefijo} {formatearMonto(saldoDe(codigo))}
                  </small>
                )}

                <dl className={styles.datos}>
                  <div>
                    <dt>Equivale a</dt>
                    <dd>$ {formatearMonto(monto / tasas.valores[codigo])} USD</dd>
                  </div>
                  <div>
                    <dt>Tasa</dt>
                    <dd>
                      {codigo === tasas.base
                        ? 'Moneda base'
                        : `1 ${tasas.base} = ${formatearMonto(tasas.valores[codigo])} ${codigo}`}
                    </dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}