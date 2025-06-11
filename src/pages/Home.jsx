import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
       
        <h2 className="text-3xl font-bold mb-4">¡Te da la bienvenida!</h2>
    
     

       <main className="text-center mt-12">
        <Button onClick={() => navigate('/ciclos')}>
          ABM Ciclos
        </Button>
      </main>

      <main className="text-center mt-12">
        <Button onClick={() => navigate('/formaciones')}>
          ABM Formaciones
        </Button>
      </main>


       <main className="text-center mt-12">
        <Button onClick={() => navigate('/abmCategorias')}>
          ABM Categorias
        </Button>
      </main>

       
      <main className="text-center mt-12">
        <Button onClick={() => navigate('/asignarCategorias')}>
          Asignar Categorías
        </Button>
      </main>
    </div>
  )
}

