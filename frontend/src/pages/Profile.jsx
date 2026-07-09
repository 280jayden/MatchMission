import { useState, useEffect } from "react";
import OrgCard from "../components/OrgCard";
import { useAuth } from "../components/AuthContext";

function Profile() {
  const [orgs, setOrgs] = useState([]);
  const { user } = useAuth();

  const getResults = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer
    }));

    const response = await fetch("/api/favorites", { 
      method: "GET",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("yuh")
      setOrgs(data.nonprofits)
    } else {
      console.log(data.error)
    }
  }

  useEffect(() => { //so we can get results when it starts
    getResults();
  }, []);

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Profile</h1>
      {/* <p style={{textAlign:"center", marginBottom:"50px"}}>This is a profile page placeholder</p> */}

      <h2 style={{textAlign:"center"}}>Your Saved Organizations</h2>
      {/* <div className="card-container">
        {orgs.map((org) => (
          <OrgCard 
            key={org.ein} 
            nonprofit={org}
          />
        ))}
      </div> */}
      <p style={{textAlign:"center"}}>This feature is currently a work in progress.</p>
    </div>
  )
}

export default Profile