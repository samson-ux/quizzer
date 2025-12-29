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

  const getScoreMessage = () => {
    const score = calculateScore();
    const total = questions.length;
    const percentage = (score / total) * 100;

    if (percentage === 100) return { emoji: "🎉", text: "Perfect score! You're a star!" };
    if (percentage >= 80) return { emoji: "🌟", text: "Excellent work! Almost there!" };
    if (percentage >= 60) return { emoji: "👍", text: "Good job! Keep practicing!" };
    if (percentage >= 40) return { emoji: "📚", text: "Keep studying, you'll get there!" };
    return { emoji: "💪", text: "Don't give up! Review and try again!" };
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              🧠
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              AI Quiz Generator
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-md mx-auto">
            Transform your study notes into interactive quizzes powered by Claude AI
          </p>
        </div>

        {/* Input Section */}
        {questions.length === 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <label className="block text-lg font-semibold text-slate-200 mb-3">
              📝 Paste your study material
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your notes, textbook excerpts, lecture content, or any material you want to be quizzed on..."
              className="w-full h-64 p-5 bg-slate-900/60 border-2 border-indigo-500/20 rounded-2xl text-slate-200 text-base leading-relaxed resize-none outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-slate-500"
            />

            {/* Options Row */}
            <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  {content.length} characters
                  {content.length > 0 && content.length < 50 && (
                    <span className="text-amber-400 ml-2">(need at least 50)</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Questions:</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="px-3 py-2 bg-slate-900/60 border border-indigo-500/30 rounded-lg text-slate-200 text-sm cursor-pointer outline-none focus:border-indigo-500/50"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={generateQuiz}
                disabled={loading || content.length < 50}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all disabled:from-slate-600 disabled:to-slate-600 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>✨ Generate Quiz</>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Quiz Section */}
        {questions.length > 0 && (
          <div className="space-y-6">
            {/* Score Banner */}
            {showResults && (
              <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl shadow-indigo-500/30 animate-pulse-slow">
                <div className="text-5xl mb-2">{getScoreMessage().emoji}</div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {calculateScore()} / {questions.length}
                </h2>
                <p className="text-lg text-white/90">{getScoreMessage().text}</p>
              </div>
            )}

            {/* Questions */}
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-7 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-slate-100 mb-5 flex gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg text-sm font-bold flex-shrink-0">
                    {qIndex + 1}
                  </span>
                  <span>{q.question}</span>
                </h3>

                <div className="space-y-3">
                  {q.options.map((option, oIndex) => {
                    const letter = option.charAt(0);
                    const isSelected = userAnswers[qIndex] === letter;
                    const isCorrect = q.correctAnswer === letter;

                    let buttonClass =
                      "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ";

                    if (showResults) {
                      if (isCorrect) {
                        buttonClass +=
                          "bg-green-500/15 border-green-500/50 text-green-300";
                      } else if (isSelected && !isCorrect) {
                        buttonClass +=
                          "bg-red-500/15 border-red-500/50 text-red-300";
                      } else {
                        buttonClass +=
                          "bg-slate-900/40 border-slate-700/50 text-slate-500";
                      }
                    } else {
                      buttonClass += isSelected
                        ? "bg-indigo-500/20 border-indigo-500/60 text-indigo-200"
                        : "bg-slate-900/40 border-indigo-500/20 text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/10";
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswerSelect(qIndex, letter)}
                        disabled={showResults}
                        className={buttonClass}
                      >
                        {showResults && isCorrect && <span>✓</span>}
                        {showResults && isSelected && !isCorrect && <span>✗</span>}
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResults && (
                  <div className="mt-5 p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💡</span>
                      <span className="font-semibold text-amber-400">Explanation</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              {!showResults ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(userAnswers).length !== questions.length}
                  className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all disabled:from-slate-600 disabled:to-slate-600 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  ✓ Submit Answers ({Object.keys(userAnswers).length}/{questions.length})
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
                >
                  🔄 Start New Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-slate-500 text-sm">
          Built with ❤️ using React & Claude AI
        </footer>
      </div>
    </main>
  );
}
