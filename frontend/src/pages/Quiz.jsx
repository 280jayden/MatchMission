import { useState } from "react"
import QuestionCard from "../components/QuestionCard"
import Navbar from "../components/Navbar"
import questions from "../data/questions.json"
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
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

    setLoading(true)

    try {
      const quizResponse = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ responses: formattedAnswers })
      });

      const quizData = await quizResponse.json();

      if (!quizResponse.ok) {
        // console.log("successfully sent answers to db")
        // navigate("/result");
        console.log(data.error)
        setLoading(false)
        return;
      }

      console.log("successfully sent answers to db")

      const scoreResponse = await fetch("/api/score_orgs", {
        method: "POST",
        credentials: "include",
      });

      const scoreData = await scoreResponse.json();

      if (!scoreResponse.ok) {
        console.log(data.error)
        setLoading(false)
        return;
      }

      navigate("/result");

    } catch (err) {
      console.log(err)
      setLoading(false)
    }

  }

  if (loading) {
    return (
      <div className="quiz-container">
        <h1 style={{textAlign:"center"}}>Loading....</h1>
      </div>
    )
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

      <button onClick={handleSubmit}disabled={loading}>
        {loading ? "MATCHING YOU..." : "SUBMIT QUIZ" }
        </button>
    </div>
  )
}

export default Quiz