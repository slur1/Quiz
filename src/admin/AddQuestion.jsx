import React, { useState, useEffect } from "react";
import { getFromEndpoint, postToEndpoint } from "../components/apiService";

export default function AddQuestion() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizno, setQuizno] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionType: "",
      questionText: "",
      choices: ["", "", "", ""],
      correctAnswer: "",
      enumerationAnswers: [""],
    },
  ]);

  // Fetch quizzes from backend
  useEffect(() => {
    getFromEndpoint("fetch_quizzes.php")
      .then((res) => {
        if (res.data.status === "success") {
          setQuizzes(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching quizzes:", err));
  }, []);

  // Add new question block
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: "",
        questionText: "",
        choices: ["", "", "", ""],
        correctAnswer: "",
        enumerationAnswers: [""],
      },
    ]);
  };

  // Remove question block
  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // Update a field in a specific question
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // Update a choice (A–D)
  const handleChoiceChange = (qIndex, cIndex, value) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex] = value;
    setQuestions(updated);
  };

  // Enumeration handling
  const addEnumeration = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].enumerationAnswers.push("");
    setQuestions(updated);
  };

  const removeEnumeration = (qIndex, index) => {
    const updated = [...questions];
    updated[qIndex].enumerationAnswers.splice(index, 1);
    setQuestions(updated);
  };

  const handleEnumerationChange = (qIndex, index, value) => {
    const updated = [...questions];
    updated[qIndex].enumerationAnswers[index] = value;
    setQuestions(updated);
  };

  // Submit all questions
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizno) {
      alert("Please select a quiz number!");
      return;
    }

    try {
      const response = await postToEndpoint(
        "insert_questions.php",
        {
          quiz_no: quizno,
          questions: questions,
        }
      );

      if (response.data.status === "success") {
        alert("✅ All questions saved successfully!");
        setQuestions([
          {
            questionType: "",
            questionText: "",
            choices: ["", "", "", ""],
            correctAnswer: "",
            enumerationAnswers: [""],
          },
        ]);
      } else {
        alert("⚠️ Failed to save questions. Please try again.");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("❌ Error connecting to server.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white">
        Add Multiple Questions
      </h2>

      {/* Quiz Selector */}
      <div className="mb-6">
        <label className="block font-medium text-gray-300 mb-2">
          Select Quiz Number:
        </label>
        <select
          className="w-full shadow-lg bg-slate-700 border border-gray-500 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          value={quizno}
          onChange={(e) => setQuizno(e.target.value)}
          required
        >
          <option value="">-- Select Quiz Number --</option>
          {quizzes.map((quiz) => (
            <option key={quiz.quiz_id} value={quiz.quiz_no}>
              Quiz #{quiz.quiz_no}
            </option>
          ))}
        </select>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="p-6 bg-slate-700 border border-slate-600 rounded-xl shadow-md relative"
          >
            <h3 className="text-xl text-white font-semibold mb-4">
              Question {qIndex + 1}
            </h3>

            {/* Question Text */}
            <label className="block text-white mb-2">Question:</label>
            <textarea
              className="w-full bg-slate-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-400 outline-none mb-4"
              rows="3"
              placeholder="Enter question text..."
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              required
            ></textarea>

            {/* Question Type */}
            <label className="block text-white mb-2">Question Type:</label>
            <select
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
              value={q.questionType}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionType", e.target.value)
              }
              required
            >
              <option value="">-- Select Type --</option>
              <option value="multiple">Multiple Choice</option>
              <option value="identification">Identification</option>
              <option value="enumeration">Enumeration</option>
            </select>

            {/* Multiple Choice */}
            {q.questionType === "multiple" && (
              <div className="mb-4 text-white">
                <h4 className="font-medium mb-3">Choices</h4>
                {["A", "B", "C", "D"].map((label, i) => (
                  <div key={i} className="mb-2">
                    <label className="mr-2">{label}.</label>
                    <input
                      type="text"
                      placeholder={`Choice ${label}`}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 mt-1"
                      value={q.choices[i]}
                      onChange={(e) =>
                        handleChoiceChange(qIndex, i, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <div className="mt-3">
                  <label className="font-medium text-white">
                    Correct Answer (A, B, C, D):
                  </label>
                  <input
                    type="text"
                    maxLength="1"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 mt-1"
                    placeholder="Correct Answer"
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswer",
                        e.target.value.toUpperCase()
                      )
                    }
                    required
                  />
                </div>
              </div>
            )}

            {/* Identification */}
            {q.questionType === "identification" && (
              <div className="text-white mb-4">
                <label className="block mb-2">Correct Answer:</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2"
                  placeholder="Enter correct answer..."
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                  }
                  required
                />
              </div>
            )}

            {/* Enumeration */}
            {q.questionType === "enumeration" && (
              <div className="text-white">
                <h4 className="font-medium mb-3">Enumeration Answers</h4>
                {q.enumerationAnswers.map((ans, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <input
                      type="text"
                      className="flex-1 bg-slate-800 border border-slate-600 rounded-lg p-2"
                      placeholder={`Answer ${i + 1}`}
                      value={ans}
                      onChange={(e) =>
                        handleEnumerationChange(qIndex, i, e.target.value)
                      }
                      required
                    />
                    {q.enumerationAnswers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEnumeration(qIndex, i)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addEnumeration(qIndex)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  + Add More
                </button>
              </div>
            )}

            {/* Remove Question Button */}
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add New Question */}
        <div className="text-center">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Add Another Question
          </button>
        </div>

        {/* Save All */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-lg text-white font-semibold"
          >
            Save All Questions
          </button>
        </div>
      </form>
    </div>
  );
}
