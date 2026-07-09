import Navbar from "../components/Navbar"
import "./Home.css"
import logo from "../assets/mm_logo.png";

function Home() {
  return (
    <div className="home-container">
      <div>
        <img src={logo} alt="MatchMission logo" className="logo"/>
        <p>MatchMission helps you discover nonprofits that fit your passions through a personalized quiz and smart recommendations, making it easier to support causes that matter to you.</p>
        <button>TAKE QUIZ</button>
      </div>

      <div>
        <img src="https://images.unsplash.com/vector-1767628818571-8543a9d9c388?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder image" className="meow"/>
      </div>
    </div>
  )
}

export default Home