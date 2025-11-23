import React, { useState, useEffect } from "react";
import { getFromEndpoint } from "../../components/apiService";

export default function QuizSummaryBySection() {
  const [quizSummary, setQuizSummary] = useState([]);
  const [subjects, setSubjects] = useState(["All Subjects"]);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFromEndpoint("fetch_quiz_summary.php")
      .then((res) => {
        if (res.data.status === "success") {
          setQuizSummary(res.data.data);

          const uniqueSubjects = [
            "All Subjects",
            ...new Set(res.data.data.map((q) => q.subject)),
          ];
          setSubjects(uniqueSubjects);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz summary:", error);
        setLoading(false);
      });
  }, []);

  const filteredQuiz =
    selectedSubject === "All Subjects"
      ? quizSummary
      : quizSummary.filter((q) => q.subject === selectedSubject);

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-700 text-lg">
        Loading quiz summary...
      </div>
    );
  }

  return (
  <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Quiz Summary
      </h1>
    <div className="px-6 py-10">
      <div className="max-w-4xl bg-white shadow-xl border border-gray-300 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          📊 Quiz Summary
        </h1>

        {/* SUBJECT FILTER */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold mr-3">Filter by Subject:</label>
          <select
            className="border rounded-lg px-3 py-2 shadow-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filteredQuiz.map((quiz, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-md"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Quiz {quiz.quiz_no}: {quiz.title}
              </h2>

              <p className="text-gray-600 mb-1">
                <strong>Subject:</strong> {quiz.subject}
              </p>

              <p className="text-gray-700 mb-3">
                <strong>Total Students Who Took This Quiz:</strong>{" "}
                {quiz.total_takers}
              </p>

              {/* SECTION TABLE */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Breakdown by Section:
                </h3>

                <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 text-left text-gray-700">
                      <th className="p-3 border-b border-gray-300">Section</th>
                      <th className="p-3 border-b border-gray-300">Takers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiz.sections.map((sec, i) => (
                      <tr key={i} className="border-b border-gray-300">
                        <td className="p-3">{sec.section_name}</td>
                        <td className="p-3">{sec.takers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* VIEW STUDENTS */}
              <div className="text-right mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={() =>
                    window.location.href = `/admin/quiz/summary/${quiz.quiz_id}`
                  }
                >
                  View Students →
                </button>
              </div>
            </div>
          ))}

          {filteredQuiz.length === 0 && (
            <p className="text-gray-600 text-center mt-4">
              No quizzes found for this subject.
            </p>
          )}
        </div>
      </div>
    </div>
  </>
  );
}
