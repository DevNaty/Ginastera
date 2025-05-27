import { Link } from 'react-router-dom'

export default function Header() {
  const nombre = localStorage.getItem('nombre')

  return (
    <header className="relative bg-blue-500 text-white py-4">
      {/* Fila superior: Bienvenida e íconos */}
      <div className="flex justify-between items-start px-4">
        {/* Bienvenida */}
        {nombre && (
          <span className="text-sm bg-white text-blue-600 px-3 py-1 rounded shadow">
            Bienvenid@ {nombre}
          </span>
        )}

        {/* Links de navegación */}
        <nav className="flex gap-4 text-sm">
          <Link to="/home" className="hover:underline">Inicio</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </nav>
      </div>

      {/* Título centrado */}
      <div className="flex justify-center mt-4">
        <h1 className="text-3xl font-bold">ClaveGestion 🎵</h1>
      </div>
    </header>
  )
}
