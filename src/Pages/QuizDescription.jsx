import { useState, useEffect } from "react";
import "../App.css";
import { Link, useNavigate, useParams } from "react-router-dom"
import { postToEndpoint } from "../components/apiService";
import Swal from "sweetalert2";
import { getFromEndpoint } from "../components/apiService";
import Footer from "../components/Footer";
import LogoIcon from "../components/LogoIcon";
import LogoCSS from "../assets/CSS2.png"
import Cover from "../assets/pixel.png";
import PixelLoader from "../components/PixelLoader";

export default function QuizDescription() {
  const [showModal, setShowModal] = useState(false);
  const { quiz_id } = useParams(); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    section: "",
  });
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getFromEndpoint(`fetch_quiz.php?quiz_id=${quiz_id}`);
        if (res.data.status === "success") {
          setQuiz(res.data.data);
        } else {
          setError("Quiz not found.");
        }
      } catch (err) {
        setError("Failed to fetch quiz details.");
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 2000);  
      }
    };

    fetchQuiz();
  }, [quiz_id]);

const [subjects, setSubjects] = useState([]);
const [selectedSubject, setSelectedSubject] = useState("");
const [sections, setSections] = useState([]);

useEffect(() => {
  const fetchSubjects = async () => {
    try {
      const res = await getFromEndpoint("fetch_subjects.php"); 
      if (res.data.status === "success") {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchSubjects();
}, []);

useEffect(() => {
  if (!selectedSubject) return;
  const fetchSections = async () => {
    try {
      const res = await getFromEndpoint(`fetch_sections.php?subject_id=${selectedSubject.trim()}`);
      if (res.data.status === "success") {
        setSections(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchSections();
}, [selectedSubject]);

  const [Error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await postToEndpoint("check_student.php", formData);
    const data = response.data;

    if (data.status === "success") {
      const student_id = data.student_id;

      const checkAttempt = await postToEndpoint("check_quiz_attempt.php", {
        student_id,
        quiz_id,
      });

      if (checkAttempt.data.status === "already_taken") {
        await Swal.fire({
          icon: "warning",
          title: "Quiz Already Taken",
          text: "You have already completed this quiz.",
          confirmButtonColor: "#f59e0b",
          background: "#334155",
          color: "#ffffff",
        });
        setShowModal(false);
        return; 
      }

      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Hi ${formData.firstName} ${formData.lastName}, you may now start your quiz.`,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timerProgressBar: true,
        timer: 2500,
        background: "#334155",
        color: "#ffffff",
      });

      localStorage.setItem(
        "quizUser",
        JSON.stringify({ ...formData, student_id })
      );

      setShowModal(false);

      const randomCode = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      navigate(`/quizstart/${randomCode}/${student_id}/${quiz_id}/${randomCode}`);
    } else if (data.status === "error") {
      let alertTitle = "";
      let alertText = data.message;

      switch (data.field) {
        case "name":
          alertTitle = "Invalid Name";
          break;
        case "email":
          alertTitle = "Incorrect Email";
          break;
        case "section":
          alertTitle = "Incorrect Section";
          break;
        default:
          alertTitle = "Error";
      }

      Swal.fire({
        icon: "error",
        title: alertTitle,
        text: alertText,
        confirmButtonColor: "#ef4444",
        background: "#334155",
        color: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-xl border border-slate-700",
          confirmButton: "text-white font-semibold",
        },
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "There was a problem connecting to the server. Please try again later.",
      confirmButtonColor: "#ef4444",
    });
  }
};
  return (
    <>
      {/* Main UI */}
  {loading ? (<PixelLoader/>) : (  
  <>
      <LogoIcon/>
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 text-white px-4">
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-cyan-800/40">
            <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${Cover})` }}>
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full overflow-hidden w-[8rem] h-[8rem] bg-slate-900/70 border-4 border-slate-800 shadow-lg">
                  <img
                    src={LogoCSS}
                    alt="Pixel logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
            {/* 🔹 Card Content */}
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4 text-cyan-400">
                Quiz #{quiz?.quiz_no} - {quiz?.title}
              </h1>
              <p className="text-lg mb-8 text-slate-300 leading-relaxed">
                {quiz?.description}
              </p>

              <button
                onClick={() => setShowModal(true)} // 🔥 opens modal
                className="bg-cyan-600 hover:bg-cyan-700 active:scale-95 px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-200"
              >
                Start Quiz
              </button>
            </div>
          </div>
      </div>
      <Footer/>
  </>)}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 animate-in fade-in">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Start Quiz</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter last name"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">CES Email</label>
                <input
                  type="text"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all"
                  placeholder="Enter CES Email"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Subject</label>
                <select
                  required
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setFormData({ ...formData, section: "" });  
                  }}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all p-px"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Section</label>
                <select
                  required
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-all p-px"
                >
                  <option value="">Select a section</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Start Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
