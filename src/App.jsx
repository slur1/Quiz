import LandingPage from "./Pages/LandingPage"
import QuizDescription from "./Pages/QuizDescription"
import QuizPage from "./Pages/QuizPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Error from "./Pages/404"
import AddQuestion from "./admin/AddQuestion"
import PixelLoader from "./components/PixelLoader"

export default function App() {

  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path ="*" element ={<Error/>} />
        <Route path ="/landingpage" element ={<LandingPage/>} />
        <Route path ="/quiz/:randomCode/:quiz_id/:randomCode" element ={<QuizDescription/>} />
        <Route path ="/quizstart/:randomCode/:student_id/:quiz_id/:randomCode" element ={<QuizPage/>} />
        <Route path ="/addingquestions" element ={<AddQuestion/>} />
        <Route path ="/loader" element ={<PixelLoader/>} />
      </Routes>
    </BrowserRouter>

    </>
  )
}
