import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from'./pages/Home'
import Clientes from './pages/Usuarios'
import NuevoCliente from './pages/NuevoUsuario'
import Login from './pages/Login'
import Register from './pages/Register'
import Usuarios from './pages/Usuarios'
import NuevoUsuario from './pages/NuevoUsuario'

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    
  )
}

export default App