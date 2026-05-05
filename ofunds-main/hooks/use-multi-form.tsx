"use client";

import type React from "react";

import { useState } from "react";

type Step = React.ReactNode;

const useMultiForm = (steps: Step[]) => {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);

  function next() {
    setCurrentStateIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStateIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStateIndex(index);
  }

  return {
    currentStateIndex,
    step: steps[currentStateIndex],
    steps,
    isFirstStep: currentStateIndex === 0,
    isLastStep: currentStateIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
};

export default useMultiForm;
