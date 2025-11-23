import React, { useState } from "react";

export default function AddSection() {
  const [activeTab, setActiveTab] = useState("section");
  const [sectionData, setSectionData] = useState({ name: "" });
  const [gradeData, setGradeData] = useState({ name: "" });
  const [sections, setSections] = useState([]);
  const [grades, setGrades] = useState([]);

  const handleSectionSubmit = (e) => {
    e.preventDefault();
    if (sectionData.name.trim() !== "") {
      setSections((prev) => [...prev, sectionData.name.trim()]);
      setSectionData({ name: "" });
    }
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (gradeData.name.trim() !== "") {
      setGrades((prev) => [...prev, gradeData.name.trim()]);
      setGradeData({ name: "" });
    }
  };

  return (
     <>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Grade & Section
      </h1>
    <div className="space-y-6">
      
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("section")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "section"
              ? "text-gray-900 border-gray-900"
              : "text-gray-500 border-transparent hover:text-gray-900"
          }`}
        >
          Add Section
        </button>

        <button
          onClick={() => setActiveTab("grade")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "grade"
              ? "ttext-gray-900 border-gray-900"
              : "text-gray-500 border-transparent hover:text-gray-900"
          }`}
        >
          Add Grade Level
        </button>
      </div>

     
      {activeTab === "section" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full max-w-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Section</h2>
          <form onSubmit={handleSectionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={sectionData.name}
                onChange={(e) => setSectionData({ name: e.target.value })}
                placeholder="e.g., Section A, Grade 10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gray-600 hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200"
            >
              Add Section
            </button>
          </form>

          {sections.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Added Sections
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
                  >
                    <p className="font-semibold text-gray-900">{section}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grade Level Tab */}
      {activeTab === "grade" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm w-full max-w-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Grade Level</h2>
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level Name
              </label>
              <input
                type="text"
                value={gradeData.name}
                onChange={(e) => setGradeData({ name: e.target.value })}
                placeholder="e.g., Grade 10, 10th Grade"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gray-600 hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200"
            >
              Add Grade Level
            </button>
          </form>

          {grades.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Added Grades
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
                  >
                    <p className="font-semibold text-gray-900">{grade}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </>
  );
}
