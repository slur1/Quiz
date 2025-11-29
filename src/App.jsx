import LandingPage from "./Pages/LandingPage";
import QuizDescription from "./Pages/QuizDescription";
import QuizPage from "./Pages/QuizPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Error from "./Pages/404";
import AddQuestion from "./admin/AddQuestion";
import PixelLoader from "./components/PixelLoader";
import LoginPage from "./admin/LoginPage";
import Dashboard from "./admin/Dashboard";
import ThankYou from "./components/ThankYouPage";
import QuizStudentList from "./admin/components/QuizStudentList";
import QuizResult from "./admin/components/QuizStudentResult";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/quiz/:randomCode/:quiz_id/:randomCode" element={<QuizDescription />} />
        <Route path="/quizstart/:randomCode/:student_id/:quiz_id/:randomCode" element={<QuizPage />} />
        <Route path="/addingquestions" element={<AddQuestion />} />
        <Route path="/loader" element={<PixelLoader />} />
        <Route path="/thankyou" element={<ThankYou />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<LoginPage onLogin={(u, p) => console.log(u, p)} />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/admin/quiz/summary/:quiz_id" element={<QuizStudentList />} />
        <Route path="/admin/quiz/answers/:quiz_id/:student_id" element={<QuizResult />} />
        <Route path="/admin/main" element={<Navigate to="/dashboard/overview" />} />

        {/* Fallback */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
