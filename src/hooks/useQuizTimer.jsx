// src/hooks/useQuizTimer.js
import { useState, useRef, useCallback, useEffect } from "react";

export default function useQuizTimer({ onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  // ✅ keep onExpire ref updated to avoid stale closure
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimerFor = useCallback((initialSeconds) => {
    stopTimer(); // ✅ ensure no overlapping timers
    setTimeLeft(initialSeconds ?? 30);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
            if (prev <= 1) {
            stopTimer();
            if (typeof onExpireRef.current === "function") {
                onExpireRef.current();
            }
            return 0;
            }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  return {
    timeLeft,
    setTimeLeft,
    startTimerFor,
    stopTimer,
  };
}
