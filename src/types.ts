export interface PuzzleSample {
  id: string;
  title: string;
  category: "logic" | "math" | "science";
  prompt: string;
}

export interface CognitiveAnalysis {
  thoughtProcess: string[];
  confidence: number;
  finalAnswer: string;
}

export interface IntelScanResult {
  detectedConcepts: string[];
  cognitiveInference: string;
  spatialGrid: { label: string; x: number; y: number; width: number; height: number }[];
  colorProfile: { hex: string; percentage: number; name: string }[];
}

export interface DynamicQuiz {
  category: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface BenchmarkScore {
  category: string;
  userScore: number;
  aiScore: number;
  maxScore: number;
}
