import { useState } from "react"
import QuestionCard from "../components/QuestionCard"
import Navbar from "../components/Navbar"
import questions from "../data/questions.json"
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate();

  function handleAnswer(qid, answer) {
    setAnswers(prev => ({
      ...prev,
      [qid]: answer
    }))
  }

  const handleSubmit = async () => {
    let filled = true;
    
    questions.forEach((q) => {
      const answer = answers[q.id]

      if (!answer || (q.type === "checkbox" && answer.length ===0)){
        filled = false;
      }
    });

    if (!filled){
      alert("Some questions are not filled out.");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer
    }));

    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses: formattedAnswers })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("successfully sent answers to db")
      navigate("/result");
    } else {
      console.log(data.error)
    }
  }

  return (
    <div className="quiz-container">
      <h1 style={{textAlign:"center"}}>Mission Matcher</h1>
      <p style={{textAlign:"center", marginTop:"-30px"}}>This is a Quiz page placeholder</p>

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

      <button onClick={handleSubmit}>SUBMIT QUIZ</button>
    </div>
  )
}

export default Quiz