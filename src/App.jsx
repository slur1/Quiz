import LandingPage from "./Pages/LandingPage"
import QuizDescription from "./Pages/QuizDescription"
import QuizPage from "./Pages/QuizPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Error from "./Pages/404"
import AddQuestion from "./admin/AddQuestion"

export default function App() {

  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path ="*" element ={<Error/>} />
        <Route path ="/landingpage" element ={<LandingPage/>} />
        <Route path ="/quiz/:quiz_id" element ={<QuizDescription/>} />
        <Route path ="/quizstart/:quiz_id" element ={<QuizPage/>} />
        <Route path ="/addingquestions" element ={<AddQuestion/>} />
      </Routes>
    </BrowserRouter>

    </>
  )
}
