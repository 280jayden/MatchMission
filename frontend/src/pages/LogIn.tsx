import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../components/AuthProvider';
import { LoginResponse } from '../types/api';
import { API_URL } from '../config';

/**
 * Login page for user authentication.
 *
 * Allows users to enter their email and password to authenticate with the
 * backend. On successful login, refreshes the global authentication state
 * and redirects the user to the home page.
 *
 * Displays error messages when authentication fails or when the request
 * encounters an unexpected error.
 */

function LogIn() {
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    /**
     * Authenticates a user with their email and password.
     *
     * Sends login credentials to the backend API, updates the global auth state
     * on success, and displays errors if authentication fails.
     */
    const handleLogin = async () => {
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
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
                setMessage(data.error);
            }
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="page-background">
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

                {message && <p className="auth-error">{message}</p>}
                <button type="submit">LOG IN</button>

                <div className="auth-bottom-text">
                    <p>Need to make a new account?</p>
                    <nav>
                        <Link to="/register">Sign Up</Link>
                    </nav>
                </div>
            </form>
        </div>
    );
}

export default LogIn;
