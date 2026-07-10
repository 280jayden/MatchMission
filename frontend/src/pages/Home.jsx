import Navbar from "../components/Navbar"
import "./Home.css"
import logo from "../assets/mm_logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";

function Home() {
  const { hasTakenQuiz } = useAuth();
  const navigate = useNavigate();

  const getUser = async () => {
    const response = await fetch("/api/get_current_user", { 
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      console.log("response ok")
      console.log(data)
    } else {
      console.log(data.error)
    }
  }

  useEffect(() => { //so we can get results when it starts
    getUser();
  }, []);
  
  return (
    <div className="home-container">
      <div>
        <img src={logo} alt="MatchMission logo" className="logo"/>
        <p>MatchMission helps you discover nonprofits that fit your passions through a personalized quiz and smart recommendations, making it easier to support causes that matter to you.</p>
          {/* <button onClick={()=> navigate("/quiz")}>TAKE QUIZ</button> */}


          { hasTakenQuiz() ? ( 
              <button onClick={()=> navigate("/result")}>VIEW RESULTS</button>
            ) : ( 
              <button onClick={()=> navigate("/quiz")}>TAKE QUIZ</button>
            )
          }
         
          
      </div>

      <div>
        <img src="https://images.unsplash.com/vector-1767628818571-8543a9d9c388?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="placeholder image" className="meow"/>
      </div>
    </div>
  )
}

export default Home