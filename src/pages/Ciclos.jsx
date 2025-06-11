import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ABMCiclos = () => {
  const [ciclos, setCiclos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [editandoCiclos, setEditandoCiclos] = useState(null); // Para almacenar la categoría que se está editando
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener todas las categorías
  const obtenerCiclos = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/api/ciclos');
      setCiclos(response.data);
    } catch (err) {
      console.error('Error al obtener los ciclos:', err);
      setError('Hubo un error al cargar los ciclos.');
    } finally {
      setCargando(false);
    }
  };

  // Cargar categorías al inicio
  useEffect(() => {
    obtenerCiclos();
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
      setError('La descripción del ciclo no puede estar vacía.');
      return;
    }

    setCargando(true);

    try {
      if (editandoCiclos) {
        // Lógica para actualizar ciclo
        await axios.put(`http://localhost:3000/api/ciclos/${editandoCiclos.ID_Ciclo}`, {
          Descripcion: descripcion,
        });
        alert('Ciclo actualizado con éxito!');
        setEditandoCiclos(null); // Resetear estado de edición
      } else {
        // Lógica para agregar nuevo ciclo
        await axios.post('http://localhost:3000/api/ciclos', {
          Descripcion: descripcion,
        });
        alert('Ciclo agregado con éxito!');
      }
      setDescripcion(''); // Limpiar el input
      obtenerCiclos(); // Volver a cargar los ciclos para ver los cambios
    } catch (err) {
      console.error('Error al guardar ciclo:', err);
      setError('Hubo un error al guardar el ciclo. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Función para iniciar la edición de un ciclo
  const handleEditar = (ciclo) => {
    setEditandoCiclos(ciclo); // Se pasa el objeto 'ciclo' completo
    setDescripcion(ciclo.Descripcion); // Cargar la descripción en el input
  };

  // Función para eliminar una categoría
  const handleEliminar = async (idCiclo) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ciclo?')) {
      setCargando(true);
      setError('');
      try {
        await axios.delete(`http://localhost:3000/api/ciclos/${idCiclo}`);
        alert('Ciclo eliminado con éxito!');
        obtenerCiclos(); // Refrescar la lista
      } catch (err) {
        console.error('Error al eliminar ciclo:', err);
        setError('Hubo un error al eliminar la ciclo. Asegúrate de que no esté en uso.');
      } finally {
        setCargando(false);
      }
    }
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setEditandoCiclo(null);
    setDescripcion('');
    setError(''); // Limpiar cualquier error
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestión de Ciclos</h1>

      {/* Formulario para Agregar/Editar Categoría */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editandoCiclos ? 'Editar Ciclo' : 'Agregar Nuevo Ciclo'}
        </h2>
        <div className="mb-4">
          
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={handleChangeDescripcion}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ej: CAV Infantil, CAV en canto..."
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
            {cargando ? 'Guardando...' : editandoCiclos ? 'Actualizar Ciclo' : 'Agregar Ciclo'}
          </button>
          {editandoCiclos && (
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
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Listado de Ciclos</h2>
      {cargando && ciclos.length === 0 && <p className="text-center text-gray-500">Cargando ciclos...</p>}
      {!cargando && ciclos.length === 0 && !error && (
        <p className="text-center text-gray-500">No hay ciclos para mostrar.</p>
      )}
      {error && !cargando && <p className="text-center text-red-500">{error}</p>}

      {!cargando && ciclos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                {/* Eliminamos la columna de ID del encabezado */}
                <th className="py-3 px-4 text-left border-b border-gray-200">Ciclos</th>
                <th className="py-3 px-4 text-center border-b border-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {ciclos.map((ci) => (
                <tr key={ci.ID_Ciclos} className="border-b border-gray-200 hover:bg-gray-50">
                  {/* Eliminamos la celda del ID en el cuerpo de la tabla */}
                  <td className="py-3 px-4 text-left whitespace-nowrap">{ci.Descripcion}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex item-center justify-center space-x-3">
                      <button
                        onClick={() => handleEditar(ci)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminar(ci.ID_Ciclo)}
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

export default ABMCiclos;