import "./QuestionCard.css"

function QuestionCard({qid, question, type, options, value, onChange}) {
  return (
    <div className="item-card">
      <h3>Question {qid}:</h3>
      <p>{question}</p>

      {type == "radio" && (
        <div className = "question-options">
          {options.map(option => (
            <label className="question-option" key={option.value}>
              <input
                type="radio"
                name={question}
                value={option.value}
                checked={value===option.value} 
                onChange={(e) => onChange(e.target.value)} />
              {option.option}
            </label>  
          ))}
        </div>
      )}

      {type == "checkbox" && (
        <div className = "question-options">
          {options.map(option => (
            <label className="question-option" key={option.value}>
              <input
                type="checkbox"
                name={question}
                value={option.value}
                checked={value.includes(option.value)} 
                onChange={(e) => {
                  if (e.target.checked) {
                      onChange([...value, option.value]);
                    } else {
                      onChange(value.filter(v => v !== option.value));
                    }
                }} 
                />
              {option.option}
            </label>  
          ))}
        </div>
      )}

      {type == "text" && (
        <textarea 
          value={value}
          className="question-textarea"
          onChange={(e) => onChange(e.target.value)}
        />
      )}

    </div>
  )
}

export default QuestionCard