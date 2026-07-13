import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/mm_logo.png";
import "../styles/Navbar.css";
import { useAuth } from "./AuthProvider";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { hasTakenQuiz } = useAuth();


  const handleLogout = async () => {
    
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("logged out")
      setUser(null);
      navigate("/");
    } else {
      console.log(data.error)
    }
}

  return (
    <div className="navbar">
      <nav> 
        <img src={logo} alt="MatchMission logo"/>
        <div className="nav-links">
          <Link to="/">Home</Link>

          { hasTakenQuiz ? (
              <Link to="/result">Recommendations</Link>
            ) : (
              <Link to="/quiz">Quiz</Link>
            )
          }

           <Link to="/profile">Profile</Link>

          {user ? (
            <Link to="#" onClick={handleLogout}>Log Out</Link>
            )
            : (
            <Link to="/register">Register</Link>
            )
          }
        </div>
      </nav>
    </div>
  )
}

export default Navbar