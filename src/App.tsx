import { useState } from "react";
import { Brain, Eye, Award, Sparkles, Cpu, ShieldAlert, ArrowRight, BookOpen, Activity } from "lucide-react";
import CognitiveSandbox from "./components/CognitiveSandbox";
import MultimodalScanner from "./components/MultimodalScanner";
import IntelProfiler from "./components/IntelProfiler";

type ActiveTab = "sandbox" | "scanner" | "profiler";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("sandbox");

  return (
    <div id="sleek-app-container" className="min-h-screen text-slate-300 font-sans relative flex flex-col justify-between overflow-x-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div id="mesh-gradient-bg" className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-tr from-blue-900/10 via-indigo-900/15 to-purple-900/10 blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-indigo-950/20 rounded-full filter blur-3xl opacity-40" />
      </div>

      {/* Static grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Global Header */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-slate-950/25 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-3.5 h-3.5 bg-white rounded-full animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">Aether.AI</span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none block">Universal Suite</span>
          </div>
        </div>

        {/* Navigation Tabs bar */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-white/5 rounded-full p-1 max-w-lg">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "sandbox"
                ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Logic Sandbox
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "scanner"
                ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Multimodal Spatial
          </button>
          <button
            onClick={() => setActiveTab("profiler")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "profiler"
                ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            IQ Profiler
          </button>
        </div>

        {/* Call To Action button */}
        <button
          onClick={() => {
            const nextTab = activeTab === "sandbox" ? "scanner" : activeTab === "scanner" ? "profiler" : "sandbox";
            setActiveTab(nextTab);
          }}
          className="px-4 py-2 rounded-full border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 bg-white/5 text-xs font-bold hover:bg-slate-800/40 transition-all cursor-pointer shadow-lg active:scale-95"
        >
          Cycle Architecture Vector
        </button>
      </header>

      {/* Hero / Main Section */}
      <main id="main-content-wrapper" className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 relative z-10 space-y-12">
        
        {/* Sleek Hero Intro banner */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Release v4.0 Release Now Available</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter">
              Cognitive Computing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                Redefined.
              </span>
            </h1>

            <p className="text-base text-slate-400 leading-relaxed max-w-xl font-sans">
              Deploy advanced neural architectures that learn, adapt, and scale across your entire organization with millisecond latency. Start evaluating live models directly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById("active-deck-view");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                Access Neural Sandbox
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("metricbar-deck");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-bold hover:bg-slate-800/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                View Network Node Metrics
              </button>
            </div>
          </div>

          {/* Right Hero: Gorgeous Floating Abstract Neural Globe */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
              {/* Outer Pulsing Bounds */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-indigo-500/25 animate-[spin_50s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-purple-500/30 animate-[spin_35s_linear_infinite_reverse]" />
              
              {/* Core Gradient & Glass HUD Symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/25 blur-2xl" />
                
                <div className="absolute w-28 h-28 rounded-3xl bg-slate-950/80 border border-white/10 flex flex-col items-center justify-center shadow-2xl shadow-cyan-500/10 rotate-12 transition-all hover:rotate-0 duration-500">
                  <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-indigo-300 mt-1 uppercase tracking-widest font-bold">
                    AETHER.NODE
                  </span>
                </div>
              </div>

              {/* Floating Data Point 1: Realtime Latency */}
              <div className="absolute -top-3 -right-6 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 shadow-lg scale-90 md:scale-100">
                <div className="text-[9px] text-cyan-400 font-bold uppercase font-mono tracking-widest">
                  Realtime Inference
                </div>
                <div className="text-base font-mono font-bold text-white mt-0.5">14.2ms</div>
              </div>

              {/* Floating Data Point 2: Model Accuracy */}
              <div className="absolute -bottom-4 -left-6 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-500/30 shadow-lg scale-90 md:scale-100">
                <div className="text-[9px] text-purple-400 font-bold uppercase font-mono tracking-widest">
                  Model Accuracy
                </div>
                <div className="text-base font-mono font-bold text-white mt-0.5">99.98%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex flex-wrap gap-1 bg-slate-900 border border-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === "sandbox" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            Sandbox
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === "scanner" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            Scanner
          </button>
          <button
            onClick={() => setActiveTab("profiler")}
            className={`flex-1 min-w-[90px] py-2 rounded-lg text-xs font-semibold text-center transition-all ${
              activeTab === "profiler" ? "bg-cyan-600 text-white" : "text-slate-400"
            }`}
          >
            IQ Profiler
          </button>
        </div>

        {/* Render Active Interactive Panel */}
        <section
          id="active-deck-view"
          className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow border at top of container */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          {activeTab === "sandbox" && <CognitiveSandbox />}
          {activeTab === "scanner" && <MultimodalScanner />}
          {activeTab === "profiler" && <IntelProfiler />}
        </section>
      </main>

      {/* Global Status Metric Deck Bar */}
      <footer
        id="metricbar-deck"
        className="w-full bg-slate-950/70 border-t border-white/5 relative z-10 py-8 px-6 md:px-12 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Active Neural Nodes
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                48,209
              </span>
              <span className="text-[10px] text-green-400 font-mono font-medium">
                +12.4%
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 border-l border-white/5 pl-6 md:pl-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Daily Network Queries
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                4.2B+
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-medium">
                Stable
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 border-l border-white/5 pl-6 md:pl-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              System Wide Accuracy
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                99.999%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Precision
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-1 border-l border-white/5 pl-6 md:pl-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Region Latency Response
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-white uppercase font-mono">
                Low
              </span>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <div className="w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <div className="w-1 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <div className="w-1 h-3 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>

        </div>
        
        {/* Humble attribution indicator to completely exclude AI Slop and telemetry port lines */}
        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} Aether Intelligence Website (Universal Suite)</span>
          <div className="flex items-center gap-2 text-indigo-400">
            <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span>Operational Integrity: 100% Client-Server Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
