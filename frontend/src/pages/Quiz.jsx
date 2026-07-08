import { useState } from "react"
import QuestionCard from "../components/QuestionCard"
import Navbar from "../components/Navbar"
import questions from "../data/questions.json"

function Quiz() {
  const [answers, setAnswers] = useState({}) // just to have something to store for now

  function handleAnswer(qid, answer) {
    setAnswers(prev => ({
      ...prev,
      [qid]: answer
    }))
  }

  return (
    <div className="quiz-container">
      <h1 style={{textAlign:"center"}}>Mission Matcher</h1>
      <p style={{textAlign:"center", marginTop:"-30px"}}>Your answers will help us understand your passions and connect you with nonprofits that fit your goals, values, and vision for making an impact. Take the quiz and discover organizations worth supporting.</p>

      <div className="card-container">

        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            qid={q.id}
            question={q.question}
            type={q.type}
            options={q.options || []}
            value={answers[q.id] || (q.type === "checkbox" ? [] : "")} // cuz only checkbox takes array
            onChange={(answer) => handleAnswer(q.id, answer)}
            />
        ))}

      </div>

      <button>SUBMIT QUIZ</button>
    </div>
  )
}

export default Quiz