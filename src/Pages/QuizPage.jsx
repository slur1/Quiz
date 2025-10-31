import { useState, useEffect } from "react";
import "../App.css";
import { getFromEndpoint } from "../components/apiService";

export default function QuizPage() {

  const [quizUser, setQuizUser] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("quizUser");
    if (storedUser) {
      setQuizUser(JSON.parse(storedUser));
    }
  }, []);


useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const quiz_id = 1;
      const res = await getFromEndpoint(`get_questions.php?quiz_id=${quiz_id}`);
      console.log("Fetched questions:", res.data); 
      if (res.data.status === "success" && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((q) => {
          const rawType = (q.question_type || q.type || "").toLowerCase().trim();
          const type = rawType.includes("multiple") ? "multiple-choice"
                      : rawType.includes("identification") ? "identification"
                      : rawType.includes("enumeration") ? "enumeration"
                      : "unknown";
          const formattedQuestion = {
            type,
            question: q.question_text || q.question || "",
            timeLimit: parseInt(q.time_limit) || 30,
          };

          if (type === "multiple-choice") {
            formattedQuestion.options = [
              q.choice_a || q.choiceA,
              q.choice_b || q.choiceB,
              q.choice_c || q.choiceC,
              q.choice_d || q.choiceD,
            ].filter(Boolean);
            formattedQuestion.correct = ["A", "B", "C", "D"].indexOf(
              (q.correct_answer || "").toUpperCase()
            );
          } else if (type === "identification") {
            formattedQuestion.answer = q.correct_answer;
          } else if (type === "enumeration") {
            formattedQuestion.answers = (q.correct_answer || "")
              .split(",")
              .map((a) => a.trim());
          }

          return formattedQuestion;
        });

        setQuizData(formatted);
        setUserAnswers(Array(formatted.length).fill(null));
        setTimeLeft(formatted[0]?.timeLimit || 30);
      } else {
        console.warn("No quiz data found.");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);


  // ✅ Timer
  useEffect(() => {
    if (showScore || showThankYou || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, showScore, loading]);

  const handleAnswerChange = (value) => {
    const updated = [...userAnswers];
    updated[currentQuestion] = value;
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(quizData[currentQuestion + 1].timeLimit);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;

    quizData.forEach((q, i) => {
      const ans = userAnswers[i];
      if (q.type === "multiple-choice" && ans === q.correct) {
        totalScore += 1;
      } else if (q.type === "identification" && ans?.toLowerCase() === q.answer.toLowerCase()) {
        totalScore += 1;
      } else if (q.type === "enumeration") {
        const matches = ans?.filter((a) =>
          q.answers.some((c) => c.toLowerCase() === a.toLowerCase())
        ).length;
        totalScore += (matches || 0) / q.answers.length;
      }
    });

    setScore(totalScore);
    setShowScore(true);
  };

  const percentage = Math.round((score / quizData.length) * 100);
  const question = quizData[currentQuestion] || null;


  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading quiz questions...</p>
      </div>
    );
  }


  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="max-w-md text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-slate-400 mb-6">Your responses have been recorded.</p>
          <button
           
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

if (showScore) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="max-w-md w-full p-8 bg-slate-800 rounded-2xl border border-slate-700 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>

        <p className="text-slate-400 mb-2">You got</p>
        <p className="text-5xl font-bold text-cyan-400 mb-2">
          {Math.round(score)} / {quizData.length}
        </p>
        <p className="text-slate-400 mb-4">correct answers</p>
        <p className="text-3xl font-semibold text-cyan-300">{percentage}%</p>

        <p className="mt-4 text-lg text-slate-300">
          {percentage >= 90
            ? "🌟 Excellent work!"
            : percentage >= 75
            ? "👍 Good job!"
            : percentage >= 50
            ? "🙂 Keep practicing!"
            : "😅 Better luck next time!"}
        </p>

        <button
          onClick={() => setShowThankYou(true)}
          className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
}


  return (
    <>

      {quizUser ? (
      <>
      <div className="min-h-[92vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-cyan-400 mb-3">
              {quizUser.firstName} {quizUser.lastName}
            </h1>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-cyan-400">Quiz #{1}</h1>
              <p className="text-slate-400">
                Question {currentQuestion + 1} of {quizData.length}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-700 h-2 rounded-full mb-6">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Question card */}
            {question ? (
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg mb-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">{question.question}</h2>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Time Left</p>
                    <p
                      className={`text-2xl font-bold ${
                        timeLeft <= 5
                          ? "text-red-500"
                          : timeLeft <= 10
                          ? "text-yellow-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                      {String(timeLeft % 60).padStart(2, "0")}
                    </p>
                  </div>
                </div>

                {/* Input types */}
                {question.type === "enumeration" && (
                  <textarea
                    className="w-full bg-slate-700 rounded-lg p-3 text-white focus:outline-none"
                    rows={5}
                    placeholder="Enter your answers, one per line..."
                    value={userAnswers[currentQuestion]?.join("\n") || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        e.target.value.split("\n").filter((a) => a.trim())
                      )
                    }
                  />
                )}

                {question.type === "multiple-choice" && (
                  <div className="space-y-3">
                    {question.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`w-full text-left px-4 py-3 rounded-lg border ${
                          userAnswers[currentQuestion] === i
                            ? "bg-cyan-600 border-cyan-600"
                            : "bg-slate-700 border-slate-600 hover:border-cyan-400"
                        }`}
                        onClick={() => handleAnswerChange(i)}
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
                    value={userAnswers[currentQuestion] || ""}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <p className="text-slate-400">No question available.</p>
            )}

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-lg"
              >
                {currentQuestion === quizData.length - 1 ? "Submit Quiz" : "Next"}
              </button>
            </div>
          </div>
        </div>
      <footer className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 TLE Quiz — All Rights Reserved. Made by Sir Je (<b>Designer of the web</b>) and Sir Ajhay (<b>Engineer of the web</b>)</p>
        </div>
      </footer>
      </>
      ) 
    : (
        <p>Loading user info...</p>
      )}
    </>
  );
}
