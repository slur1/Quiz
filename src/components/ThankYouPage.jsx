import { useEffect } from "react";
import Footer from "../components/Footer";
import LogoIcon from "../components/LogoIcon";
import LogoCSS from "../assets/CSS2.png";

export default function ThankYou() {

useEffect(() => {
  window.history.pushState(null, "", window.location.href);

  const handlePopState = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);


  return (
    <>
      <LogoIcon />

      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-900 text-white px-4 text-center">
        <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-10 max-w-lg w-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-cyan-800/40">
          <div className="flex flex-col items-center space-y-6">
            <div className="rounded-full overflow-hidden w-32 h-32 bg-slate-900/70 border-4 border-slate-700 shadow-lg animate-pulse">
              <img
                src={LogoCSS}
                alt="Pixel Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-cyan-400">Thank You!</h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Your quiz submission has been successfully recorded.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
