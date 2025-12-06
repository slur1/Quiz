import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { getFromEndpoint } from "../../components/apiService";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizStudentList() {
  const { quiz_id } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState("newest");

  // Restore saved values
  useEffect(() => {
    const savedFilter = localStorage.getItem("quiz_section_filter");
    const savedPage = localStorage.getItem("quiz_page");
    const savedRows = localStorage.getItem("quiz_rows");
    const savedSort = localStorage.getItem("quiz_sort");

    if (savedFilter) setSelectedSection(savedFilter);
    if (savedPage) setCurrentPage(Number(savedPage));
    if (savedRows) setItemsPerPage(Number(savedRows));
    if (savedSort) setSortOption(savedSort);
  }, []);

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
    const uniqueSections = Array.from(new Set(students.map((s) => s.section_name)));
    return ["All Sections", ...uniqueSections];
  }, [students]);

  const filteredStudents =
    selectedSection === "All Sections"
      ? students
      : students.filter((s) => s.section_name === selectedSection);

  // SORTING LOGIC
  const sortedStudents = useMemo(() => {
    const data = [...filteredStudents];

    if (sortOption === "newest") {
      return data.sort((a, b) => new Date(b.date_submitted) - new Date(a.date_submitted));
    }
    if (sortOption === "oldest") {
      return data.sort((a, b) => new Date(a.date_submitted) - new Date(b.date_submitted));
    }
    if (sortOption === "highscore") {
      return data.sort((a, b) => b.total_score - a.total_score);
    }
    if (sortOption === "lowscore") {
      return data.sort((a, b) => a.total_score - b.total_score);
    }

    return data;
  }, [filteredStudents, sortOption]);

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const paginatedStudents = sortedStudents.slice(
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
          <h1 className="text-2xl font-bold text-gray-900">
            {subjects[0]?.subject_name}
          </h1>
          <h1 className="text-xl font-bold text-gray-900 mt-2">
            <strong>Quiz {subjects[0]?.quiz_no}:</strong> {subjects[0]?.title}
          </h1>

          <div className="mt-4 mb-4 flex flex-wrap gap-4 items-center">

            {/* Section Filter */}
            <label className="font-semibold">Filter by Section:</label>
            <select
              className="border rounded-lg px-3 py-2 shadow-sm"
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                localStorage.setItem("quiz_section_filter", e.target.value);
                setCurrentPage(1);
                localStorage.setItem("quiz_page", "1");
              }}
            >
              {sections.map((sec, i) => (
                <option key={i} value={sec}>
                  {sec}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <label className="font-semibold ml-4">Sort:</label>
            <select
              className="border rounded-lg px-3 py-2 shadow-sm"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                localStorage.setItem("quiz_sort", e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highscore">Highest Score</option>
              <option value="lowscore">Lowest Score</option>
            </select>

            {/* Rows per page */}
            <label className="font-semibold ml-4">Rows per page:</label>
            <select
              className="border rounded-lg px-3 py-2 shadow-sm"
              value={itemsPerPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setItemsPerPage(val);
                localStorage.setItem("quiz_rows", val);
                setCurrentPage(1);
                localStorage.setItem("quiz_page", "1");
              }}
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading students...</p>
          ) : (
            <>
              <table className="w-full border border-gray-300 bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">No.</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((stud, i) => (
                    <tr
                      key={i}
                      onClick={() =>
                        navigate(`/admin/quiz/answers/${quiz_id}/${stud.student_id}`)
                      }
                      className="border-b hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="p-3">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>
                      <td className="p-3">
                        {stud.lastname}, {stud.firstname}
                      </td>
                      <td className="p-3">{stud.section_name}</td>
                      <td className="p-3">{stud.total_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <span>Total Students: {sortedStudents.length}</span>

                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded"
                    disabled={currentPage === 1}
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      localStorage.setItem("quiz_page", newPage);
                    }}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {totalPages || 1}
                  </span>

                  <button
                    className="px-3 py-1 border rounded"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      localStorage.setItem("quiz_page", newPage);
                    }}
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
