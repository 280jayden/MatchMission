import { useState } from "react";
import fullStar from "../assets/full_star.png";
import emptyStar from "../assets/empty_star.png";
import "./OrgCard.css"

function StarButton({profileUrl}) { //profileUrl is the identifier used in the api endpoint. we probably need to also send in an identifier for the org
  const [starred, setStarred] = useState(false);

  async function handleStar() {
    const api_url = (!starred ? "http://localhost:5000/api/favorite" : "http://localhost:5000/api/unfavorite"); //change the unfavorite url to what they make the endpoint

    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profileUrl: profileUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.error);
    } else {
      setStarred(!starred);
    }
  }

  return (
    <button onClick={handleStar} className="star-button">
      {starred? 
        <img src={fullStar} alt="full star"></img>
      :
        <img src={emptyStar} alt="empty star"></img>
      }
      
    </button>
  )
}

export default StarButton