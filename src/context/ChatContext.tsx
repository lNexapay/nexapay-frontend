import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type ChatContextType = {
  abierto: boolean
  abrirChat: () => void
  cerrarChat: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <ChatContext.Provider
      value={{
        abierto,
        abrirChat: () => setAbierto(true),
        cerrarChat: () => setAbierto(false),
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const contexto = useContext(ChatContext)
  if (!contexto) throw new Error('useChat debe usarse dentro de ChatProvider')
  return contexto
}