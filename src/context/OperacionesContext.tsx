import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type TipoOperacion = 'elegir' | 'deposito' | 'conversion' | 'transferencia'

type OperacionesContextType = {
  abierta: TipoOperacion | null
  abrirOperacion: (tipo: TipoOperacion) => void
  cerrarOperacion: () => void
  version: number // sube cada vez que se hace una operación
  operacionRealizada: () => void
}

const OperacionesContext = createContext<OperacionesContextType | null>(null)

export function OperacionesProvider({ children }: { children: ReactNode }) {
  const [abierta, setAbierta] = useState<TipoOperacion | null>(null)
  const [version, setVersion] = useState(0)

  return (
    <OperacionesContext.Provider
      value={{
        abierta,
        abrirOperacion: (tipo) => setAbierta(tipo),
        cerrarOperacion: () => setAbierta(null),
        version,
        operacionRealizada: () => setVersion((v) => v + 1),
      }}
    >
      {children}
    </OperacionesContext.Provider>
  )
}

export function useOperaciones() {
  const contexto = useContext(OperacionesContext)
  if (!contexto) throw new Error('useOperaciones debe usarse dentro de OperacionesProvider')
  return contexto
}