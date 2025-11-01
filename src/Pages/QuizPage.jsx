import { useState, useEffect } from "react";
import "../App.css";
import { getFromEndpoint } from "../components/apiService";
import { useParams } from "react-router-dom";

export default function QuizPage() {
  const { quiz_id } = useParams();
  const [quizUser, setQuizUser] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`quizProgress_${quiz_id}`);
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      setCurrentQuestion(data.currentQuestion || 0);
      setUserAnswers(data.userAnswers || []);
      setTimeLeft(data.timeLeft || 30);
    }

    const storedUser = localStorage.getItem("quizUser");
    if (storedUser) {
      setQuizUser(JSON.parse(storedUser));
    }
  }, [quiz_id]);


  useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await getFromEndpoint(`get_questions.php?quiz_id=${quiz_id}`);
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

            // ✅ If no saved answers, initialize fresh
              const savedProgress = localStorage.getItem(`quizProgress_${quiz_id}`);
              if (savedProgress) {
                const data = JSON.parse(savedProgress);
                setCurrentQuestion(data.currentQuestion || 0);
                setUserAnswers(data.userAnswers || []);

              if (!data.showScore && !data.showThankYou && data.endTime) {
                const remaining = Math.floor((data.endTime - Date.now()) / 1000);
                setTimeLeft(remaining > 0 ? remaining : 0);
              }
                  // 🏁 Restore quiz completion states
                if (data.showScore) {
                  setScore(data.score || { totalScore: 0, totalPossible: 0 });
                  setShowScore(true);
                } else if (data.showThankYou) {
                  setShowThankYou(true);
                }
              } else {
                setTimeLeft(30);
              }
              const storedUser = localStorage.getItem("quizUser");
              if (storedUser) setQuizUser(JSON.parse(storedUser));
          }
        } catch (err) {
          console.error("Error fetching questions:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }, [quiz_id]);


// ✅ Save progress including quiz state
  useEffect(() => {
    if (!loading && quizData.length > 0) {
      const data = {
        currentQuestion,
        userAnswers,
        endTime: Date.now() + timeLeft * 1000,
        showScore,
        showThankYou,
        score,
      };
      localStorage.setItem(`quizProgress_${quiz_id}`, JSON.stringify(data));
    }
  }, [currentQuestion, userAnswers, timeLeft, loading, showScore, showThankYou, score]);


  // ✅ Timer persists (does not reset on refresh)
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
    let totalPossible = 0;

    quizData.forEach((q, i) => {
      const ans = userAnswers[i];
      if (q.type === "multiple-choice") {
        totalPossible += 1;
        if (ans === q.correct) totalScore += 1;
      } else if (q.type === "identification") {
        totalPossible += 1;
        if (ans?.toLowerCase().trim() === q.answer.toLowerCase().trim()) {
          totalScore += 1;
        }
      } else if (q.type === "enumeration") {
        const correctAnswers = (q.answers || [])
          .map((a) => a.toLowerCase().trim())
          .filter((a) => a !== "");
        totalPossible += correctAnswers.length;
        let userInput = [];
        if (Array.isArray(ans)) {
          userInput = ans.map((a) => a.toLowerCase().trim());
        } else if (typeof ans === "string") {
          userInput = ans
            .split(/[\s,]+/) 
            .map((a) => a.toLowerCase().trim())
            .filter((a) => a !== "");
        }
        console.log("✅ ENUM CHECK:", { correctAnswers, userInput });
        let matchCount = 0;
        correctAnswers.forEach((correct) => {
          if (userInput.includes(correct)) matchCount++;
        });
        totalScore += matchCount;
      }
    });

    setScore({ totalScore, totalPossible });
    setShowScore(true);

    // ✅ Clear saved progress after submission
    localStorage.removeItem(`quizProgress_${quiz_id}`);
  };

const percentage = score.totalPossible
  ? Math.round((score.totalScore / score.totalPossible) * 100)
  : 0;


  const question = quizData[currentQuestion] || null;


  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading quiz questions...</p>
      </div>
    );
  }

if (showReview) {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-cyan-400">📝 Quiz Review</h2>

          {/* 🔙 Back Button */}
          <button
            onClick={() => setShowReview(false)}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        {/* Questions with Points */}
        {quizData.map((q, i) => {
          const userAns = userAnswers[i];
          let earned = 0;
          let possible = 1;

          // 🧮 Compute points per question
          if (q.type === "multiple-choice") {
            possible = 1;
            earned = userAns === q.correct ? 1 : 0;
          } else if (q.type === "identification") {
            possible = 1;
            earned =
              userAns?.toLowerCase().trim() === q.answer?.toLowerCase().trim()
                ? 1
                : 0;
          } else if (q.type === "enumeration") {
            // ✅ Clean and reliable enumeration scoring
              const correct = (q.answers || [])
                .map((a) => a.toLowerCase().trim())
                .filter(Boolean);
              possible = correct.length;

              let userList = [];
              if (Array.isArray(userAns)) {
                userList = userAns.map((a) => a.toLowerCase().trim());
              } else if (typeof userAns === "string") {
                userList = userAns
                  .split(/[\s,]+/) // ✅ handles spaces, commas, and newlines
                  .map((a) => a.toLowerCase().trim())
                  .filter(Boolean);
              }

              // ✅ Count how many correct answers the user got
              earned = correct.filter((ans) => userList.includes(ans)).length;
          }

          const isCorrect = earned === possible;
          const correctLetter =
            q.type === "multiple-choice"
              ? String.fromCharCode(65 + q.correct)
              : null;

          return (
            <div
              key={i}
              className="bg-slate-800 p-5 rounded-2xl mb-4 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {i + 1}. {q.question}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isCorrect
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {earned}/{possible} point{possible > 1 ? "s" : ""}
                </span>
              </div>

              {/* Multiple choice */}
              {q.type === "multiple-choice" && (
                <div className="space-y-2 mt-2">
                  {q.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isUserChoice = userAns === idx;
                    const isRight = q.correct === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border ${
                          isRight
                            ? "border-green-500 bg-green-900/30"
                            : isUserChoice
                            ? "border-red-500 bg-red-900/30"
                            : "border-slate-700"
                        }`}
                      >
                        {letter}. {opt}
                      </div>
                    );
                  })}
                  {!isCorrect && (
                    <p className="mt-3 text-sm text-green-400">
                      ✅ Correct answer: {correctLetter}. {q.options[q.correct]}
                    </p>
                  )}
                </div>
              )}

              {/* Identification */}
              {q.type === "identification" && (
                <div className="mt-3">
                  <p>
                    <span className="font-semibold text-slate-400">
                      Your answer:
                    </span>{" "}
                    <span
                      className={
                        isCorrect ? "text-green-400" : "text-red-400"
                      }
                    >
                      {userAns || "(No answer)"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p>
                      <span className="font-semibold text-slate-400">
                        Correct answer:
                      </span>{" "}
                      <span className="text-green-400">{q.answer}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Enumeration */}
              {q.type === "enumeration" && (
                <div className="mt-3">
                  <p className="font-semibold text-slate-400 mb-1">
                    Your answers:
                  </p>
                  <ul className="list-disc list-inside mb-2">
                    {(Array.isArray(userAns)
                      ? userAns
                      : (userAns || "").split(/[\s,]+/)
                    ).map((ans, idx) => (
                      <li key={idx} className="text-slate-300">
                        {ans.trim()}
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold text-slate-400 mb-1">
                    Correct answers:
                  </p>
                  <ul className="list-disc list-inside">
                    {(q.answers || []).map((ans, idx) => (
                      <li
                        key={idx}
                        className={`${
                          (userAns || "")
                            .toLowerCase()
                            .includes(ans.toLowerCase().trim())
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {ans}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* Finish Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowThankYou(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}




  // if (showThankYou) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
  //       <div className="max-w-md text-center p-8 bg-slate-800 rounded-2xl border border-slate-700">
  //         <div className="text-6xl mb-4">🎓</div>
  //         <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
  //         <p className="text-slate-400 mb-6">Your responses have been recorded.</p>
  //         <button
           
  //           className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
  //         >
  //           Back to Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

if (showScore) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="max-w-md w-full p-8 bg-slate-800 rounded-2xl border border-slate-700 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>

        <p className="text-slate-400 mb-2">You got</p>
        <p className="text-5xl font-bold text-cyan-400 mb-2">
          {score.totalScore} / {score.totalPossible}
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
          onClick={() => setShowReview(true)}
          className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Review Answers
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
                    placeholder="Enter your answers, separated by commas or new lines..."
                    value={
                      Array.isArray(userAnswers[currentQuestion])
                        ? userAnswers[currentQuestion].join(", ")
                        : userAnswers[currentQuestion] || ""
                    }
                    onChange={(e) => handleAnswerChange(e.target.value)} 
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
