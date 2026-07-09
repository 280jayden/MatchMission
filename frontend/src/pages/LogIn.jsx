import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"
import { useState } from "react";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/api/login", {
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
    <form className="auth-form" onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      <h1>Log In</h1>

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

      <button type="submit">LOG IN</button>

      <div className="auth-bottom-text">
        <p>Need to make a new account?</p>
        <nav>
          <Link to="/register">Sign Up</Link>
        </nav>
      </div>

    </form>
  )
}

export default LogIn