"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(5);

  const generateQuiz = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, questionCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setQuestions(data.questions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!showResults) {
      setUserAnswers((prev) => ({
        ...prev,
        [questionIndex]: answer,
      }));
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setQuestions([]);
    setUserAnswers({});
    setShowResults(false);
    setContent("");
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Quiz Generator
          </h1>
          <p className="text-neutral-500">
            Paste your notes. Get quizzed by AI.
          </p>
        </header>

        {/* Input Section */}
        {questions.length === 0 && (
          <div className="space-y-6">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material here..."
                className="w-full h-48 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 text-base leading-relaxed resize-none outline-none focus:border-neutral-700 transition-colors"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-neutral-600">
                  {content.length} characters
                  {content.length > 0 && content.length < 50 && (
                    <span className="text-amber-500 ml-2">• min 50</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">Questions:</span>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm cursor-pointer outline-none focus:border-neutral-700"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={generateQuiz}
              disabled={loading || content.length < 50}
              className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>

            {error && (
              <div className="p-4 bg-red-950 border border-red-900 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Quiz Section */}
        {questions.length > 0 && (
          <div className="space-y-8">
            
            {/* Score Banner */}
            {showResults && (
              <div className="text-center py-8 border-b border-neutral-800">
                <div className="text-5xl font-semibold mb-2">
                  {calculateScore()}/{questions.length}
                </div>
                <p className="text-neutral-500">
                  {calculateScore() === questions.length
                    ? "Perfect score!"
                    : calculateScore() >= questions.length / 2
                    ? "Good job!"
                    : "Keep studying!"}
                </p>
              </div>
            )}

            {/* Questions */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-4">
                <h3 className="text-lg font-medium leading-relaxed">
                  <span className="text-neutral-600 mr-2">{qIndex + 1}.</span>
                  {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((option, oIndex) => {
                    const letter = option.charAt(0);
                    const isSelected = userAnswers[qIndex] === letter;
                    const isCorrect = q.correctAnswer === letter;

                    let buttonClass = "w-full text-left px-4 py-3 rounded-lg border transition-colors ";

                    if (showResults) {
                      if (isCorrect) {
                        buttonClass += "bg-green-950 border-green-800 text-green-400";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "bg-red-950 border-red-800 text-red-400";
                      } else {
                        buttonClass += "bg-neutral-900 border-neutral-800 text-neutral-600";
                      }
                    } else {
                      buttonClass += isSelected
                        ? "bg-neutral-800 border-neutral-700 text-white"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white";
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(qIndex, letter)}
                        disabled={showResults}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResults && (
                  <div className="px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <p className="text-sm text-neutral-400">
                      <span className="text-neutral-500 font-medium">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-neutral-800">
              {!showResults ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(userAnswers).length !== questions.length}
                  className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors"
                >
                  Submit ({Object.keys(userAnswers).length}/{questions.length})
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  New Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
