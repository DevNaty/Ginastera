import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from'./pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AsignarCat from './pages/AsignarCategorias'
import ABMCategorias from './pages/ABM-Categorias'
import Ciclos from './pages/Ciclos';


function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/abmCategorias" element={<ABMCategorias />} />
        <Route path="/asignarCategorias" element={<AsignarCat />} />
         <Route path="/ciclos" element={<Ciclos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        
      </Routes>
    
  )
}

export default App