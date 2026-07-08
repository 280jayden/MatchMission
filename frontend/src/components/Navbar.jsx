import { Link } from "react-router-dom";
import logo from "../assets/mm_logo.png";
import "./Navbar.css"

function Navbar() {
  return (
    <div className="navbar">
      <nav> 
        <img src={logo} alt="MatchMission logo"/>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/quiz">Matcher</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar