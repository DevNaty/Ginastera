import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <main className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">¡Te da la bienvenida!</h2>

        <Button onClick={() => navigate('/asignarCategorias')}>
          Asignar Categorías
        </Button>
      </main>

      <main className="text-center mt-12">
        <Button onClick={() => navigate('/gestionarAlumnos')}>
          Gestionar Alumnos
        </Button>
      </main>
    </div>
  )
}

