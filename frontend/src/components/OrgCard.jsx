import "./OrgCard.css"
import StarButton from "./StarButton";
import logo from "../assets/mm_logo.png";

function OrgCard({ org }) { // would pass in a json later but for now....
  return (
    <div className="item-card org-card">
      <div className="org-top">
        <img src={org.logoUrl || logo} alt="organization logo" className="org-img"/>

        <div>
          <h2>{org.name}</h2>
          <h3>Based in {org.location}</h3>
          <p style={{marginBottom: "50px"}}>{org.description}</p>

          <h3>Tags:</h3>
          <div>
            {org.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="org-bot">
        <button
          onClick={() => window.open(org.websiteUrl, "_blank")}
          className="norm-button"
        >
          PROFILE
        </button>

        <button onClick={() => console.log("button pressed")} className="norm-button">
          THEIR WEBSITE
         </button>

        <StarButton profileUrl="placeholder.com"/> 
        {/* lowkey im not really sure what jayden wants for profileurl?? user profile? i put a placeholder.
        we don't have that because i thought we were storing user session in db so am confused. 
        anyways if it's for user profile then we would also need to pass in some identifier for the org/nonprofit we're trying to favorite*/}
      </div>
    </div>
  )
}

export default OrgCard
