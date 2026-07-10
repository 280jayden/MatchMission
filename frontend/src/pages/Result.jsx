import { useState, useEffect } from "react";
import OrgCard from "../components/OrgCard";

function Result() {
  const [orgs, setOrgs] = useState([]);

  const getResults = async () => {

    const response = await fetch("/api/refresh_orgs", {
      method: "GET",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      console.log("yuh")
      setOrgs(data)
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
            org={org}
          />
        ))}
      </div>
    </div>
  )
}

export default Result