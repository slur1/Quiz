import { useState, useEffect, useCallback, useRef } from "react";
import "../App.css";
import { getFromEndpoint, postToEndpoint } from "../components/apiService";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import PixelLoader from "../components/PixelLoader";
import QuizHeader from "../components/QuizHeader";
import QuizProgressBar from "../components/QuizProgressBar";
import QuizQuestion from "../components/QuizQuestion";
import QuizResult from "../components/QuizResult";
import Footer from "../components/Footer";

import useQuizStorage from "../hooks/useQuizStorage";
import useQuizTimer from "../hooks/useQuizTimer";
import LogoIcon from "../components/LogoIcon";

export default function QuizPage() {
  const { quiz_id, student_id } = useParams();
  const navigate = useNavigate();
  const [quizUser, setQuizUser] = useState(null);
  const [quizData, setQuizData] = useState([]);  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState({ totalScore: 0, totalPossible: 0 });
  const [showThankYou, setShowThankYou] = useState(false);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);
  const isAdvancingRef = useRef(false);
  const {
    restoreState,
    saveState,
    clearState,
    ensureSavedQuestions,
    getSavedQuestions,
  } = useQuizStorage(quiz_id);

  const {
    timeLeft,
    setTimeLeft,
    startTimerFor,
    stopTimer,
  } = useQuizTimer({
    onExpire: () => handleNext(),  
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("quizUser");
    if (storedUser) setQuizUser(JSON.parse(storedUser));

    const restored = restoreState();
    if (restored) {
      if (restored.completedAt && Date.now() - restored.completedAt > 1 * 60 * 1000) {
        clearState();
        navigate(`/thankyou`);
        return;
      }

      setCurrentQuestion(restored.currentQuestion ?? 0);
      if (!restored.showScore && !restored.showThankYou) {
        setUserAnswers(restored.userAnswers ?? []);
      } else {
        setUserAnswers([]); // prevent auto-highlighting
      }

      if (restored.showScore) {
        setShowScore(true);
        setScore(restored.score);
        return;
      }
      if (restored.showThankYou) setShowThankYou(true);

      if (restored.endTime) {
        const remaining = Math.floor((restored.endTime - Date.now()) / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
      }
    }
  }, [quiz_id, navigate]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getFromEndpoint(`get_questions.php?quiz_id=${quiz_id}`);
        if (res.data?.status === "success" && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((q) => {
            const rawType = (q.question_type || q.type || "").toLowerCase().trim();
            const type = rawType.includes("multiple")
              ? "multiple-choice"
              : rawType.includes("identification")
              ? "identification"
              : rawType.includes("enumeration")
              ? "enumeration"
              : "unknown";

            const fq = {
              type,
              question: q.question_text || q.question || "",
              timeLimit: parseInt(q.time_limit) || 30,
            };

            if (type === "multiple-choice") {
              fq.options = [
                q.choice_a || q.choiceA,
                q.choice_b || q.choiceB,
                q.choice_c || q.choiceC,
                q.choice_d || q.choiceD,
              ].filter(Boolean);
              fq.correct = ["A", "B", "C", "D"].indexOf((q.correct_answer || "").toUpperCase());
            } else if (type === "identification") {
              fq.answer = q.correct_answer || "";
            } else if (type === "enumeration") {
              fq.answers = (q.correct_answer || "").split(",").map((a) => a.trim());
            }

            return fq;
          });

          const savedQuestions = getSavedQuestions();
          if (savedQuestions) {
            setQuizData(savedQuestions);
          } else {
            const shuffleArray = (arr) => {
              const copy = [...arr];
              for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
              }
              return copy;
            };
            const shuffled = shuffleArray(formatted);
            setQuizData(shuffled);
            ensureSavedQuestions(shuffled);
          }

        } else {
          console.error("No questions returned or unexpected response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setTimeout(() => setLoading(false), 700);
      }
    };

    fetchQuestions();
  }, [quiz_id, ensureSavedQuestions, getSavedQuestions]);

  
  useEffect(() => {
      if (loading || showScore || showThankYou) return;
      saveState({
        currentQuestion,
        userAnswers,
        endTime: Date.now() + timeLeft * 1000,
        showScore,
        showThankYou,
        score,
      });
  }, [currentQuestion, userAnswers, timeLeft, loading, showScore, showThankYou, score, saveState, quizData.length]);

  useEffect(() => {
    if (loading || showScore || showThankYou) return;
    const q = quizData[currentQuestion];
    const timeForQuestion = q?.timeLimit ?? 30;
    const initialTime = timeLeft > 0 ? timeLeft : timeForQuestion;
    setTimeLeft(initialTime);
    startTimerFor(initialTime);
    return () => stopTimer(); // cleanup
  }, [currentQuestion, quizData, loading, showScore, showThankYou]);


  const handleAnswerChange = (value) => {
    const updated = [...userAnswers];
    updated[currentQuestion] = value;
    setUserAnswers(updated);
    saveState({
      currentQuestion,
      userAnswers: updated,
      endTime: Date.now() + timeLeft * 1000,
      showScore,
      showThankYou,
      score,
    });
  };

  function computeScore() {
    let totalScore = 0;
    let totalPossible = 0;
    const clean = (str) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[.,-]/g, "")   
        .replace(/\s+/g, " ");   
    };
    quizData.forEach((q, i) => {
      const ans = userAnswers[i];
      if (q.type === "multiple-choice") {
        totalPossible += 1;
        if (ans === q.correct) totalScore += 1;
      }

      else if (q.type === "identification") {
        totalPossible += 1;

        if (!ans) return;

        const cleanUser = clean(ans);
        const cleanCorrect = clean(q.answer);

        if (cleanUser === cleanCorrect) {
          totalScore += 1;
        }
      }

      else if (q.type === "enumeration") {
        const correctList = (q.answers || []).map(clean);
        totalPossible += correctList.length;

        if (!ans) return;

        const userList = ans
          .split(/[\n,]+/)       
          .map(clean)
          .filter(Boolean);

        correctList.forEach((correctAnswer) => {
          if (userList.includes(correctAnswer)) {
            totalScore += 1;
          }
        });
      }
    });

    return { totalScore, totalPossible };
  }


  const handleSubmit = async () => {
    const { totalScore, totalPossible } = computeScore();
    setScore({ totalScore, totalPossible });
    setShowScore(true);

    const resultData = {
      student_id,
      quiz_id,
      answers: quizData.map((q, i) => {
        const userAnsIndex = userAnswers[i];
        let userAnswerText = "";

        if (q.type === "multiple-choice" && userAnsIndex != null) {
          userAnswerText = q.options[userAnsIndex] ?? "";
        } else if (q.type === "identification") {
          userAnswerText = userAnswers[i] ?? "";
        } else if (q.type === "enumeration") {
          userAnswerText = userAnswers[i] ?? "";
        }

        return {
          question: q.question,
          type: q.type,
          user_answer: userAnswerText,
          correct_answer:
            q.type === "multiple-choice"
              ? q.options[q.correct] ?? ""    
              : q.type === "identification"
              ? q.answer ?? ""
              : q.type === "enumeration"
              ? (q.answers || []).join(", ")
              : "",
        };
      }),
      total_score: totalScore,
      total_possible: totalPossible,
    };

    try {
      const response = await postToEndpoint("save_quiz_result.php", resultData);
      if (response?.data?.status === "success") {
        console.log("✅ Quiz saved to backend");
      } else {
        console.warn("Backend response:", response?.data);
      }
    } catch (err) {
      console.error("Error saving quiz result:", err);
    }

    saveState({
      showScore: true,
      score: { totalScore, totalPossible },
      showThankYou: false,
      userAnswers,
      quizCompleted: true,
      completedAt: Date.now(),
    });
  };

const handleNext = useCallback(() => {
  // 🚫 Prevent double call
  if (isAdvancingRef.current) return;
  isAdvancingRef.current = true;

  stopTimer();

  if (currentQuestion < quizData.length - 1) {
    setCurrentQuestion((c) => c + 1);
    const nextQ = quizData[currentQuestion + 1];
    setTimeLeft(nextQ?.timeLimit ?? 30);
  } else {
    handleSubmit();
  }

  // ✅ Allow next call after short delay
  setTimeout(() => {
    isAdvancingRef.current = false;
  }, 500);
}, [currentQuestion, quizData, stopTimer, handleSubmit]);


  useEffect(() => {
  let focusRecentlyLost = false;
  const handleFocusLoss = () => {
    if (!showScore && !showThankYou && !focusRecentlyLost) {
      focusRecentlyLost = true;
      setFocusLossCount((count) => count + 1);
      setIsBlurred(true);

      setTimeout(() => {
        focusRecentlyLost = false;
      }, 1000);
    }
  };
  const handleFocusGain = () => {
    setIsBlurred(false);
  };

  const handleVisibilityChange = () => {
    if (
      document.visibilityState === "hidden" &&
      !showScore &&
      !showThankYou &&
      !focusRecentlyLost
    ) {
      focusRecentlyLost = true;
      setFocusLossCount((count) => count + 1);
      setIsBlurred(true);

      setTimeout(() => {
        focusRecentlyLost = false;
      }, 1000);
    } else if (document.visibilityState === "visible") {
      setIsBlurred(false);
    }
  };

  const handleResize = () => {
    if (!showScore && !showThankYou && !focusRecentlyLost) {
      focusRecentlyLost = true;
      setFocusLossCount((count) => count + 1);
      setIsBlurred(true);

      setTimeout(() => {
        focusRecentlyLost = false;
      }, 1000);
    }
  };

  window.addEventListener("blur", handleFocusLoss);
  window.addEventListener("focus", handleFocusGain);
  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener("blur", handleFocusLoss);
    window.removeEventListener("focus", handleFocusGain);
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [showScore, showThankYou]);

useEffect(() => {
  if (focusLossCount === 1) {
    Swal.fire({
      title: "Focus Lost!",
      text: "You switched tabs or screens. Please stay on this page. One more attempt will auto-submit your quiz.",
      icon: "warning",
      confirmButtonText: "OK",
      background: "#334155",
      color: "#ffffff",
    });
  } else if (focusLossCount >= 2) {
    Swal.fire({
      title: "Multiple Focus Changes Detected!",
      text: "You switched screens or tabs again. The quiz will now be submitted.",
      icon: "error",
      confirmButtonText: "OK",
      background: "#334155",
      color: "#ffffff",
    }).then(() => handleSubmit());
  }
}, [focusLossCount]);



  const handleQuit = () => {
    clearState();
    navigate(`/thankyou`);
  };

  const handleReviewAnswers = () => {
    setShowThankYou(true);
    stopTimer();
  };

  useEffect(() => {
    if (!showScore) return;
    const t = setTimeout(() => {
      clearState();
      navigate(`/thankyou`);
    }, 1 * 60 * 1000);  
    return () => clearTimeout(t);
  }, [showScore, clearState, navigate, quiz_id]);

  useEffect(() => {
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  const handleKeydown = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
    }
  };
  document.addEventListener("keydown", handleKeydown);

  const detectDevTools = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = "";
      document.body.style.backgroundColor = "white";
    }
  };
  const interval = setInterval(detectDevTools, 500);

  return () => {
    document.removeEventListener("keydown", handleKeydown);
    clearInterval(interval);
  };
}, []);


  if (loading) return <PixelLoader />;

  if (!quizUser) {
    const stored = localStorage.getItem("quizUser");
    if (stored) setQuizUser(JSON.parse(stored));
  }


  if (showScore) {
    return (
      <>
      <LogoIcon/>
        <QuizResult
          score={score}
          onQuit={handleQuit}
          onReview={handleReviewAnswers}
        />
        <Footer />
      </>
    );
  }

  const question = quizData[currentQuestion] ?? null;

  

  return (
    <>
      {quizUser ? (
        <>
        <div
          className={`transition-all duration-500 ${
            isBlurred ? "blur-md pointer-events-none select-none" : ""
          }`}
        >
          <div className="min-h-[92vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            <LogoIcon/>

            <div className="max-w-2xl mx-auto">
              <QuizHeader
                quizUser={quizUser}
                currentQuestion={currentQuestion}
                totalQuestions={quizData.length}
                onQuit={handleQuit}
              />

              <QuizProgressBar current={currentQuestion} total={quizData.length} />

              {question ? (
                <QuizQuestion
                  question={question}
                  userAnswer={userAnswers[currentQuestion]}
                  onAnswerChange={handleAnswerChange}
                  timeLeft={timeLeft}
                />
              ) : (
                <p className="text-slate-400">No question available.</p>
              )}

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 py-3 rounded-lg"
                >
                  {currentQuestion === quizData.length - 1 ? "Submit Quiz" : "Next"}
                </button>
              </div>
            </div>
          </div>

          <Footer />
          </div>
        </>
      ) : (
        <PixelLoader/>
      )}
    </>
  );
}
