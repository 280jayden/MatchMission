function QuestionCard({question, type, options, value, onChange}) {
  return (
    <div>
      <h3>{question}</h3>

      {type == "radio" && (
        <div>
          {options.map(option => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                checked={value==={option}} 
                onChange={(e) => onChange(e.target.value)} />
              {option}
            </label>  
          ))}
        </div>
      )}

      {type == "checkbox" && (
        <div>
          {options.map(option => (
            <label key={option}>
              <input
                type="checkbox"
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
           onChange={(e) => onChange(e.target.value)}
        />
      )}


    </div>
  )
}