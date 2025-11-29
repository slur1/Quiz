import React, { useState, useEffect } from "react";
import { getFromEndpoint, postToEndpoint } from "../components/apiService";
import Swal from "sweetalert2";

export default function AddQuestion() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [quizno, setQuizno] = useState("");
  const [disabledQuizIds, setDisabledQuizIds] = useState([]);
  const [questions, setQuestions] = useState([
    {
      questionType: "",
      questionText: "",
      choices: ["", "", "", ""],
      correctAnswer: "",
      enumerationAnswers: [""],
      timeLimit: "",  
    },
  ]);

 useEffect(() => {
    getFromEndpoint("fetch_subjects.php")
      .then((res) => {
        if (res.data.status === "success") setSubjects(res.data.data);
      })
      .catch((err) => console.error("Error fetching subjects:", err));

    getFromEndpoint("fetch_quizzes.php")
      .then((res) => {
        if (res.data.status === "success") setQuizzes(res.data.data);
      })
      .catch((err) => console.error("Error fetching quizzes:", err));

    getFromEndpoint("fetch_quizzes_with_questions.php")
      .then((res) => {
        if (res.data.status === "success") {
          setDisabledQuizIds(res.data.data);  
        }
      })
      .catch((err) => console.error("Error fetching used quizzes:", err));
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionType: "",
        questionText: "",
        choices: ["", "", "", ""],
        correctAnswer: "",
        enumerationAnswers: [""],
        timeLimit: "",  
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleChoiceChange = (qIndex, cIndex, value) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex] = value;
    setQuestions(updated);
  };

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject) return alert("Please select a subject!");
    if (!quizno) return alert("Please select a quiz number!");

    try {
      const response = await postToEndpoint("insert_questions.php", {
        subject_id: subject,
        quiz_id: quizno,
        questions: questions,
      });

      if (response.data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Saved Successfully!",
            text: "All questions have been saved to the database.",
            showConfirmButton: false,
            background: "#334155", 
            color: "#ffffff",
            allowOutsideClick: false,
            allowEscapeKey: false,
            timerProgressBar: true,
            timer: 2000,
          });

          setQuestions([
            {
              questionType: "",
              questionText: "",
              choices: ["", "", "", ""],
              correctAnswer: "",
              enumerationAnswers: [""],
              timeLimit: "",
            },
          ]);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Save Failed",
            text: "Something went wrong. Please try again.",
            confirmButtonColor: "#3085d6",
            background: "#334155", 
            color: "#ffffff",
          });
        }
      } catch (error) {
      console.error("Error saving questions:", error);
        Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: "Could not connect to the server. Please check your network or backend.",
          confirmButtonColor: "#d33",
        });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add Questions
      </h1>
    <div className="px-4">
      
      <div className="max-w-4xl mt-10 bg-white rounded-2xl border border-gray-300 shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Add Questions
        </h2>

        {/* Subject Selector */}
        <div className="mb-6">
          <label className="block font-medium text-gray mb-2">
            Select Subject:
          </label>
          <select
            className="w-full shadow-lg bg-white border border-gray-300 text-gray rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="" disabled>-- Select Subject --</option>
            {subjects.map((subj) => (
              <option key={subj.subject_id} value={subj.subject_id}>
                {subj.subject_name}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Selector */}
        <div className="mb-6">
          <label className="block font-medium text-gray mb-2">
            Select Quiz Number:
          </label>
          <select
            className="w-full shadow-lg bg-white border border-gray-300 text-gray rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            value={quizno}
            onChange={(e) => setQuizno(e.target.value)}
            required
          >
            <option value="" disabled>-- Select Quiz Number --</option>
            {quizzes
              .filter((quiz) => Number(quiz.subject_id) === Number(subject)) 
              .map((quiz) => (
                <option
                  key={quiz.quiz_id}
                  value={quiz.quiz_id}
                  disabled={disabledQuizIds.includes(quiz.quiz_id)}
                >
                  Quiz #{quiz.quiz_no} - {quiz.title}{" "}
                  {disabledQuizIds.includes(quiz.quiz_id) ? "(Already has questions)" : ""}
                </option>
              ))}
          </select>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-6 bg-gray-100 border border-gray-300 rounded-xl shadow-md relative"
            >
              <h3 className="text-xl text-gray font-semibold mb-4">
                Question {qIndex + 1}
              </h3>

              {/* Question Text */}
              <label className="block text-gray mb-2">Question:</label>
              <textarea
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray focus:ring-2 focus:ring-blue-400 outline-none mb-4"
                rows="3"
                placeholder="Enter question text..."
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
                required
              ></textarea>

              {/* Question Type */}
              <label className="block text-gray mb-2">Question Type:</label>
              <select
                className="w-full bg-white border border-gray-300 text-gray rounded-lg p-3 mb-4 focus:ring-2 focus:ring-gray-400 outline-none shadow-lg"
                value={q.questionType}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionType", e.target.value)
                }
                required
              >
                <option value="" disabled>-- Select Type --</option>
                <option value="multiple">Multiple Choice</option>
                <option value="identification">Identification</option>
                <option value="enumeration">Enumeration</option>
              </select>

              {/* Time Limit */}
              <label className="block text-gray mb-2">Time Limit (seconds):</label>
              <input
                type="number"
                min="15"
                className="w-full bg-white border border-gray-300 rounded-lg p-2 mb-4 text-gray shadow-lg"
                placeholder="Enter time limit (e.g., 30)"
                value={q.timeLimit}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "timeLimit", e.target.value)
                }
                required
              />

              {/* Multiple Choice */}
              {q.questionType === "multiple" && (
                <div className="mb-4 text-gray">
                  <h4 className="font-medium mb-3">Choices</h4>
                  {["A", "B", "C", "D"].map((label, i) => (
                    <div key={i} className="mb-2">
                      <label className="mr-2">{label}.</label>
                      <input
                        type="text"
                        placeholder={`Choice ${label}`}
                        className="w-full bg-white border border-gray-400 rounded-lg p-2 mt-1"
                        value={q.choices[i]}
                        onChange={(e) =>
                          handleChoiceChange(qIndex, i, e.target.value)
                        }
                        required
                      />
                    </div>
                  ))}
                  <div className="mt-3">
                    <label className="font-medium text-gray">
                      Correct Answer (A, B, C, D):
                    </label>
                    <input
                      type="text"
                      maxLength="1"
                      className="w-full bg-white border border-gray-400 rounded-lg p-2 mt-1"
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
                <div className="text-gray mb-4">
                  <label className="block mb-2">Correct Answer:</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-400 rounded-lg p-2"
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
                <div className="text-gray">
                  <h4 className="font-medium mb-3">Enumeration Answers</h4>
                  {q.enumerationAnswers.map((ans, i) => (
                    <div key={i} className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        className="flex-1 bg-white border border-gray-400 rounded-lg p-2"
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
              className="bg-gray-600 text-white hover:bg-gray-900 transition px-8 py-3 rounded-lg text-white font-semibold"
            >
              Save All Questions
            </button>
          </div>
        </form>
      </div>
    </div></>
  );
}
