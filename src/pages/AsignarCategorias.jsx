import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AsignarCategoriaUsuario = () => {
  const [query, setQuery] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const [categoriasAsignadas, setCategoriasAsignadas] = useState([]);

  // Buscar usuarios
  useEffect(() => {
    const buscar = async () => {
      if (query.length >= 3) {
        setCargando(true);
        try {
          const response = await axios.get(`http://localhost:3000/api/usuarios/buscar?filtro=${encodeURIComponent(query)}`);
          // Filtrar sugerencias para evitar IDs de usuario repetidos
          const usuariosUnicos = [];
          const idsVistos = new Set();
          response.data.forEach(usuario => {
            if (!idsVistos.has(usuario.ID_Usuario)) {
              usuariosUnicos.push(usuario);
              idsVistos.add(usuario.ID_Usuario);
            }
          });
          setSugerencias(usuariosUnicos);
        } catch (error) {
          console.error('Error al buscar usuarios:', error);
          setSugerencias([]);
        } finally {
          setCargando(false);
        }
      } else {
        setSugerencias([]);
      }
    };

    const delayDebounce = setTimeout(buscar, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Obtener todas las categorías
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };
    obtenerCategorias();
  }, []);

  // Al seleccionar usuario, cargar sus categorías asignadas
  const handleSeleccionUsuario = async (usuario) => {
    setUsuarioSeleccionado(usuario);
    // Limpiamos la query para evitar que el buscador se active de nuevo y para que el mensaje "No se encontraron usuarios" no aparezca.
    setQuery(`${usuario.Nombre} ${usuario.Apellido}`); // Mantenemos el nombre del usuario en el input, pero esto ya no dispara la búsqueda si es el mismo valor.
    setSugerencias([]); // Limpiamos las sugerencias
    setCategoriasSeleccionadas([]);

    try {
      const res = await axios.get(`http://localhost:3000/api/usuarios/${usuario.ID_Usuario}`);
      setCategoriasAsignadas(res.data.Categorias || []);
    } catch (error) {
      console.error('Error al cargar categorías asignadas:', error);
      setCategoriasAsignadas([]);
    }
  };

  const asignarCategorias = async () => {
    if (!usuarioSeleccionado || categoriasSeleccionadas.length === 0) {
      alert('Debes seleccionar un usuario y al menos una categoría.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/usuarios/asignar-categorias', {
        ID_Usuario: usuarioSeleccionado.ID_Usuario,
        Categorias: categoriasSeleccionadas
      });
      alert('¡Categorías asignadas correctamente!');
      // Refrescar categorías asignadas
      const res = await axios.get(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.ID_Usuario}`);
      setCategoriasAsignadas(res.data.Categorias || []);
      setCategoriasSeleccionadas([]);
    } catch (error) {
      console.error('Error al asignar categorías:', error);
      alert('Ocurrió un error al asignar las categorías.');
    }
  };

  const eliminarCategoria = async (idCategoria) => {
    if (!usuarioSeleccionado) return;

    const confirmar = window.confirm('¿Estás segura de eliminar esta categoría del usuario?');
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.ID_Usuario}/categorias/${idCategoria}`);
      // Refrescar categorías asignadas
      const res = await axios.get(`http://localhost:3000/api/usuarios/${usuarioSeleccionado.ID_Usuario}`);
      setCategoriasAsignadas(res.data.Categorias || []);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('No se pudo eliminar la categoría.');
    }
  };

  return (
    <div className="p-4">
      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // Si el usuario empieza a escribir de nuevo, deseleccionamos el usuario actual
            if (usuarioSeleccionado) {
              setUsuarioSeleccionado(null);
              setCategoriasAsignadas([]);
            }
          }}
          className="border p-2 w-full"
        />
        {cargando && <p>Cargando...</p>}

        {!cargando && sugerencias.length > 0 && (
          <ul className="border mt-1 max-h-40 overflow-y-auto">
            {sugerencias.map((usuario) => (
              <li
                key={usuario.ID_Usuario}
                onClick={() => handleSeleccionUsuario(usuario)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {usuario.Nombre} {usuario.Apellido}
              </li>
            ))}
          </ul>
        )}

        {/* La clave está en añadir !usuarioSeleccionado */}
        {!cargando && query.length >= 3 && sugerencias.length === 0 && !usuarioSeleccionado && (
          <p>No se encontraron usuarios.</p>
        )}
      </div>

      {/* Combo múltiple y asignación */}

      
      {usuarioSeleccionado && (
        <div className="mb-4">
           <p className="mb-2 font-semibold">
            Seleccionando categorías para: {' '}
            <span className="text-xl font-bold"> 
              {usuarioSeleccionado.Nombre} {usuarioSeleccionado.Apellido}
            </span>
          </p>

          <select
            multiple
            value={categoriasSeleccionadas}
            onChange={(e) => {
              const opciones = Array.from(e.target.selectedOptions);
              setCategoriasSeleccionadas(opciones.map((o) => o.value));
            }}
            className="w-full border p-2 rounded h-40"
          >
            {categorias.map((cat) => (
              <option key={cat.ID_Categoria} value={cat.ID_Categoria}>
                {cat.Descripcion}
              </option>
            ))}
          </select>

          <button onClick={asignarCategorias} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Asignar Categorías
          </button>
        </div>
      )}

      {/* Grilla de categorías asignadas */}
      {usuarioSeleccionado && categoriasAsignadas.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Categorías Asignadas</h2>
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Categorías</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasAsignadas.map((cat) => (
                <tr key={cat.ID_Categoria}>
                  <td className="border px-2 py-1">{cat.Descripcion}</td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => eliminarCategoria(cat.ID_Categoria)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar categoría"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AsignarCategoriaUsuario;