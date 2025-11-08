import "./styles/animations.css";
import React, { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6 animate-fade-in">
        🧠 Depression Prediction Test
      </h1>

      {!result ? (
        <Questionnaire onSubmit={setResult} />
      ) : (
        <ResultCard result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
}
