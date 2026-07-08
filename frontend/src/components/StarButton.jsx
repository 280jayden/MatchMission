import { useState } from "react";
import fullStar from "../assets/full_star.png";
import emptyStar from "../assets/empty_star.png";
import "./OrgCard.css"

function StarButton() {
  const [starred, setStarred] = useState(false);

  function handleStar() {
    setStarred(!starred)
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