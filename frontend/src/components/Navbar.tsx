import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/mm_logo.png';
import '../styles/Navbar.css';
import { useAuth } from './AuthProvider';

/**
 * Main navigation bar for the application.
 * Displays navigation links based on authentication
 * and whether the user has completed the quiz.
 */

function Navbar() {
    const navigate = useNavigate();
    const { user, hasTakenQuiz, logout } = useAuth();

    return (
        <div className="navbar">
            <nav>
                <img src={logo} alt="MatchMission logo" />
                <div className="nav-links">
                    <Link to="/">Home</Link>

                    <Link to="/directory">Directory</Link>

                    {hasTakenQuiz() ? (
                        <Link to="/result">Recommendations</Link>
                    ) : (
                        <Link to="/quiz">Quiz</Link>
                    )}

                    <Link to="/profile">Profile</Link>

                    {user ? (
                        <Link
                            to="#"
                            onClick={async () => {
                                await logout();
                                navigate('/');
                            }}
                        >
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
