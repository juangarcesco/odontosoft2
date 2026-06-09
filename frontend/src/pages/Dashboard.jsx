import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { usuario } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Bienvenido, {usuario?.nombre} 👋
      </h1>
      <p className="text-slate-500 mt-1">
        Rol: <span className="font-medium text-blue-600">{usuario?.rol}</span>
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Pacientes</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">--</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Citas hoy</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">--</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Tratamientos activos</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">--</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard








































































































