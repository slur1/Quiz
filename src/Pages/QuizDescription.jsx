import { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom"
import { postToEndpoint } from "../components/apiService";
import Swal from "sweetalert2";

export default function QuizDescription() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    section: "",
  });
  const [Error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  

   try {
    const response = await postToEndpoint("check_student.php", formData);
    const data = response.data;
    if (response.data.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Hi ${formData.firstName} ${formData.lastName}, you may now start your quiz.`,
        confirmButtonColor: "#06b6d4",
        background: "#334155", 
        color: "#ffffff",
      });

      localStorage.setItem("quizUser", JSON.stringify(formData));
      setShowModal(false);
      navigate("/quizstart");
    }  else if (data.status === "error") {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-4xl font-bold mb-4">Quiz #1 — Computer System Servicing</h1>
        <p className="text-lg mb-8">
          Test your knowledge about computer hardware and system components!
        </p>

        <div className="flex gap-4">
        <Link to="/landingpage">
          <button
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg"
          >
            Back
          </button>
        </Link>
          <button
            onClick={() => setShowModal(true)} // 🔥 ito magbubukas ng modal
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>

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
                  <option value="1">8 - Matthias</option>
                  <option value="2">8 - Micah</option>
                  <option value="3">8 - Obadiah</option>
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
