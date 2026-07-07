import { useState } from "react"
import QuestionCard from "../components/QuestionCard"

function Quiz() {
  const [questionAnswer, setQuestionAnswer] = useState("") // just to have something to store for now

  return (
    <div>
      <h1>Quiz</h1>
      <p>This is a Quiz page placeholder</p>

      <QuestionCard
        question="Are you questioning?"
        type="radio"
        options={["yes", "no", "maybe"]}
        value = {questionAnswer}
        onChange = {setQuestionAnswer} />
    </div>
  )
}

export default Quiz