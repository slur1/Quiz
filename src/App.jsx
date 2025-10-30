import LandingPage from "./Pages/LandingPage"
import QuizDescription from "./Pages/QuizDescription"
import QuizPage from "./Pages/QuizPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Error from "./Pages/404"

export default function App() {

  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path ="*" element ={<Error/>} />
        <Route path ="/landingpage" element ={<LandingPage/>} />
        <Route path ="/quiz" element ={<QuizDescription/>} />
        <Route path ="/quizstart" element ={<QuizPage/>} />
      </Routes>
    </BrowserRouter>

    </>
  )
}
