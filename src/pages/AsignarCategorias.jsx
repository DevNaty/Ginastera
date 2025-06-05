import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../components/Button'

export default function AsignarCategorias() {
  const [usuarios, setUsuarios] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
  const [categoriasAsignadas, setCategoriasAsignadas] = useState([])

  useEffect(() => {
    obtenerCategorias()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      if (busqueda.length >= 3) {
        buscarUsuarios()
      } else {
        setUsuarios([])
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [busqueda])

  const buscarUsuarios = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/usuarios/buscar?filtro=${busqueda}`)
      setUsuarios(response.data)
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
    }   
  }

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/categorias`)
      setCategorias(response.data)
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  }

  const obtenerCategoriasDelUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}/categorias`)
      setCategoriasAsignadas(response.data)
    } catch (error) {
      console.error('Error al obtener categorías del usuario:', error)
    }
  }

  const asignarCategoria = async () => {
    if (!usuarioSeleccionado || !categoriaSeleccionada) return
    try {
      await axios.post(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.ID_Usuario}/categorias`, {
        idCategoria: categoriaSeleccionada
      })
      obtenerCategoriasDelUsuario(usuarioSeleccionado.ID_Usuario)
    } catch (error) {
      console.error('Error al asignar categoría:', error)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Asignar Categorías</h1>

      {/* Input de búsqueda con íconos */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-gray-300 p-2 pl-10 pr-10 rounded"
        />
        <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">⋯</span>
      </div>

      {/* Lista de sugerencias */}
      {usuarios.length > 0 && (
        <ul className="border rounded p-2 mb-4 bg-white shadow">
          {usuarios.map((usuario) => (
            <li
              key={usuario.ID_Usuario}
              className={`p-2 cursor-pointer hover:bg-blue-100 ${usuarioSeleccionado?.ID_Usuario === usuario.ID_Usuario ? 'bg-blue-200' : ''}`}
              onClick={() => {
                setUsuarioSeleccionado(usuario)
                setBusqueda(`${usuario.Nombre} ${usuario.Apellido}`)
                setUsuarios([])
                obtenerCategoriasDelUsuario(usuario.ID_Usuario)
              }}
            >
              {usuario.Nombre} {usuario.Apellido} ({usuario.Email})
            </li>
          ))}
        </ul>
      )}

      {/* Combo box de categorías */}
      {usuarioSeleccionado && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Asignar categoría a: <strong>{usuarioSeleccionado.Nombre} {usuarioSeleccionado.Apellido}</strong></label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                  {cat.NombreCategoria}
                </option>
              ))}
            </select>
          </div>

          {/* Botón asignar */}
          <div className="mb-6">
            <Button onClick={asignarCategoria}>Asignar</Button>
          </div>

          {/* Grilla con categorías asignadas */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Categorías asignadas</h2>
            <table className="w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {categoriasAsignadas.map((cat) => (
                  <tr key={cat.ID_Categoria}>
                    <td className="border px-4 py-2">{cat.ID_Categoria}</td>
                    <td className="border px-4 py-2">{cat.NombreCategoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
