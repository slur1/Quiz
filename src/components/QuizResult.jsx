// src/components/QuizResult.jsx
export default function QuizResult({ score, onQuit}) {
  const percentage = score.totalPossible ? Math.round((score.totalScore / score.totalPossible) * 100) : 0;

  return (
    <div className="min-h-[92vh] flex items-center justify-center bg-slate-900 text-white">
      <div className="max-w-md w-full p-8 bg-slate-800 rounded-2xl border border-slate-700 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-slate-400 mb-2">You got</p>
        <p className="text-5xl font-bold text-cyan-400 mb-2">{score.totalScore} / {score.totalPossible}</p>
        <p className="text-3xl font-semibold text-cyan-300">{percentage}%</p>

        <p className="mt-4 text-lg text-slate-300">
          {percentage >= 90 ? "🌟 Excellent work!" : percentage >= 75 ? "👍 Good job!" : percentage >= 50 ? "🙂 Keep practicing!" : "😅 Better luck next time!"}
        </p>

        <div className="flex gap-3 justify-center mt-6">
          <button onClick={onQuit} className="px-4 py-2 rounded bg-red-600">Finish</button>
        </div>
      </div>
    </div>
  );
}
