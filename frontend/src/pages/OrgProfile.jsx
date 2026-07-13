import "../styles/OrgProfile.css";
import logo from "../assets/mm_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function OrgProfile() { 
  const { ein } = useParams();
  const [org, setOrg] = useState(null);
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(true) 
  const navigate = useNavigate();

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

  useEffect(() => {
    const getOrg = async () => {
      try {
        const response = await fetch(`/api/org/${ein}`);
        const data = await response.json();
        
        console.log("API response:", data);

        if (response.ok){
          setOrg(data.nonprofit);
          setTags(data.nonprofitTags)
        } else {
          console.log(data.error)
        }
      } finally {
        setLoading(false);
      }
    };

    getOrg();
  }, [ein])

  if (loading) return <p>Loading...</p>;
  
  if (!org) return <p>Organization not found.</p>;

  return (
    <div>
      <div className="profile-header">
        <div className="profile-info">
          <h2>{org.name}</h2>
          <h3>Based in {org.locationAddress}</h3>
          <p>{org.description}</p>
          <h3>Why We Matched You</h3>
          <p>Analysis feature coming soon</p>
          
          <button
            onClick={() => {
              const url = org.websiteUrl.startsWith("http") ? org.websiteUrl : `https://${org.websiteUrl}`;
              window.open(url, "_blank");
            }}
            className="norm-button"
            disabled={!org.websiteUrl}
          >
            {org.websiteUrl ? "THEIR WEBSITE" : "NO WEBSITE"}
          </button>
       
        </div>

        <div className="profile-side">
          <button onClick={() => navigate("/result")}>Back</button>

          <img
            src={resizeImg(org.logoUrl) || logo}
            alt="organization logo"
            className="org-img"
          />
        </div>
      </div>
      

      {/* 
      {/* primary tag 
      <img src={tags[0].tagImageUrl} alt="tag image"></img>
      <h3>{tags[0].title}</h3>

      {/* secondary tag 
      <img src={tags[1].tagImageUrl} alt="tag image"></img>
      <h3>{tags[1].title}</h3>
       */}


    </div>
  )
}

export default OrgProfile
