import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const modulos = [
  { to: '/',             label: 'Agenda',        icono: '📅' },
  { to: '/pacientes',    label: 'Pacientes',      icono: '👥' },
  { to: '/cajas',        label: 'Cajas',          icono: '🏧' },
  { to: '/recaudacion',  label: 'Recaudación',    icono: '💰' },
  { to: '/administracion', label: 'Administración', icono: '⚙️' },
  { to: '/reportes',     label: 'Reportes',       icono: '📊' },
  { to: '/tratamientos', label: 'Tratamientos',   icono: '🦷' },
]

const Navbar = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="w-full shadow-md">

      {/* Barra superior */}
      <div className="bg-blue-600 px-6 py-2 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-white text-xl font-bold">🦷 OdontoSoft</span>
        </div>

        {/* Buscador */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="flex items-center bg-white/20 rounded-lg px-4 py-1.5 gap-2">
            <span className="text-white text-sm">🔍</span>
            <input
              type="text"
              placeholder="Busca pacientes por nombre o documento de ID"
              className="bg-transparent text-white placeholder-white/70 text-sm outline-none w-full"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button className="text-white text-sm flex items-center gap-1 hover:text-blue-200">
            📢 Novedades
          </button>
          <div className="flex items-center gap-2 text-white text-sm">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center font-bold">
              {usuario?.nombre?.charAt(0)}
            </div>
            <span>{usuario?.nombre}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {usuario?.rol}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/70 hover:text-white text-sm"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Barra de módulos */}
      <div className="bg-white border-b border-slate-200 px-6">
        <nav className="flex items-center gap-1">
          {modulos.map((mod) => (
            <NavLink
              key={mod.to}
              to={mod.to}
              end={mod.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-300'
                }`
              }
            >
              <span>{mod.icono}</span>
              {mod.label}
            </NavLink>
          ))}
        </nav>
      </div>

    </header>
  )
}

export default Navbar