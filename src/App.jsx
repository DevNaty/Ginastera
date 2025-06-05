import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from'./pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AsignarCat from './pages/AsignarCategorias'
import GestionAlumnos from './pages/GestionAlumnos'

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestionarAlumnos" element={<GestionAlumnos />} />
        <Route path="/asignarCategorias" element={<AsignarCat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    
  )
}

export default App