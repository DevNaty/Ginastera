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
      navigate('/')
    } catch (err) {
      alert('Credenciales incorrectas')
      console.error('Error al iniciar sesión:', err.response?.data || err.message)
    }
  }
  

return (
    <>
      <section id="Contacto">

        <h2 className="titulos">Espacio Curricular</h2>
        <form id="form" className="formulario" >
            <fieldset>
            <div className="contenedor-campos">
                
                <div className="campo-cont">
                    <label for="name">Nuevo Espacio Curricular<span>*</span></label>
                    <input className="input-text" name="nombre" required type="text" id="Nombre" placeholder="Espacio Curricular"/>
                </div>

                <div className="campo-cont">
                    <label for="telefono">Tipo de Hora<span>*</span></label>
                    <input className="input-text" name="descripcion" type="tel" id="Descripcion" required placeholder="Tipo de Hora"/>
                </div>

                <div className="campo-cont">
                    <label for="email">Carga Horaria<span>*</span></label>
                    <input className="input-text" name="cantidad" type="text" id="Cantidad" required placeholder="Carga Horaria"/>
                </div>

                <div className="campo-cont">
                    <label for="email">Estado<span>*</span></label>
                    <input className="input-text" name="cantidad" type="text" id="Cantidad" required placeholder="Estado"/>
                </div>
                
            </div> 

            <div className="alinear-derecha flex">
                <button className="boton w-sm-100" type="button" onclick="post()">Cargar</button>
                
            </div>
        </fieldset>
    </form>
</section>


<div className="container-sm">

    
  <button type="button" className="boton" onclick="getProductos()">Ver Espacios Curriculares</button>

    <div id="div" className="formulario">
      <table id="tabla-productos">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Espacio Curricular</th>
                    <th>Tipo de Hora</th>
                    <th>Carga Horaria</th>
                    <th>Estado</th>
                    <th></th>
                    <th></th>

                </tr>
           </thead>
           <tbody>
          
           </tbody>
      </table>
      
   </div>
</div>
    </>
  )
}