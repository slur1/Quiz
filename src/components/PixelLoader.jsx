import React, { useEffect, useRef } from "react";
import "../css/PixelLoader.css"; 
import Pixel from "../assets/pixel1.png"

const PixelLoader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const particleCount = 100;
    const colors = ["#00ffff", "#be4fff", "#ffffff"];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    };
    initParticles();

    const animateParticles = () => {
      ctx.fillStyle = "rgba(16, 1, 28, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }

      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    window.addEventListener("resize", () => {
      setCanvasSize();
      initParticles();
    });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="pixel-loader">
      <canvas ref={canvasRef} id="particle-canvas" />
      <div className="loader-container">
        <div className="image-container">
          <img
            src={Pixel}
            alt="Pixel AI Icon"
            className="pixel-icon"
            onError={(e) => {
              e.target.style.display = "none";
              document.getElementById("fallback-icon").style.display = "flex";
            }}
          />
          <div
            id="fallback-icon"
            style={{
              display: "none",
              width: "200px",
              height: "200px",
              background: "#2a0a4a",
              border: "2px solid #00ffff",
              color: "#fff",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "10px",
              borderRadius: "50%",
            }}
          >
            Image not found
          </div>
          <div className="scan-line"></div>
        </div>
        <div className="loader-text">Initializing Pixel...</div>
      </div>
    </div>
  );
};

export default PixelLoader;
