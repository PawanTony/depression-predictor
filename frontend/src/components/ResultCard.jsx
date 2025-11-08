import React from "react";

export default function ResultCard({ result, onReset }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl text-center animate-fade-in">
      <h2 className="text-2xl font-semibold mb-2 text-blue-600">Your Result</h2>
      <p className="text-lg text-gray-700 mb-4">
        Depression Level: <b>{result.level}</b>
      </p>
      <p className="text-gray-500 mb-6">Total Score: {result.score}</p>
      <button
        onClick={onReset}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-transform hover:scale-105"
      >
        Retake Test
      </button>
    </div>
  );
}
