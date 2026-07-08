import Navbar from "../components/Navbar"
import "./Home.css"
import logo from "../assets/mm_logo.png";

function Home() {
  return (
    <div className="home-container">
      <div>
        <img src={logo} alt="MatchMission logo" className="logo"/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac pulvinar dolor. Aliquam vitae magna mi. Donec aliquam massa ante, a venenatis ipsum posuere vel. Quisque accumsan purus quis arcu iaculis, vel lobortis dolor cursus. </p>
        <button>TAKE QUIZ</button>
      </div>

      <div>
        <img src="https://placehold.net/600x600.png" alt="placeholder image" className="meow"/>
      </div>
    </div>
  )
}

export default Home