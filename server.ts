import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazily initialize the Google Gen AI client with robust error handling
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please verify it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests with size limits for base64 images
  app.use(express.json({ limit: "15mb" }));

  // API HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV || "development" });
  });

  // 1. COGNITIVE REASONING SANDBOX
  app.post("/api/cognitive/solve", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Please enter a valid reasoning problem prompt." });
      }

      const client = getGenAI();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this intelligence statement, puzzle, or logic query step-by-step:
"${prompt}"`,
        config: {
          systemInstruction: "You are a state-of-the-art cognitive reasoning agent. Expand your internal thought layers, verify logic steps, measure confidence thresholds, and provide the conclusive final outcome.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thoughtProcess: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of structured mental expansion stages or deductive leaps."
              },
              confidence: {
                type: Type.INTEGER,
                description: "Strictly calculated probability score between 0 and 100 on correctness."
              },
              finalAnswer: {
                type: Type.STRING,
                description: "Plain, explicit, and complete summary representation of the correct solution."
              }
            },
            required: ["thoughtProcess", "confidence", "finalAnswer"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No output received from the reasoning model.");
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error("Cognitive Reasoning fail:", error);
      res.status(500).json({ error: error.message || "Cognitive reasoning failed" });
    }
  });

  // 2. MULTIMODAL INTEL SCANNER
  app.post("/api/intel/scan", async (req, res) => {
    try {
      const { imageBase64, textPrompt } = req.body;
      const client = getGenAI();

      const parts: any[] = [];
      if (imageBase64) {
        // Strip prefix if any
        const cleanBase64 = imageBase64.includes(";base64,")
          ? imageBase64.split(";base64,")[1]
          : imageBase64;
          
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        });
      }

      parts.push({
        text: `Analyze this visualization scene for critical spatial coords, color percentages, and high cognitive meaning: "${textPrompt || "Identify spatial structures, details, colors, and abstract concepts."}"`
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction: "You are an advanced visual cognitive science model. Decode files, charts, blueprinted layouts, or scenes. Identify semantic concepts, formulate a complex intelligence inference, build a synthetic 2D bounding grid of elements, and extract a dominant hex RGB palette (with estimated coverage % and labels). Ensure x, y, width, height bounding coordinates reside inside a 0-100 percentage layout.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedConcepts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Primary keywords or cognitive tags detected."
              },
              cognitiveInference: {
                type: Type.STRING,
                description: "Detailed, comprehensive narrative decoding what the visual structure represents."
              },
              spatialGrid: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING, description: "Name of the detected object, boundary or diagram element." },
                    x: { type: Type.INTEGER, description: "Coordinate percent from left (0 to 100)." },
                    y: { type: Type.INTEGER, description: "Coordinate percent from top (0 to 100)." },
                    width: { type: Type.INTEGER, description: "Width scale percent (0 to 100)." },
                    height: { type: Type.INTEGER, description: "Height scale percent (0 to 100)." }
                  },
                  required: ["label", "x", "y", "width", "height"]
                }
              },
              colorProfile: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: "Valid CSS #hex color code e.g. #2D3748" },
                    percentage: { type: Type.INTEGER, description: "Visual concentration percent 1 to 100" },
                    name: { type: Type.STRING, description: "Elegantly stylized name for this shade" }
                  },
                  required: ["hex", "percentage", "name"]
                }
              }
            },
            required: ["detectedConcepts", "cognitiveInference", "spatialGrid", "colorProfile"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No output received from the vision scanner model.");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Multimodal scanner fail:", error);
      res.status(500).json({ error: error.message || "Multimodal analysis failed" });
    }
  });

  // 3. INTELLIGENCE PROFILER (DYNAMIC BENCHMARK)
  app.post("/api/benchmark/generate", async (req, res) => {
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ error: "Please enter a valid cognitive testing category." });
      }

      const client = getGenAI();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a dynamic multiple-choice testing questionnaire with exactly 4 questions focusing on the following theme: "${category}". Questions should challenge deep intelligence domains such as analytical deduction, spatial structures, logical sequences, or numerical patterns.`,
        config: {
          systemInstruction: "You are the Assessment Director of the Universal Intelligence Institute. Generate complex, authentic intelligence metrics testing multiple cognitive sectors. Format precisely into multiple-choice items. Ensure that correctIndex ranges from 0 to 3.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Elegant title of the benchmark vector" },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER, description: "1-indexed unique identifier" },
                    question: { type: Type.STRING, description: "The intelligence testing scenario or prompt" },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of exactly 4 plausible choices"
                    },
                    correctIndex: { type: Type.INTEGER, description: "Correct choice option index (0 to 3)" },
                    explanation: { type: Type.STRING, description: "Deep pedagogical explanation of the correct logic." }
                  },
                  required: ["id", "question", "options", "correctIndex", "explanation"]
                }
              }
            },
            required: ["category", "questions"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No output received from benchmark model.");
      }

      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Benchmark generation fail:", error);
      res.status(500).json({ error: error.message || "Benchmark creation failed." });
    }
  });

  // Vite middleware setup for Development or Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Intelligence Server running on http://localhost:${PORT}`);
  });
}

startServer();
