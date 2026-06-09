import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const links = [
  { to: '/',            label: 'Dashboard',     icono: '🏠' },
  { to: '/pacientes',   label: 'Pacientes',     icono: '👥' },
  { to: '/citas',       label: 'Citas',         icono: '📅' },
  { to: '/tratamientos',label: 'Tratamientos',  icono: '🦷' },
  { to: '/pagos',       label: 'Pagos',         icono: '💰' },
]

const Sidebar = () => {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-800 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">🦷 OdontoSoft</h1>
        <p className="text-xs text-slate-400 mt-1">{usuario?.nombre}</p>
        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
          {usuario?.rol}
        </span>
      </div>

      {/* Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            <span>{link.icono}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition"
        >
          <span>🚪</span>
          Cerrar sesión
        </button>
      </div>

    </aside>
  )
}

export default Sidebar