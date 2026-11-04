import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioContext'
import { ChatProvider } from './context/ChatContext'
import { OperacionesProvider } from './context/OperacionesContext'
import RutaProtegida from './components/RutaProtegida/RutaProtegida'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Inicio from './pages/Inicio/Inicio'
import Historial from './pages/Historial/Historial'
import Monedas from './pages/Monedas/Monedas'
import Espacios from './pages/Espacios/Espacios'

export default function App() {
  return (
    <UsuarioProvider>
      <ChatProvider>
        <OperacionesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route
                path="/inicio"
                element={
                  <RutaProtegida>
                    <Inicio />
                  </RutaProtegida>
                }
              />
              <Route
                path="/historial"
                element={
                  <RutaProtegida>
                    <Historial />
                  </RutaProtegida>
                }
              />
              <Route
                path="/monedas"
                element={
                  <RutaProtegida>
                    <Monedas />
                  </RutaProtegida>
                }
              />
              <Route
                path="/espacios"
                element={
                  <RutaProtegida>
                    <Espacios />
                  </RutaProtegida>
                }
              />
            </Routes>
          </BrowserRouter>
        </OperacionesProvider>
      </ChatProvider>
    </UsuarioProvider>
  )
}