import { useState, useEffect } from "react";
import OrgCard from "../components/OrgCard";

function Result() {
  const [orgs, setOrgs] = useState([]);

  const getResults = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer
    }));

    const response = await fetch("http://localhost:5000/api/org", {
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
      <h1 style={{textAlign:"center"}}>Results</h1>
      <p style={{textAlign:"center", marginBottom:"70px"}}>Based on your quiz responses, here are some organizations that might fit your preferences.</p>
      
      <div className="card-container">
        {orgs.map((org) => (
          <OrgCard 
            key={org.ein} 
            nonprofit={org}
          />
        ))}
      </div>
    </div>
  )
}

export default Result