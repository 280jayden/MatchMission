import OrgCard from "../components/OrgCard"

function Profile() {
  return (
    <div>
      <h1 style={{textAlign:"center"}}>Profile</h1>
      <p style={{textAlign:"center", marginBottom:"50px"}}>This is a profile page placeholder</p>

      <h2 style={{textAlign:"center"}}>Your Saved Organizations</h2>
      {/* later, will make it a map based on a dict or array that gets passed in */}
      <div className="card-container">
        <OrgCard />
        <OrgCard />
      </div>
    </div>
  )
}

export default Profile