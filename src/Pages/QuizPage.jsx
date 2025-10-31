import { useState, useEffect } from "react";
import "../App.css";

export default function QuizPage() {
//   sa admin yung paglagay ng questions dapat may mga input field yung questions, answers,
// timelimit and drop down type, and kapagg multiple choice

      const [quizUser, setQuizUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("quizUser")
    if (storedUser) {
      setQuizUser(JSON.parse(storedUser))
    }
  }, [])

  const quizData = [
    {
      type: "enumeration",
      question: "Enumerate the main components of a computer system.",
      answers: ["CPU", "RAM", "Storage", "Motherboard"],
      timeLimit: 60,
    },
    {
      type: "enumeration",
      question: "List the types of computer memory.",
      answers: ["RAM", "ROM", "Cache", "Virtual Memory"],
      timeLimit: 60,
    },
    {
      type: "enumeration",
      question: "Enumerate the steps in computer maintenance.",
      answers: ["Cleaning", "Updating", "Defragmentation", "Backup"],
      timeLimit: 60,
    },
    {
      type: "multiple-choice",
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Central Program Utility",
        "Computer Personal Unit",
        "Central Processor Utility",
      ],
      correct: 0,
      timeLimit: 30,
    },
    {
      type: "multiple-choice",
      question: "Which component is responsible for temporary data storage?",
      options: ["Hard Drive", "RAM", "ROM", "Cache"],
      correct: 1,
      timeLimit: 30,
    },
    {
      type: "multiple-choice",
      question: "What is the primary function of a motherboard?",
      options: [
        "Store data",
        "Connect all components",
        "Cool the system",
        "Display graphics",
      ],
      correct: 1,
      timeLimit: 30,
    },
    {
      type: "identification",
      question: "What is the name of the cooling device used in computers?",
      answer: "fan",
      timeLimit: 40,
    },
    {
      type: "identification",
      question: "Identify the device that converts AC power to DC power.",
      answer: "power supply",
      timeLimit: 40,
    },
    {
      type: "identification",
      question: "What is the name of the circuit board that holds the CPU?",
      answer: "motherboard",
      timeLimit: 40,
    },
    {
      type: "identification",
      question: "Identify the storage device that uses spinning platters.",
      answer: "hard drive",
      timeLimit: 40,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(quizData.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(quizData[0].timeLimit);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (showScore || showThankYou) return;
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
  }, [currentQuestion, showScore]);

  const question = quizData[currentQuestion];

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

  // const handlePrev = () => {
  //   if (currentQuestion > 0) {
  //     setCurrentQuestion(currentQuestion - 1);
  //     setTimeLeft(quizData[currentQuestion - 1].timeLimit);
  //   }
  // };

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
          <p className="text-slate-400 mb-4">Your Score:</p>
          <p className="text-5xl font-bold text-cyan-400 mb-4">{percentage}%</p>
          <button
            onClick={() => setShowThankYou(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
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
            <h1 className="text-2xl font-bold text-cyan-400 mb-3">{quizUser.firstName} {quizUser.lastName}</h1>
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

            {/* Question */}
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

              {/* Options / Inputs */}
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

            {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-lg"
          >
            {currentQuestion === quizData.length - 1 ? "Submit Quiz" : (
              <>
                Next
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
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
