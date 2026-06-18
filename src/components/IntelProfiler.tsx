import { useState } from "react";
import { Award, Sparkles, RefreshCw, BarChart2, ShieldCheck, Play, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { DynamicQuiz, BenchmarkScore } from "../types";

const THEME_VECTORS = [
  { name: "Verbal Deductive Analysis", code: "Verbal Logic paradoxes and semantic mappings" },
  { name: "Synthetic Pattern Induction", code: "Non-verbal grid reasoning and structural formulas" },
  { name: "Cryptographic Mechanics", code: "Cipher keys, binary logic, and code sequences" },
  { name: "Quantum Causality Matrix", code: "Theoretical physics, entropy loops, and probability matrices" }
];

export default function IntelProfiler() {
  const [selectedTheme, setSelectedTheme] = useState(THEME_VECTORS[0].name);
  const [customTheme, setCustomTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<DynamicQuiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);

  // Overall database metrics of completed tests
  const [scoreHistory, setScoreHistory] = useState<BenchmarkScore[]>([
    { category: "Verbal Deduction", userScore: 75, aiScore: 90, maxScore: 100 },
    { category: "Synthetic Pattern", userScore: 50, aiScore: 95, maxScore: 100 },
    { category: "Cryptographics", userScore: 100, aiScore: 85, maxScore: 100 },
    { category: "Quantum Paradox", userScore: 25, aiScore: 98, maxScore: 100 }
  ]);

  const handleStartBenchmark = async () => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
    setExplanationVisible(false);

    const activeTheme = customTheme.trim() || selectedTheme;

    try {
      const response = await fetch("/api/benchmark/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: activeTheme })
      });

      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No intelligence questions compiled by the assessment model.");
      }
      setQuiz(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Cognitive Assessment server failed to initialize.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (explanationVisible) return; // locked once checked

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIdx] = optionIdx;
    setSelectedAnswers(newAnswers);
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswers[currentQuestionIdx] === undefined) return;
    setExplanationVisible(true);
  };

  const handleNextQuestion = () => {
    setExplanationVisible(false);
    if (!quiz) return;

    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Calculate Final Scores
      let correctAttempts = 0;
      quiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correctAttempts++;
        }
      });

      const finalUserScorePercent = Math.round((correctAttempts / quiz.questions.length) * 100);
      const generatedAiBaseline = Math.floor(Math.random() * 20) + 80; // Standard 80-100%

      // Append score card to overall tracking
      const newScore: BenchmarkScore = {
        category: quiz.category.substring(0, 18) + (quiz.category.length > 18 ? "..." : ""),
        userScore: finalUserScorePercent,
        aiScore: generatedAiBaseline,
        maxScore: 100
      };

      setScoreHistory(prev => {
        // Keep unique categorized metrics
        const listWithoutEx = prev.filter(p => p.category !== newScore.category);
        return [newScore, ...listWithoutEx].slice(0, 5);
      });

      setQuizFinished(true);
    }
  };

  const chartData = scoreHistory.map((h) => ({
    subject: h.category,
    "You (IQ)": h.userScore,
    "Gemini (AI)": h.aiScore,
  }));

  return (
    <div id="intel-profiler-container" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-400" />
            Intelligence Benchmark Profiler
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Dynamic, on-demand specialized mental aptitude verification. Generate customizable testing arrays dynamically.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-indigo-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-indigo-500 animate-pulse" />
          Secure Assessment Integrity
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Setup & Vector selections */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-800/80 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              Configure Target Mind Vector
            </h3>

            <div className="space-y-1.5">
              {THEME_VECTORS.map((vec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTheme(vec.name);
                    setCustomTheme("");
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedTheme === vec.name && !customTheme
                      ? "border-indigo-500/50 bg-indigo-950/25 text-white font-medium"
                      : "border-gray-800/80 bg-gray-950/20 text-gray-400 hover:border-gray-700/50 hover:bg-gray-900/25"
                  }`}
                >
                  <p className="font-semibold">{vec.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{vec.code}</p>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-800/80 pt-3">
              <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase">
                Or Define Custom Vector Category
              </label>
              <input
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                placeholder="e.g. Medieval Battle tactics / Chess endgame reasoning"
                className="w-full bg-gray-950 text-gray-200 placeholder-gray-700 border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              id="generate-benchmark-btn"
              onClick={handleStartBenchmark}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-550 text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer text-xs"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  Generating Brain Metrics...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-white" />
                  Initiate Dynamic Metric Array
                </>
              )}
            </button>
          </div>

          {/* Historical Radar Index */}
          <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-800/80 backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Cognitive Aptitude Plot
            </h3>
            <div className="h-44 w-full">
              {scoreHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 8 }} />
                    <Radar name="You" dataKey="You (IQ)" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} />
                    <Radar name="Model Grid" dataKey="Gemini (AI)" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
                  Awaiting profile metrics...
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest mt-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-sky-400 inline-block" />
                <span className="text-gray-400">User Curve</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-indigo-400 inline-block" />
                <span className="text-gray-400">Standard AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Console / Active metrics */}
        <div className="lg:col-span-7">
          <div className="bg-gray-900/20 rounded-xl border border-gray-800/80 h-full min-h-[460px] flex flex-col overflow-hidden">
            {/* Header / Meta */}
            <div className="bg-gray-900/50 px-5 py-3.5 border-b border-gray-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Testing Terminal Console
              </span>
              {quiz && !quizFinished && (
                <span className="text-xs font-mono text-indigo-400">
                  Item {currentQuestionIdx + 1} of {quiz.questions.length}
                </span>
              )}
            </div>

            {/* Main Console Arena */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
              {isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce absolute top-3.5 left-3.5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-indigo-200">Compiling Evaluation Matrix</p>
                    <p className="text-xs text-gray-500 font-mono animate-pulse">Running synthetic scenario configurations...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-red-300">Terminal Initialization Fail</h4>
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && !quiz && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                  <Award className="w-12 h-12 text-gray-700 stroke-1" />
                  <div className="max-w-sm space-y-1">
                    <p className="text-sm text-gray-400 font-medium font-display">Awaiting Initialization</p>
                    <p className="text-xs text-gray-600">
                      Choose an intelligence sector or customize a niche problem scenario, and ignite the metric generation core.
                    </p>
                  </div>
                </div>
              )}

              {/* Active Quiz Card */}
              {quiz && !quizFinished && (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider bg-indigo-900/20 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">
                        {quiz.category}
                      </span>
                      <h4 id={`question-title-${currentQuestionIdx}`} className="text-sm font-semibold text-white leading-relaxed pt-2">
                        {quiz.questions[currentQuestionIdx].question}
                      </h4>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2">
                      {quiz.questions[currentQuestionIdx].options.map((option, oIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIdx] === oIdx;
                        const isCorrectAnswer = quiz.questions[currentQuestionIdx].correctIndex === oIdx;
                        let optStyle = "border-gray-800 bg-gray-950/30 hover:border-indigo-500/40 text-gray-300";

                        if (isSelected && !explanationVisible) {
                          optStyle = "border-indigo-500 bg-indigo-950/20 text-white font-medium";
                        } else if (explanationVisible) {
                          if (isCorrectAnswer) {
                            optStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-300 font-semibold";
                          } else if (isSelected) {
                            optStyle = "border-red-500 bg-red-950/25 text-red-300";
                          } else {
                            optStyle = "border-gray-900 bg-gray-950/10 text-gray-600 cursor-not-allowed";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            id={`option-btn-${oIdx}`}
                            onClick={() => handleSelectAnswer(oIdx)}
                            disabled={explanationVisible}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${optStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-[10px] font-mono text-gray-500">OP {oIdx + 1}</span>
                              <span className="flex-1">{option}</span>
                              {explanationVisible && isCorrectAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {explanationVisible && isSelected && !isCorrectAnswer && (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions & Explanation section */}
                  <div className="pt-4 border-t border-gray-950 space-y-3">
                    {explanationVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-950/80 p-3.5 rounded-lg border border-gray-800/50"
                      >
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 mb-1">
                          Pedagogical Analysis Proof
                        </h5>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {quiz.questions[currentQuestionIdx].explanation}
                        </p>
                      </motion.div>
                    )}

                    <div className="flex justify-end gap-2.5">
                      {!explanationVisible ? (
                        <button
                          onClick={handleVerifyAnswer}
                          disabled={selectedAnswers[currentQuestionIdx] === undefined}
                          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-500 text-gray-950 font-semibold text-xs cursor-pointer disabled:cursor-not-allowed"
                        >
                          Verify Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-gray-950 font-semibold text-xs cursor-pointer flex items-center gap-1"
                        >
                          {currentQuestionIdx < quiz.questions.length - 1 ? (
                            <>
                              Next Core Vector
                              <ArrowRight className="w-3 h-3" />
                            </>
                          ) : (
                            "Consolidate Scores Matrix"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Finished Summary Overview */}
              {quizFinished && quiz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center py-6"
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                    <Award className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                      Task Array Completed
                    </p>
                    <h4 className="text-xl font-display font-semibold text-white">
                      Diagnostic Metrics Synchronized
                    </h4>
                    <p className="text-xs text-gray-400 font-sans mt-2">
                      Your cognitive profile curves have been updated dynamically on your local Aptitude Curve chart located in the secondary visual deck.
                    </p>
                  </div>

                  {/* Summary Metric Score board */}
                  <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-gray-950/40 p-4 rounded-xl border border-gray-900">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 font-mono">YOUR VECTOR SCORE</p>
                      <p className="text-2xl font-bold font-mono text-sky-400 mt-1">
                        {Math.round(
                          (quiz.questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length /
                            quiz.questions.length) *
                            100
                        )}
                        %
                      </p>
                    </div>
                    <div className="text-center border-l border-gray-900">
                      <p className="text-xs text-gray-500 font-mono">AI CONVERGENCE</p>
                      <p className="text-2xl font-bold font-mono text-indigo-400 mt-1">92%</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartBenchmark}
                    className="px-6 py-2.5 rounded-lg border border-gray-800 hover:border-indigo-500/40 text-xs text-indigo-300 bg-gray-950/20 hover:bg-indigo-950/10 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate and Retest theme
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
