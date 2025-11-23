import React, { useState } from "react"

export default function AddQuiz() {
  const [formData, setFormData] = useState({
    quizNumber: "",
    quizTitle: "",
    quizDescription: "",
  })

  const [quizzes, setQuizzes] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.quizNumber && formData.quizTitle) {
      setQuizzes((prev) => [...prev, { ...formData }])
      setFormData({ quizNumber: "", quizTitle: "", quizDescription: "" })
    }
  }

  return (
   <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add Quiz
      </h1>
    <div className="space-y-6">
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Number</label>
            <input
              type="text"
              name="quizNumber"
              value={formData.quizNumber}
              onChange={handleChange}
              placeholder="e.g., QZ001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
            <input
              type="text"
              name="quizTitle"
              value={formData.quizTitle}
              onChange={handleChange}
              placeholder="Enter quiz title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Description</label>
            <textarea
              name="quizDescription"
              value={formData.quizDescription}
              onChange={handleChange}
              placeholder="Enter quiz description"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

         
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gray-600 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200"
          >
            Add Quiz
          </button>
        </form>
      </div>

      
      {quizzes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full max-w-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Added Quizzes</h3>
          <div className="space-y-3">
            {quizzes.map((quiz, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{"Quiz Title: " + quiz.quizTitle}</p>
                    <p className="text-semibold text-gray-900">{"Quiz Number: " + quiz.quizNumber}</p>
                    {quiz.quizDescription && (
                      <p className="text-semibold text-gray-900">{"Quiz Descrption: " + quiz.quizDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
  )
}
