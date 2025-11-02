import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { getFromEndpoint } from "../components/apiService";
import Footer from "../components/Footer";

export default function LandingPage({ onNavigateToQuizzes }) {
   const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    getFromEndpoint("fetch_quizzes.php")
      .then((res) => {
        if (res.data.status === "success") {
          setQuizzes(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching quizzes:", err));
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-600">Quizo</h1>
          <nav className="flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </a>
             <Link to={`/quiz/1`}>
            <button
              onClick={onNavigateToQuizzes}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Start Quiz
            </button></Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6 text-balance">Test Your Knowledge!</h2>
          <p className="text-xl text-white mb-4">
            Welcome to <span className="font-semibold text-blue-600">Quizo</span> — a fun and interactive way to
            learn while playing!
          </p>
          <p className="text-lg text-white mb-8">
            Challenge yourself and improve your skills with exciting quizzes.
          </p>
          <Link to={`/quiz/1`}>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition transform hover:scale-105"
          >
            Start Now
          </button>
          </Link>
        </div>

      {/* Quizzes Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center text-white mb-12 pt-24">Quizzes</h3>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
             {quizzes.map((quiz) => (
                <QuizCard key={quiz.quiz_id} quiz={quiz} />
              ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <Footer/>
    </>
  )
}

function QuizCard({ quiz }) {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    const randomCode = Array.from(crypto.getRandomValues(new Uint8Array(32))) // 64 chars
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    navigate(`/quiz/${randomCode}/${quiz.quiz_id}/${randomCode}`);
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      {/* Card Image - Geometric Pattern */}
      <div className="h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 relative overflow-hidden">
        {/* Geometric pattern using CSS */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="triangles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <polygon points="25,0 50,50 0,50" fill="rgba(255,255,255,0.3)" />
                <polygon points="0,0 25,50 0,50" fill="rgba(255,255,255,0.2)" />
                <polygon points="25,0 50,0 25,50" fill="rgba(255,255,255,0.25)" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#triangles)" />
          </svg>
        </div>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">💻</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 text-center">
        <h4 className="text-xl font-bold text-gray-900 mb-2">Quiz#{quiz.quiz_no}</h4>
        <p className="text-gray-600 mb-6">{quiz.title}</p>
        <button
          onClick={handleStartQuiz}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition"
        >
          START QUIZ
        </button>
      </div>
    </div>
  )
}
