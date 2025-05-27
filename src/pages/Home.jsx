import Header from '../components/Header'
import Button from '../components/Button'

export default function Home() {
  return (
    <div>
      <Header />
      <main className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">¡Te da la bienvenida!</h2>
        <Button onClick={() => alert('Vamos a gestionar 😎')}>Entrar</Button>
      </main>
    </div>
  )
}
