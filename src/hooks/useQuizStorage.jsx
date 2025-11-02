import { useCallback } from "react";

export default function useQuizStorage(quizId) {
  const key = `quizProgress_${quizId}`;

  const restoreState = useCallback(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("restoreState error:", err);
      return null;
    }
  }, [key]);

  const saveState = useCallback((payload = {}) => {
    try {
      const prev = JSON.parse(localStorage.getItem(key)) || {};
      const merged = { ...prev, ...payload };
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (err) {
      console.error("saveState error:", err);
    }
  }, [key]);

  const clearState = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error("clearState error:", err);
    }
  }, [key]);

  const ensureSavedQuestions = useCallback((questionsArray) => {
    try {
      const prev = JSON.parse(localStorage.getItem(key)) || {};
      if (!prev.savedQuestions) {
        const copy = JSON.parse(JSON.stringify(questionsArray));
        localStorage.setItem(key, JSON.stringify({ ...prev, savedQuestions: copy }));
      }
    } catch (err) {
      console.error("ensureSavedQuestions error:", err);
    }
  }, [key]);

  const getSavedQuestions = useCallback(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(key)) || {};
      return prev.savedQuestions ?? null;
    } catch (err) {
      console.error("getSavedQuestions error:", err);
      return null;
    }
  }, [key]);

  return {
    restoreState,
    saveState,
    clearState,
    ensureSavedQuestions,
    getSavedQuestions,
  };
}
