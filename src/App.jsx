import { useState } from "react"
import LandingPage from "./Pages/LandingPage"
import QuizDescription from "./Pages/QuizDescription"
import QuizPage from "./Pages/QuizPage"

export default function App() {
  const [stage, setStage] = useState("landing")

  return (
    <>
      {stage === "landing" && (
        <LandingPage onNavigateToQuizzes={() => setStage("quizDescription")} />
      )}

      {stage === "quizDescription" && (
        <QuizDescription 
          onBackToLanding={() => setStage("landing")} 
          onStartQuiz={() => setStage("quiz")} 
        />
      )}

      {stage === "quiz" && (
        <QuizPage onGoHome={() => setStage("landing")} />
      )}
    </>
  )
}
