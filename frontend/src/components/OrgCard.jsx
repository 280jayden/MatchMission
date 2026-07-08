import "./OrgCard.css"
import StarButton from "./StarButton";

function OrgCard({ org }) { // would pass in a json later but for now....
  return (
    <div className="item-card org-card">
      <div className="org-top">
        <img src={org.logoUrl} alt="organization logo" className="org-img"/>

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

        <StarButton />
      </div>
    </div>
  )
}

export default OrgCard


/*
nonprofit_card_data = {
    "ein": "844229672",
    "name": "Lil BUB's Big Fund",
    "description": "Lil BUB is a one of a kind space cat. Since landing on Earth, she's raised over $1,000,000 for homeless pets nationwide...",
    "logoUrl": "https://res.cloudinary.com/.../dsor2nxk97p87umlwhvt",
    "coverImageUrl": "https://res.cloudinary.com/.../ipxxsfqxtt6skku7vh1z",
    "location": "BLOOMINGTON, IN",
    "websiteUrl": "https://www.goodjobbub.org",
    "tags": ["dogs", "cats", "animals"]
}

 */