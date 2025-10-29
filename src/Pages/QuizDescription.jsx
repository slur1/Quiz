import { useState } from "react";
import "../App.css";

export default function QuizDescription({ onBackToLanding, onStartQuiz }) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    section: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    
    localStorage.setItem("quizUser", JSON.stringify(formData))

    
    setShowModal(false)

    
    onStartQuiz()
  }

  return (
    <>
      {/* Main UI */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Quiz #1 — Computer System Servicing</h1>
        <p className="text-lg mb-8">
          Test your knowledge about computer hardware and system components!
        </p>

        <div className="flex gap-4">
          <button
            onClick={onBackToLanding}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Back
          </button>
          <button
            onClick={() => setShowModal(true)} // 🔥 ito magbubukas ng modal
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 animate-in fade-in">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white">Start Quiz</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Section</label>
                <select
                  required
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                >
                  <option value="">Select a section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Start Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
