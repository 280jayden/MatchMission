import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    });

    const data = await response.json();

    if (response.ok) {
      console.log("logged in")
      navigate("/");
    } else {
      console.log(data.error)
    }
  }

  return (
    <form className="auth-form register-form" onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}>

      <h1>Register</h1>

      <div className="auth-input-pair">
        <h3>Email</h3>
        <input 
            type="email"
            className="auth-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
      </div>
      
      <div className="auth-input-pair">
        <h3>Password</h3>
        <input 
            type="password"
            className="auth-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
      </div>

      <div className="auth-input-pair">
        <h3>Confirm Password</h3>
        <input 
            type="password"
            className="auth-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
      </div>

      <button type="submit">SIGN UP</button>

      <div className="auth-bottom-text">
        <p>Already have an account?</p>
        <nav>
          <Link to="/login">Log In</Link>
        </nav>
      </div>

    </form>
  )
}

export default Register