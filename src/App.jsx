import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Forecast from './pages/Forecast'
import Tariff from './pages/Tariff'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/'element={<Forecast/>}/>
        <Route path='/tariff'element={<Tariff/>}/>
      </Routes>
      <Chatbot/>
    </div>
  )
}

export default App