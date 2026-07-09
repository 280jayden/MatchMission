import "./OrgCard.css"
import StarButton from "./StarButton";
import logo from "../assets/mm_logo.png";

function OrgCard({ org }) { 

  function resizeImg(url) {
    if (!url) {
      return ""
    }

    const parts = url.split("/");

    parts[6] = 'c_lfill,w_600,h_600,dpr_2';
    parts[7] = 'c_crop,ar_600:600';

    // original ex https://res.cloudinary.com/everydotorg/image/upload/c_lfill,w_24,h_24,dpr_2/c_crop,ar_24:24/q_auto,f_auto,fl_progressive/profile_pics/xumk7i0itod4uilqg9vt

    return parts.join("/");
  }

  return (
    <div className="item-card org-card">
      <div className="org-top">
        <img src={resizeImg(org.logoUrl) || logo} alt="organization logo" className="org-img"/>

        <div>
          <h2>{org.name}</h2>
          <h3>Based in {org.location}</h3>
          <p style={{marginBottom: "50px"}}>{org.description}</p>

          <h3>Tags:</h3>
          <div className="tag-container">
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
