import React, { useState, useRef } from "react";
import { Eye, Sparkles, Upload, RefreshCw, Layers, Layout, Palette, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IntelScanResult } from "../types";

export default function MultimodalScanner() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IntelScanResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPEG, WEBP).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
    };
    reader.onerror = () => {
      setError("Failed to convert image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setImageBase64(null);
    setResult(null);
    setError(null);
    setTextPrompt("");
  };

  const handleIntelScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      setError("Please select or drop an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/intel/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          textPrompt: textPrompt.trim()
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Scan returned code ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during multimodal visualization scanning.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="multimodal-scanner-container" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-400" />
            Multimodal Spatial Intel
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Re-evaluate diagrams, blueprints, landscapes, or charts utilizing Gemini's cognitive vision capabilities.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-cyan-400 font-mono">
          <Layers className="w-4 h-4 text-cyan-500 animate-pulse" />
          Neural Vision Model Activated
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-800/80 backdrop-blur-md space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Vision Input Feed
            </h3>

            {/* Drag & Drop Canvas */}
            <div
              id="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!imageBase64 ? triggerFileInput : undefined}
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center min-h-[220px] ${
                imageBase64 ? "border-gray-800 bg-gray-950/20" : "cursor-pointer"
              } ${
                isDragging ? "border-cyan-500 bg-cyan-950/10 scale-[1.01]" : "border-gray-800 hover:border-cyan-500/55 bg-gray-950/40"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {imageBase64 ? (
                <div className="w-full h-full flex flex-col items-center">
                  <div className="relative max-h-[250px] overflow-hidden rounded-lg border border-gray-800 bg-black/40 group">
                    <img
                      src={imageBase64}
                      alt="Uploaded intel resource"
                      className="object-contain max-h-[250px] w-auto max-w-full"
                    />
                    <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-3.5 text-xs font-mono text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-900/30 bg-gray-900/35 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Remove Resources & Reset
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-800/20 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300 font-medium">Drag & Drop visual asset here</p>
                    <p className="text-xs text-gray-500 font-mono">or click to browse local files</p>
                  </div>
                  <p className="text-[10px] text-gray-600">Supports PNG, JPG, WEBP formats</p>
                </div>
              )}
            </div>

            {/* Custom Instruction Prompt */}
            <form onSubmit={handleIntelScan} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Cognitive Scan Intent (Optional)
                </label>
                <input
                  type="text"
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="e.g. Focus on spatial elements / decode diagram logic"
                  className="w-full bg-gray-950 text-gray-200 placeholder-gray-700 border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                id="initiate-vision-scan-btn"
                type="submit"
                disabled={isLoading || !imageBase64}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 disabled:from-gray-800 disabled:to-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all text-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Executing Multimodal Decoding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Decode Scene Spatial Elements
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Display / Advanced Spatial View overlays */}
        <div className="lg:col-span-7">
          <div className="bg-gray-900/20 rounded-xl border border-gray-800/80 h-full min-h-[440px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900/50 px-5 py-4 border-b border-gray-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-cyan-500" />
                Spatial Analysis Overlay
              </span>
              {result && (
                <span className="text-[10px] font-mono text-green-400 bg-green-950/20 border border-green-900/40 px-2 py-0.5 rounded">
                  Resolved Dynamic Features
                </span>
              )}
            </div>

            {/* Display Body */}
            <div id="multimodal-output-screen" className="flex-1 p-6 overflow-y-auto space-y-6">
              {isLoading && (
                <div className="h-full flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <Eye className="w-5 h-5 text-cyan-400 animate-pulse absolute top-3.5 left-3.5" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-cyan-200">Processing Visual Grounding Matrix</p>
                    <p className="text-xs text-gray-500 font-mono animate-pulse">Plotting 2D bounds & calculating color coverage indices...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-lg flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-red-300">Vision Diagnostic Fail</h4>
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3">
                  <Layout className="w-12 h-12 text-gray-700 stroke-1" />
                  <div className="max-w-sm space-y-1">
                    <p className="text-sm text-gray-400 font-medium font-display">No Assets Parsed</p>
                    <p className="text-xs text-gray-600">
                      Upload an architectural system, layout flow chart, UI mock, or general scene to view AI coordinates plotted in real-time.
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
                  {/* Coordinate Canvas Plotting */}
                  <div className="relative flex justify-center bg-black/40 rounded-xl border border-gray-800/80 overflow-hidden group">
                    {/* Bounding box overlays */}
                    <div className="relative w-full max-w-md">
                      <img
                        src={imageBase64 || ""}
                        alt="Scanned intel visual"
                        className="w-full h-auto object-contain max-h-[300px] mx-auto block"
                      />
                      
                      {/* Interactive BBoxes overlay */}
                      <div className="absolute inset-0">
                        {result.spatialGrid.map((box, idx) => (
                          <div
                            key={idx}
                            id={`bbox-${idx}`}
                            className="absolute border border-cyan-400/80 bg-cyan-500/10 hover:bg-cyan-500/30 transition-colors group/box cursor-help"
                            style={{
                              left: `${box.x}%`,
                              top: `${box.y}%`,
                              width: `${box.width}%`,
                              height: `${box.height}%`
                            }}
                          >
                            <span className="absolute left-0.5 -top-4 px-1.5 py-0.5 rounded bg-cyan-900/90 text-white text-[8px] font-mono leading-none tracking-tight invisible group-hover/box:visible opacity-0 group-hover/box:opacity-100 transition-all whitespace-nowrap z-30 shadow-lg border border-cyan-700/50">
                              {box.label} ({box.width}% x {box.height}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detected Spatial Index labels */}
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-2">
                      Detected Objects & Boundaries Registry
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.spatialGrid.map((box, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded bg-gray-900/60 border border-gray-800 text-[11px] text-gray-300 font-mono flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                          <span className="font-semibold text-white">{box.label}</span>
                          <span className="text-gray-500 text-[9px] font-normal">
                            [x:{box.x} y:{box.y}]
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Intelligence Narrative Decode */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                      Cognitive Science Inference
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/40 p-3.5 border border-gray-800/40 rounded-lg">
                      {result.cognitiveInference}
                    </p>
                  </div>

                  {/* Detected Concepts and Color Profiles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Detected Concepts */}
                    <div className="bg-gray-950/30 border border-gray-800/40 p-3.5 rounded-lg">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        Abstract Concepts Detected
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {result.detectedConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="bg-cyan-950/20 text-cyan-300 border border-cyan-900/30 px-2 py-0.5 rounded text-[10px] uppercase font-mono"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Color Profile extraction */}
                    <div className="bg-gray-950/30 border border-gray-800/40 p-3.5 rounded-lg space-y-2">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5" />
                        Dominant Color Palette
                      </h4>
                      <div className="space-y-1.5">
                        {result.colorProfile.map((col, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-md border border-white/10 shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span className="text-gray-300 text-[10px] truncate max-w-[110px]">
                                {col.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                              <span>{col.hex}</span>
                              <span className="text-indigo-400">({col.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
