import type { ReactNode } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import MenuInferior from '../MenuInferior/MenuInferior'
import styles from './AppLayout.module.css'

// Estructura de las páginas internas: Sidebar (desktop) + contenido + menú inferior (celular)
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pagina}>
      <Sidebar />
      <main className={styles.principal}>{children}</main>
      <MenuInferior />
    </div>
  )
}