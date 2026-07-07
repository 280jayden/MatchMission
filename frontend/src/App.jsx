import { useState, useEffect } from 'react'
import './styles/App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    fetch('/api/time')
      .then(res => res.json())
      .then(data => {
        setCurrentTime(data.time)
      })
  }, [])

  return (
    <>
      <h1>MatchMission</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <p>
          The current time is {new Date(currentTime * 1000).toLocaleString()}.
        </p>
      </div>
    </>
  )
}

export default App