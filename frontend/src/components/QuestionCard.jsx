import "./QuestionCard.css"

function QuestionCard({question, type, options, value, onChange}) {
  return (
    <div className="question-card">
      <h3>{question}</h3>

      {type == "radio" && (
        <div className = "question-options">
          {options.map(option => (
            <label className="question-option" key={option}>
              <input
                type="radio"
                name={question}
                value={option}
                checked={value===option} 
                onChange={(e) => onChange(e.target.value)} />
              {option}
            </label>  
          ))}
        </div>
      )}

      {type == "checkbox" && (
        <div className = "question-options">
          {options.map(option => (
            <label className="question-option" key={option}>
              <input
                type="checkbox"
                name={question}
                value={option}
                checked={value.includes(option)} 
                onChange={(e) => onChange(e.target.value)} />
              {option}
            </label>  
          ))}
        </div>
      )}

      {type == "text" && (
        <textarea 
          value = {value}
          className="question-textarea"
          onChange={(e) => onChange(e.target.value)}
        />
      )}


    </div>
  )
}

export default QuestionCard