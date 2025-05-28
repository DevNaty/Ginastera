import { useState } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await API.post('/login', { Email: email, Password: password }) // ojo con mayúsculas
      console.log(response.data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('nombre', response.data.usuario.nombre)
      navigate('/') // redirige a la página de nuevo usuario
    } catch (err) {
      alert('Credenciales incorrectas')
      console.error('Error al iniciar sesión:', err.response?.data || err.message)
    }
  }
  

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded bg-white">
      <h2 className="text-2xl mb-4">Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-3 p-2 border rounded"
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  )
}
