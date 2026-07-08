import { Link } from "react-router-dom";
import "./Auth.css"

function Register() {
  return (
    <div className="auth-form register-form">
      <h1>Register</h1>

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

      <div className="auth-input-pair">
        <h3>Confirm Password</h3>
        <input 
            // value = {value}
            className="auth-field"
            // onChange={(e) => onChange(e.target.value)}
          />
      </div>

      <button>SIGN UP</button>

      <div className="auth-bottom-text">
        <p>Already have an account?</p>
        <nav>
          <Link to="/register">Log In</Link>
        </nav>
      </div>

    </div>
  )
}

export default Register