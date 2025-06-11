import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ABMCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [editandoCategoria, setEditandoCategoria] = useState(null); // Para almacenar la categoría que se está editando
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener todas las categorías
  const obtenerCategorias = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/api/categorias');
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al obtener categorías:', err);
      setError('Hubo un error al cargar las categorías.');
    } finally {
      setCargando(false);
    }
  };

  // Cargar categorías al inicio
  useEffect(() => {
    obtenerCategorias();
  }, []);

  // Manejar el cambio en el input de descripción
  const handleChangeDescripcion = (e) => {
    setDescripcion(e.target.value);
  };

  // Manejar el envío del formulario para agregar/editar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!descripcion.trim()) {
      setError('La descripción de la categoría no puede estar vacía.');
      return;
    }

    setCargando(true);

    try {
      if (editandoCategoria) {
        // Lógica para actualizar categoría
        await axios.put(`http://localhost:3000/api/categorias/${editandoCategoria.ID_Categoria}`, {
          Descripcion: descripcion,
        });
        alert('Categoría actualizada con éxito!');
        setEditandoCategoria(null); // Resetear estado de edición
      } else {
        // Lógica para agregar nueva categoría
        await axios.post('http://localhost:3000/api/categorias', {
          Descripcion: descripcion,
        });
        alert('Categoría agregada con éxito!');
      }
      setDescripcion(''); // Limpiar el input
      obtenerCategorias(); // Volver a cargar las categorías para ver los cambios
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      setError('Hubo un error al guardar la categoría. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Función para iniciar la edición de una categoría
  const handleEditar = (categoria) => {
    setEditandoCategoria(categoria);
    setDescripcion(categoria.Descripcion); // Cargar la descripción en el input
  };

  // Función para eliminar una categoría
  const handleEliminar = async (idCategoria) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setCargando(true);
      setError('');
      try {
        await axios.delete(`http://localhost:3000/api/categorias/${idCategoria}`);
        alert('Categoría eliminada con éxito!');
        obtenerCategorias(); // Refrescar la lista
      } catch (err) {
        console.error('Error al eliminar categoría:', err);
        setError('Hubo un error al eliminar la categoría. Asegúrate de que no esté en uso.');
      } finally {
        setCargando(false);
      }
    }
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setEditandoCategoria(null);
    setDescripcion('');
    setError(''); // Limpiar cualquier error
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Categorías</h1>

      {/* Formulario para Agregar/Editar Categoría */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editandoCategoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}
        </h2>
        <div className="mb-4">
          {/* Label de la descripción de la categoría - Restaurado */}
          <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción de la Categoría:
          </label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={handleChangeDescripcion}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: Electrónica, Ropa, Hogar..."
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              cargando ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : editandoCategoria ? 'Actualizar Categoría' : 'Agregar Categoría'}
          </button>
          {editandoCategoria && (
            <button
              type="button"
              onClick={handleCancelarEdicion}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={cargando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Grilla de Categorías */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Listado de Categorías</h2>
      {cargando && categorias.length === 0 && <p className="text-center text-gray-500">Cargando categorías...</p>}
      {!cargando && categorias.length === 0 && !error && (
        <p className="text-center text-gray-500">No hay categorías para mostrar.</p>
      )}
      {error && !cargando && <p className="text-center text-red-500">{error}</p>}

      {!cargando && categorias.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                {/* Eliminamos la columna de ID del encabezado */}
                <th className="py-3 px-4 text-left border-b border-gray-200">Descripción</th>
                <th className="py-3 px-4 text-center border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {categorias.map((cat) => (
                <tr key={cat.ID_Categoria} className="border-b border-gray-200 hover:bg-gray-50">
                  {/* Eliminamos la celda del ID en el cuerpo de la tabla */}
                  <td className="py-3 px-4 text-left whitespace-nowrap">{cat.Descripcion}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex item-center justify-center space-x-3">
                      <button
                        onClick={() => handleEditar(cat)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminar(cat.ID_Categoria)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
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

export default ABMCategorias;
