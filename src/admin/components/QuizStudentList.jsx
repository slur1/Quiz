import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { getFromEndpoint } from "../../components/apiService";
import { useParams } from "react-router-dom";

export default function QuizStudentList() {
  const { quiz_id } = useParams(); 
  const [students, setStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await getFromEndpoint(`getQuizStudents.php?quiz_id=${quiz_id}`);
        setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [quiz_id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getFromEndpoint(`fetch_subject_quiz.php?quiz_id=${quiz_id}`); 
        if (res.data.status === "success") setSubjects(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [quiz_id]);

  const sections = useMemo(() => {
    const uniqueSections = Array.from(new Set(students.map(s => s.section_name)));
    return ["All Sections", ...uniqueSections];
  }, [students]);

  const filteredStudents =
    selectedSection === "All Sections"
      ? students
      : students.filter((s) => s.section_name === selectedSection);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    alert("Logged out!");
    localStorage.removeItem("activeTab");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      <Sidebar onLogout={handleLogout} />
      <div className="px-6 py-10 w-[90%]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Quiz Score Summary
        </h1>

        <div className="max-w-4xl bg-white shadow-xl border border-gray-300 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {subjects[0]?.subject_name} 
          </h1>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 mt-2">
            <strong>Quiz {subjects[0]?.quiz_no}:</strong> {subjects[0]?.title} 
          </h1>
          <p className="text-gray mb-4 text-[20px] mt-3">
            🧑‍🎓 Students Who Took This Quiz
          </p>
          <div className="mb-4 flex items-center gap-3">
            <label className="text-gray-700 font-semibold">Filter by Section:</label>
            <select
              className="border rounded-lg px-3 py-2 shadow-sm"
              value={selectedSection}
              onChange={(e) => { setSelectedSection(e.target.value); setCurrentPage(1); }}
            >
              {sections.map((sec, index) => (
                <option key={index} value={sec}>{sec}</option>
              ))}
            </select>

            <label className="text-gray-700 font-semibold ml-4">Rows per page:</label>
            <select
              className="border rounded-lg px-3 py-2 shadow-sm"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-gray-600 text-center">Loading students...</p>
          ) : (
            <>
              <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden mb-4">
                <thead>
                  <tr className="bg-gray-200 text-left text-gray-700">
                    <th className="p-3 border-b border-gray-300">Student Name</th>
                    <th className="p-3 border-b border-gray-300">Section</th>
                    <th className="p-3 border-b border-gray-300">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((stud, i) => (
                    <tr key={i} className="border-b border-gray-300">
                      <td className="p-3">{stud.firstname} {stud.lastname}</td>
                      <td className="p-3">{stud.section_name}</td>
                      <td className="p-3">{stud.total_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {paginatedStudents.length === 0 && (
                <p className="text-center text-gray-600">No students found.</p>
              )}

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-800 font-semibold">
                  Total Students: {filteredStudents.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
