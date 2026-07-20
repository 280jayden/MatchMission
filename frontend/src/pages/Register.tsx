import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useAuth } from '../components/AuthProvider';
import { RegisterResponse } from '../types/api';
import { API_URL } from '../config';

function Register() {
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const response = await fetch(`${API_URL}/api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, email, password }),
        });

        const data: RegisterResponse = await response.json();

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
      <div className="page-background">
        <form
            className="auth-form register-form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleRegister();
            }}
        >
            <h1>Register</h1>

            <div className="auth-input-pair">
                <h3>Name</h3>
                <input
                    type="name"
                    className="auth-field"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                    }
                />
            </div>

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

            <div className="auth-input-pair">
                <h3>Confirm Password</h3>
                <input
                    type="password"
                    className="auth-field"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setConfirmPassword(e.target.value)
                    }
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
        </div>
    );
}

export default Register;
