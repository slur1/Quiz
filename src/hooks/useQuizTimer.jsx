// src/hooks/useQuizTimer.js
import { useState, useRef, useCallback } from "react";

// onExpire: callback to execute when timer hits 0
export default function useQuizTimer({ onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimerFor = useCallback((initialSeconds) => {
    stopTimer();
    setTimeLeft(initialSeconds ?? 30);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          if (typeof onExpire === "function") onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onExpire, stopTimer]);

  return {
    timeLeft,
    setTimeLeft,
    startTimerFor,
    stopTimer,
  };
}
