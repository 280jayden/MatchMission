import { useState, useEffect } from 'react'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Profile from "./pages/Profile"
import Quiz from "./pages/Quiz"
import Register from "./pages/Register"
import Result from "./pages/Result"

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    fetch('/api/time')
      .then(res => res.json())
      .then(data => {
        setCurrentTime(data.time)
      })
  }, [])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/register" element={<Register />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App