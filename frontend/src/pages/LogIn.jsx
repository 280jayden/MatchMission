import { Link } from "react-router-dom";
import "./Auth.css"

function LogIn() {
  return (
    <div className="auth-form">
      <h1>Log In</h1>

      <div className="auth-input-pair">
        <h3>Email</h3>
        <input 
            // value = {value}
            className="auth-field"
            // onChange={(e) => onChange(e.target.value)}
          />
      </div>
      
      <div className="auth-input-pair">
        <h3>Password</h3>
        <input 
            // value = {value}
            className="auth-field"
            // onChange={(e) => onChange(e.target.value)}
          />
      </div>

      <button>LOG IN</button>

      <div className="auth-bottom-text">
        <p>Need to make a new account?</p>
        <nav>
          <Link to="/register">Sign Up</Link>
        </nav>
      </div>

    </div>
  )
}

export default LogIn