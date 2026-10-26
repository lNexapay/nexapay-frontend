import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UsuarioProvider } from './context/UsuarioContext'
import RutaProtegida from './components/RutaProtegida/RutaProtegida'
import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Inicio from './pages/Inicio/Inicio'
import Asistente from './pages/Asistente/Asistente'

export default function App() {
  return (
    <UsuarioProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
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
            path="/ai"
            element={
              <RutaProtegida>
                <Asistente />
              </RutaProtegida>
            }
          />
        </Routes>
      </BrowserRouter>
    </UsuarioProvider>
  )
}