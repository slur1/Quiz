// src/components/QuizHeader.jsx
export default function QuizHeader({ quizUser, currentQuestion, totalQuestions, onQuit }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400">
          {quizUser?.firstName} {quizUser?.lastName}
        </h1>
        <p className="text-slate-400">Quiz #{1}</p>
      </div>

      <div className="text-right">
        <p className="text-slate-400">Question {currentQuestion + 1} of {totalQuestions}</p>
        <div className="mt-2">
          <button
            onClick={onQuit}
            className="text-xs px-3 py-1 bg-red-600 rounded-md hover:opacity-90"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
