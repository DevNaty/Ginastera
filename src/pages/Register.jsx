
import { useState, useEffect } from 'react'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    dni: '',
    email: '',
    password: '',
    categorias: [] // array de IDs seleccionados
  })

  const [categorias, setCategorias] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categorias')
        setCategorias(response.data)
      } catch (err) {
        console.error('Error al cargar categorías:', err)
      }
    }

    fetchCategorias()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = (id) => {
    setForm((prevForm) => {
      const categoriasSeleccionadas = prevForm.categorias.includes(id)
        ? prevForm.categorias.filter((catId) => catId !== id)
        : [...prevForm.categorias, id]
      return { ...prevForm, categorias: categoriasSeleccionadas }
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await API.post('/usuarios', form)
      alert('Usuario registrado con éxito')
      navigate('/login')
    } catch (err) {
      alert('Error al registrar usuario')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded bg-white">
      <h2 className="text-2xl mb-4">Crear cuenta</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="Nombre" placeholder="Nombre" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
        <input type="text" name="Apellido" placeholder="Apellido" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
        <input type="text" name="Telefono" placeholder="Teléfono" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
        <input type="text" name="Dni" placeholder="DNI" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
        <input type="email" name="Email" placeholder="Email" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
        <input type="password" name="Password" placeholder="Contraseña" onChange={handleChange} className="block w-full mb-3 p-2 border rounded" required />
{/* 
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Categorías:</label>
          {categorias.map((cat) => (
            <label key={cat.ID_Categoria} className="block">
              <input
                type="checkbox"
                value={cat.ID_Categoria}
                checked={form.categorias.includes(cat.ID_Categoria)}
                onChange={() => handleCheckboxChange(cat.ID_Categoria)}
                className="mr-2"
              />
              {cat.Descripcion}
            </label>
          ))}
        </div> */}

        <button className="bg-green-500 text-white px-4 py-2 rounded">Registrarse</button>
      </form>
    </div>
  )
}
