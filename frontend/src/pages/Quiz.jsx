import { useState } from "react"
import QuestionCard from "../components/QuestionCard"

function Quiz() {
  const [questionAnswer, setQuestionAnswer] = useState("") // just to have something to store for now

  return (
    <div className="page-background">
        <h1 className="centered">Quiz</h1>
        <p className="centered">This is a Quiz page placeholder</p>

        <div className="card-container">
          <QuestionCard
            question="Are you questioning?"
            type="radio"
            options={["yes", "no", "maybe"]}
            value = {questionAnswer}
            onChange = {setQuestionAnswer} />

          <QuestionCard
            question="Are you questioning?"
            type="checkbox"
            options={["yes", "no", "maybe"]}
            value = {questionAnswer}
            onChange = {setQuestionAnswer} />

          <QuestionCard
            question="Are you questioning?"
            type="text"
            options={[]}
            value = {questionAnswer}
            onChange = {setQuestionAnswer} />
        </div>
    </div>
  )
}

export default Quiz