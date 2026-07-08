import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar"> 
      <Link to="/">Home</Link>
      <Link to="/quiz">Matcher</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/register">Register</Link>
    </nav>
  )
}

export default Navbar