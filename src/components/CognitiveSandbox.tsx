import React, { useState } from "react";
import { Brain, Sparkles, Send, RefreshCw, Cpu, Activity, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { CognitiveAnalysis, PuzzleSample } from "../types";

const PUZZLE_PRESETS: PuzzleSample[] = [
  {
    id: "knights",
    title: "The Veritas Island",
    category: "logic",
    prompt: "On Veritas Island, inhabitants are either Knights (who always tell the truth) or Knaves (who always lie). You meet three inhabitants: Al, Bob, and Cal. Al says: 'Bob is a Knave.' Bob says: 'Cal and I are of the same type.' Cal says: 'Al is a Knight.' Determine the identity of all three inhabitants with logical proof."
  },
  {
    id: "math-sequence",
    title: "The Fibonacci Primative",
    category: "math",
    prompt: "Let S be a sequence defined such that each term is the sum of the prime factors of the preceding terms. If S_1 = 2048, find S_5 and show the mathematical derivation step-by-step."
  },
  {
    id: "quantum-physics",
    title: "Entropic Paradox",
    category: "science",
    prompt: "If a closed system experiences decreasing local thermodynamic entropy but increases overall global entropy at an exponential rate of 3.14x per cycle, explain the heat dissipation paradox in relation to Landauer's principle."
  }
];

export default function CognitiveSandbox() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CognitiveAnalysis | null>(null);

  const handleSelectPreset = (preset: PuzzleSample) => {
    setPrompt(preset.prompt);
  };

  const handleInitiateScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/cognitive/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned code ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during cognitive processing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="cognitive-sandbox-container" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <p className="text-sm text-gray-400 mt-1">
            Feed any puzzle, logic paradox, or complex concept to inspect raw analytical thought structures.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-sky-400 font-mono">
          <Cpu className="w-4 h-4 text-sky-500 animate-pulse" />
          Engine: Gemini-3.5-Flash
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Presets & Custom input */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-800/80 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Standard Intelligence Puzzles
            </h3>
            <div className="space-y-2.5">
              {PUZZLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-3.5 rounded-lg border border-gray-800 hover:border-sky-500/50 bg-gray-950/40 hover:bg-sky-950/20 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span id={`preset-title-${preset.id}`} className="text-sm font-medium text-white group-hover:text-sky-300 transition-colors">
                      {preset.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider bg-gray-800/80 px-2 py-0.5 rounded text-gray-400">
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{preset.prompt}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleInitiateScan} className="bg-gray-900/40 p-5 rounded-xl border border-gray-800/80 backdrop-blur-md space-y-4">
            <div>
              <label htmlFor="puzzle-input" className="block text-sm font-medium text-gray-300 mb-2">
                Custom Problem/Hypothesis
              </label>
              <textarea
                id="puzzle-input"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a logic paradox, code optimization puzzle, or word dynamic riddle here..."
                className="w-full bg-gray-950 text-gray-100 placeholder-gray-600 border border-gray-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <button
              id="initiate-reasoning-btn"
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-800 text-gray-950 font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-gray-950" />
                  Reasoning Core Active...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-gray-950" />
                  Initiate Cognitive Scan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Execution results / Timeline */}
        <div className="lg:col-span-7">
          <div className="bg-gray-900/20 rounded-xl border border-gray-800/80 h-full min-h-[400px] flex flex-col overflow-hidden">
            {/* Header / Meta */}
            <div className="bg-gray-900/50 px-5 py-4 border-b border-gray-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-500" />
                Deductive Output Matrix
              </span>
              {result && (
                <div id="confidence-badge" className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Confidence Metric:</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    result.confidence > 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  }`}>
                    {result.confidence}%
                  </span>
                </div>
              )}
            </div>

            {/* Content box */}
            <div id="cognitive-sandbox-output" className="flex-1 p-6 overflow-y-auto space-y-6">
              {isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-sky-500/30 border-t-sky-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-sky-400 animate-bounce absolute top-3.5 left-3.5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-sky-200">Processing Semantic Graph</p>
                    <p className="text-xs text-gray-500 font-mono animate-pulse">Running layers of token-based deduction...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-300">Cognitive Failure</h4>
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <Brain className="w-12 h-12 text-gray-700 stroke-1" />
                  <div className="max-w-sm space-y-1">
                    <p className="text-sm text-gray-400 font-medium font-display">System Idle</p>
                    <p className="text-xs text-gray-600">
                      Select a logic puzzle preset from the side panel or enter custom reasoning parameters to stream raw AI analytical thought.
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Step Timeline */}
                  <div>
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-sky-500 mb-3">
                      Logical Deductive Steps
                    </h4>
                    <div className="space-y-3 border-l border-gray-800 ml-2.5">
                      {result.thoughtProcess.map((step, idx) => (
                        <div key={idx} className="relative pl-6 pb-2 last:pb-0">
                          {/* Dot */}
                          <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-gray-950 shadow-sm shadow-sky-500/50" />
                          <span className="text-[11px] font-mono text-gray-500 block mb-0.5">
                            HYPOTHESIS LAYER {idx + 1}
                          </span>
                          <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Output Card */}
                  <div className="bg-sky-950/10 border border-sky-800/30 p-5 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                        Conclusive Solution Summary
                      </span>
                    </div>
                    <p className="text-sm text-gray-100 font-semibold leading-relaxed">
                      {result.finalAnswer}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
