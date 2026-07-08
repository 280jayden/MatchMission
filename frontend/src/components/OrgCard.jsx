import "./OrgCard.css"
import StarButton from "./StarButton";

function OrgCard() { // would pass in a json later but for now....
  return (
    <div className="item-card org-card">
      <div className="org-top">
        <img src="https://placehold.net/600x600.png" alt="placeholder image" className="org-img"/>

        <div>
          <h2>Org Name</h2>
          <p style={{marginBottom: "50px"}}>description</p>

          <h3>Why We Matched You</h3>
          <p>description</p>
        </div>
      </div>

      <div className="org-bot">
        <button onClick={() => console.log("button pressed")} className="norm-button">
          PROFILE
        </button>

        <button onClick={() => console.log("button pressed")} className="norm-button">
          THEIR WEBSITE
         </button>

        <StarButton />
      </div>
    </div>
  )
}

export default OrgCard