import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import AddQuiz from "./components/AddQuiz";
import AddSection from "./components/AddSection";
import AddSubjects from "./components/AddSubjects";
import StudentsList from "./components/StudentsList";




export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    alert("Logged out!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
     
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "overview" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
              Dashboard Overview
            </h1>
            <DashboardOverview />
          </>
        )}

        {activeTab === "quiz" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Quiz</h1>
            <AddQuiz />
          </>
        )}

        {activeTab === "section" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Section & Grade</h1>
            <AddSection />
          </div>
        )}

        {activeTab === "subjects" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Subjects</h1>
            <AddSubjects />
          </div>
        )}


        {activeTab === "students" && (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Students List</h1>
            <StudentsList />
          </div>
        )}


      </main>
    </div>
  );
}
