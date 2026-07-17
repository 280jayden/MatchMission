import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useAuth } from '../components/AuthProvider';
import { RegisterResponse } from '../types/api';

function Register() {
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
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
        <form
            className="auth-form register-form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleRegister();
            }}
        >
            <h1>Register</h1>

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
    );
}

export default Register;
