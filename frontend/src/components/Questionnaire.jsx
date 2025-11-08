import React, { useState } from "react";

const questions = [
  "I have little interest or pleasure in doing things.",
  "I feel down, depressed, or hopeless.",
  "I have trouble falling or staying asleep, or sleep too much.",
  "I feel tired or have little energy.",
  "I have poor appetite or overeat.",
  "I feel bad about myself — or that I’m a failure.",
  "I have trouble concentrating on things.",
  "I move or speak so slowly that other people could have noticed.",
];

export default function Questionnaire({ onSubmit }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = parseInt(value);
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const score = answers.reduce((a, b) => a + b, 0);
    const level =
      score < 5
        ? "Minimal depression"
        : score < 10
        ? "Mild depression"
        : score < 15
        ? "Moderate depression"
        : "Severe depression";
    onSubmit({ score, level });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl w-full sm:w-96 animate-slide-up"
    >
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="text-gray-800 font-medium mb-2">{q}</p>
          <select
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full p-2 rounded-md border border-gray-300"
            required
          >
            <option value="0">Not at all (0)</option>
            <option value="1">Several days (1)</option>
            <option value="2">More than half the days (2)</option>
            <option value="3">Nearly every day (3)</option>
          </select>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-transform hover:scale-105"
      >
        Submit
      </button>
    </form>
  );
}
