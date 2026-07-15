import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../components/AuthProvider';
import { LoginResponse } from '../types/api';

function LogIn() {
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (response.ok) {
      // Refresh the global auth state so the navbar and protected routes
      // immediately reflect the logged-in user.
      console.log('logged in');
      await refreshUser();
      navigate('/');
    } else if ('error' in data) {
      console.log(data.error);
    }
  };

  return (
    <form
      className="auth-form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <h1>Log In</h1>

      <div className="auth-input-pair">
        <h3>Email</h3>
        <input
          type="email"
          className="auth-field"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <div className="auth-input-pair">
        <h3>Password</h3>
        <input
          type="password"
          className="auth-field"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
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
  );
}

export default LogIn;
