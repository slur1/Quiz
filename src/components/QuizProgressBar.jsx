// src/components/QuizProgressBar.jsx
export default function QuizProgressBar({ current, total }) {
  const width = total ? ((current + 1) / total) * 100 : 0;
  return (
    <div className="w-full bg-slate-700 h-2 rounded-full mb-6">
      <div
        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
