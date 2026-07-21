import Navbar from '../components/Navbar';
import '../styles/Home.css';
import logo from '../assets/mm_logo.png';
import mm from '../assets/mm.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

function Home() {
    const { hasTakenQuiz } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="page-background">
            <div
                className="home-container"
                style={{ marginTop: '60px', marginBottom: '150px' }}
            >
                <div>
                    <h2>
                        Don’t just donate.<br></br>
                        Discover the causes you were meant to champion.
                    </h2>
                    <p>
                        Find nonprofits that match your values, passions, and
                        the change you want to see.
                        <br />
                        <br />
                        Take our 10-question mission quiz and discover your
                        personalized matches.
                    </p>
                </div>

                <div className="hero-right">
                    <img src={logo} alt="MatchMission logo" className="logo" />
                    {hasTakenQuiz() ? (
                        <button onClick={() => navigate('/result')}>
                            VIEW RESULTS
                        </button>
                    ) : (
                        <button onClick={() => navigate('/quiz')}>
                            TAKE QUIZ
                        </button>
                    )}
                </div>
            </div>

            <div className="home-3-cols" style={{ marginBottom: '150px' }}>
                <div className="home-box">
                    <h3>Personalized Matching</h3>
                    <p>
                        Discover nonprofits that align with your values,
                        interests, and passions. See exactly why each
                        organization matches your mission.
                    </p>
                </div>
                <div className="home-box">
                    <h3>Discover Hidden Causes</h3>
                    <p>
                        Go beyond traditional charity directories and explore
                        meaningful organizations you may have never discovered
                        on your own.
                    </p>
                </div>
                <div className="home-box">
                    <h3>Donate With Confidence</h3>
                    <p>
                        Learn about each organization's work and support the
                        nonprofits that truly connect with the change you want
                        to create.
                    </p>
                </div>
            </div>

            <div className="home-container">
                <img
                    src="https://images.unsplash.com/vector-1767628818571-8543a9d9c388?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="placeholder image"
                    className="meow"
                />
                <div>
                    <h2>
                        The hardest part of giving back is knowing where to
                        begin.
                    </h2>
                    <p>
                        Every year, millions of people want to give back, but
                        choosing where to start is harder than it should be.
                        <br /> <br />
                        Thousands of nonprofits are doing incredible work, yet
                        traditional charity directories leave donors with
                        endless lists and little guidance.
                        <br /> <br />
                        Match Mission helps you discover organizations that
                        connect with your values, passions, and the change you
                        want to see.
                    </p>
                </div>
            </div>

            <h2 style={{ textAlign: 'center' }}>How It Works</h2>
            <div className="home-3-cols">
                <div className="home-box">
                    <h3>1. Tell us what matters to you</h3>
                    <p>
                        Take our personalized mission quiz to uncover the
                        causes, communities, and issues you care about most.
                    </p>
                </div>
                <div className="home-box">
                    <h3>2. Find nonprofits that fit you</h3>
                    <p>
                        Our matching system analyzes your values and connects
                        you with nonprofits aligned with your interests.
                    </p>
                </div>
                <div className="home-box">
                    <h3>3. Understand your impact</h3>
                    <p>
                        Learn more about each recommended organization,
                        understand why they match your mission, and donate
                        directly to causes you believe in.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
