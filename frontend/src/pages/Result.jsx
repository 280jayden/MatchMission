import OrgCard from "../components/OrgCard"

function Result() {
  return (
    <div>
      <h1 style={{textAlign:"center"}}>Results</h1>
      <p style={{textAlign:"center", marginBottom:"70px"}}>Based on your quiz responses, here are some organizations that might fit your preferences.</p>
      
      {/* later, will make it a map based on a dict or array that gets passed in */}
      <div className="card-container">
        <OrgCard />
        <OrgCard />
      </div>
    </div>
  )
}

export default Result