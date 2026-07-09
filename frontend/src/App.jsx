import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import LogIn from "./pages/LogIn"
import Profile from "./pages/Profile"
import Quiz from "./pages/Quiz"
import Register from "./pages/Register"
import Result from "./pages/Result"
import OrgProfile from "./pages/OrgProfile"

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="page-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/register" element={<Register />} />
            <Route path="/result" element={<Result />} />
            <Route path="/org/:ein" element={<OrgProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App