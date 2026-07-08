import OrgCard from "../components/OrgCard"

function Result() {

  const dummy = {"nonprofits": [
    {
      "description": "Lil BUB is a one of a kind space cat. Since landing on Earth, she's raised over $1,000,000 for homeless pets nationwide.. Lil BUB’s Big Fund exists to advocate for special needs companion animals and build a community that celebrates and fosters the",
      "ein": "844229672",
      "name": "Lil BUB's Big Fund",
      "profileUrl": "https://www.every.org/lilbubsbigfund",
      "logoUrl": "https://res.cloudinary.com/everydotorg/image/upload/c_lfill,w_24,h_24,dpr_2/c_crop,ar_24:24/q_auto,f_auto,fl_progressive/profile_pics/dsor2nxk97p87umlwhvt",
      "coverImageUrl": "https://res.cloudinary.com/everydotorg/image/upload/f_auto,c_limit,w_3840,q_80/profile_pics/ipxxsfqxtt6skku7vh1z",
      "logoCloudinaryId": "profile_pics/dsor2nxk97p87umlwhvt",
      "slug": "lilbubsbigfund",
      "location": "BLOOMINGTON, IN",
      "websiteUrl": "https://www.goodjobbub.org",
      "tags": [
        "dogs",
        "cats",
        "animals"
      ]
    }]
  }


  return (
    <div>
      <h1 style={{textAlign:"center"}}>Results</h1>
      <p style={{textAlign:"center", marginBottom:"70px"}}>Based on your quiz responses, here are some organizations that might fit your preferences.</p>
      
      {/* later, will make it a map based on a dict or array that gets passed in */}
      <div className="card-container">
        <OrgCard org = {dummy["nonprofits"][0]} />
      </div>
    </div>
  )
}

export default Result