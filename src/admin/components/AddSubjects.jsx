import React, { useState } from "react";

export default function AddSubjects() {
  const [subjectName, setSubjectName] = useState("");
  const [subjects, setSubjects] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subjectName.trim() !== "") {
      setSubjects((prev) => [...prev, subjectName]);
      setSubjectName("");
    }
  };

  const handleDelete = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  return (
   <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add Subjects
      </h1>
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Mathematics, English, Science"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition"
          >
            Add Subject
          </button>
        </form>
      </div>

      {/* Subjects List */}
      {subjects.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Added Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium text-gray-800">{"Subject Name: " + subject}</p>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
  );
}
