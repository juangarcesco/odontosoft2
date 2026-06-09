import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Layout from '../components/layout/Layout'

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" replace />
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/" element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Cualquier ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter