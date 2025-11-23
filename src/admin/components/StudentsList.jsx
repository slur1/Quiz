import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { getFromEndpoint, postToEndpoint } from "../../components/apiService";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    section: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getFromEndpoint("get_students.php");
      if (res.data.status === "success") {
        setStudents(res.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email && formData.gender && formData.section) {
      try {
        const res = await postToEndpoint("add_student.php", formData);
        if (res.data.status === "success") {
          fetchStudents();
          setFormData({ firstName: "", lastName: "", email: "", gender: "", section: "" });
          setShowForm(false);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await postToEndpoint("delete_student.php", { id });
      if (res.data.status === "success") fetchStudents();
      else alert("Failed to delete student");
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(students.length / rowsPerPage);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset to first page
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
   <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        List of Students
      </h1>
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          + Add Student
        </button>
      )}

      {showForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Add New Student</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g., Section A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Add Student
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Students List ({students.length})
            </h3>

            <div className="flex items-center gap-2">
              <label>Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded-lg px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-4">No.</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Gender</th>
                  <th className="text-left py-3 px-4">Section</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                     <td className="py-3 px-4 text-gray-700">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {student.lastname}, {student.firstname}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                    <td className="py-3 px-4 text-gray-700">{student.gender}</td>
                    <td className="py-3 px-4 text-gray-700">{student.section_name || student.section}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!showForm && students.length === 0 && (
        <div className="bg-white border border-gray-300 rounded-lg p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-4">No students added yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Add Your First Student
          </button>
        </div>
      )}
    </div>
  </>
  );
}
