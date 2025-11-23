import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardOverview from "./components/DashboardOverview";
import AddQuiz from "./components/AddQuiz";
import AddSection from "./components/AddSection";
import AddSubjects from "./components/AddSubjects";
import StudentsList from "./components/StudentsList";
import AddQuestion from "./AddQuestion";
import QuizSummaryBySection from "./components/QuizSummary";
import QuizStudentList from "./components/QuizStudentList";
import Error from "../Pages/404";
import Ongoing from "./components/OnGoing";

export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("Logged out!");
    navigate("/admin"); 
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="*" element={<Ongoing />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="question" element={<AddQuestion />} />
          <Route path="all" element={<AddQuestion />} />
          <Route path="summary" element={<QuizSummaryBySection />} />
          <Route path="quiz" element={<AddQuiz />} />
          <Route path="section" element={<AddSection />} />
          <Route path="subjects" element={<AddSubjects />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="quizlist" element={<QuizStudentList />} />
        </Routes>
      </main>
    </div>
  );
}
