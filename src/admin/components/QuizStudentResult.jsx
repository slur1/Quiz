import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFromEndpoint } from "../../components/apiService";
import Sidebar from "./Sidebar";

export default function QuizResult() {
  const { quiz_id, student_id } = useParams();
  const navigate = useNavigate(); // <-- add navigate hook
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await getFromEndpoint(
          `getStudentQuizResult.php?quiz_id=${quiz_id}&student_id=${student_id}`
        );
        setResult(res.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quiz_id, student_id]);

  if (loading) return <p>Loading...</p>;
  if (!result) return <p>No result found.</p>;

  const handleLogout = () => {
    alert("Logged out!");
    localStorage.removeItem("activeTab");
  };

  // Correctness check
  const checkCorrect = (answer) => {
    if (!answer.user_answer || !answer.correct_answer) return false;

    switch (answer.type) {
      case "multiple-choice":
        return answer.user_answer === answer.correct_answer;

      case "identification":
        return answer.user_answer.trim().toLowerCase() ===
               answer.correct_answer.trim().toLowerCase();

      case "enumeration": {
        const normalize = (str) =>
          str
            .split(/[\n,]+/)
            .map((x) => x.trim().toLowerCase())
            .filter(Boolean)
            .sort();

        const userArrEnum = normalize(answer.user_answer);
        const correctArrEnum = normalize(answer.correct_answer);

        return (
          userArrEnum.length === correctArrEnum.length &&
          userArrEnum.every((item, idx) => item === correctArrEnum[idx])
        );
      }

      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar onLogout={handleLogout} />
      <div className="px-6 py-10 w-[60%] space-y-6">
        {/* Student Info */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Result</h1>
                <p className="text-gray-700 text-2xl">
                    <strong>Student:</strong> {result.firstname} {result.lastname}
                </p>
                <p className="text-gray-700 text-2xl">
                    <strong>Section:</strong> {result.section_name}
                </p>
                <p className="text-gray-700 text-2xl">
                    <strong>Score:</strong> {result.total_score}
                </p>
            </div>
            <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition h-[10%]"
            >
            ← Back
            </button>
        </div>

        {/* Answers */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Answers</h2>
          <div className="space-y-4">
            {result.answers?.length > 0 ? (
              result.answers.map((a, i) => {
                const isCorrect = checkCorrect(a);
                return (
                  <div
                    key={i}
                    className={`p-4 border rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-400"
                    }`}
                  >
                    <p className="font-semibold text-gray-800 mb-1">
                      Q{i + 1}: {a.question}{" "}
                      <span className="text-sm text-gray-500">({a.type})</span>
                    </p>
                    <p>
                      <span className="font-medium text-blue-600">Student Answer:</span>{" "}
                      {a.user_answer || "-"}
                    </p>
                    <p>
                      <span className="font-medium text-green-600">Correct Answer:</span>{" "}
                      {a.correct_answer}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">No answers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
