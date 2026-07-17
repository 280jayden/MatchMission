import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/mm_logo.png';
import '../styles/Navbar.css';
import { useAuth } from './AuthProvider';
import { LogoutResponse } from '../types/api';

/**
 * Main navigation bar for the application.
 * Displays navigation links based on authentication
 * and whether the user has completed the quiz.
 */

function Navbar() {
    const navigate = useNavigate();
    const { user, setUser, hasTakenQuiz } = useAuth();

    const handleLogout = async () => {
        // Ends the user's session on the backend and clears
        // the user state in the frontend.

        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data: LogoutResponse = await response.json();

        if (response.ok) {
            console.log('logged out');
            setUser(null);
            navigate('/');
        } else {
            console.log(data.error);
        }
    };

    return (
        <div className="navbar">
            <nav>
                <img src={logo} alt="MatchMission logo" />
                <div className="nav-links">
                    <Link to="/">Home</Link>

                    {hasTakenQuiz() ? (
                        <Link to="/result">Recommendations</Link>
                    ) : (
                        <Link to="/quiz">Quiz</Link>
                    )}

                    <Link to="/profile">Profile</Link>

                    {user ? (
                        <Link to="#" onClick={handleLogout}>
                            Log Out
                        </Link>
                    ) : (
                        <Link to="/register">Register</Link>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
