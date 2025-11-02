// src/components/QuizQuestion.jsx
export default function QuizQuestion({ question, userAnswer, onAnswerChange, timeLeft }) {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg mb-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{question.question}</h2>
        <div className="text-right">
          <p className="text-slate-400 text-xs">Time Left</p>
          <p className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-500" : timeLeft <= 10 ? "text-yellow-400" : "text-cyan-400"}`}>
            {String(Math.floor(timeLeft / 60)).padStart(2,"0")}:{String(timeLeft % 60).padStart(2,"0")}
          </p>
        </div>
      </div>

      {question.type === "enumeration" && (
        <textarea
          className="w-full bg-slate-700 rounded-lg p-3 text-white focus:outline-none"
          rows={5}
          placeholder="Enter your answers, separated by commas or new lines..."
          value={Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      )}

      {question.type === "multiple-choice" && (
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswerChange(i)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${userAnswer === i ? "bg-cyan-600 border-cyan-600" : "bg-slate-700 border-slate-600 hover:border-cyan-400"}`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      )}

      {question.type === "identification" && (
        <input
          type="text"
          className="w-full bg-slate-700 rounded-lg p-3 text-white focus:outline-none"
          placeholder="Type your answer..."
          value={userAnswer || ""}
          onChange={(e) => onAnswerChange(e.target.value)}
        />
      )}
    </div>
  );
}
