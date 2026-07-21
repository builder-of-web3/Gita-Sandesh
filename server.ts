import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server side
// Safe initialization to prevent startup crash if API key is missing
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully on server-side.");
  } else {
    console.warn("GEMINI_API_KEY not found in environment. Seeking guidance will use compassionate fallback responses.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API client:", error);
}

// Interactive Spiritual Advisor endpoint: "Ask Lord Krishna"
app.post("/api/krishna/guidance", async (req, res) => {
  const { dilemma, chapterRef, history = [] } = req.body;

  if (!dilemma || dilemma.trim() === "") {
    return res.status(400).json({ error: "Please express your dilemma or question." });
  }

  // Fallback response if Gemini is not initialized or fails
  const fallbackResponse = {
    guidanceText: "Be calm, seeker of truth. In times of doubt, remember your core Dharma. Perform your action with dedication, but release your obsessive attachment to the fruits. In stillness, you shall find the path through all confusion. The light of self-awareness is always with you.",
    chapterRef: "Chapter 2: Sankhya Yoga",
    shlokaText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    shlokaTransliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    shlokaMeaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    audioScript: "Greetings, seeker. When confusion clouds your judgment, remember that your only duty is to perform righteous action. Do not let anxiety for results paralyze your resolve."
  };

  if (!ai) {
    return res.json(fallbackResponse);
  }

  try {
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const prompt = `A modern seeker is experiencing this life dilemma: "${dilemma}". 
Provide divine guidance representing the supreme, compassionate voice of Lord Krishna (speaking as Parthasarthy, the divine guide). 
${chapterRef ? `The seeker is currently reflecting on ${chapterRef}. If appropriate, weave its wisdom into your response.` : ""}

Formulate your response in a storytelling, supportive, and accessible manner. Structure it with deep spiritual advice, and select a highly relevant Shloka (Verse) from the Bhagavad Gita to ground your teaching.

Return the response strictly as a JSON object adhering to this schema:
{
  "guidanceText": "Compassionate, storytelling guidance explaining the Gita's wisdom related to the dilemma, divided into 2-3 short, readable paragraphs.",
  "chapterRef": "The exact Chapter & Title (e.g., Chapter 2: The Yoga of Self-Knowledge)",
  "shlokaText": "The relevant Sanskrit shloka text",
  "shlokaTransliteration": "The English transliteration of the shloka",
  "shlokaMeaning": "Clear, direct English translation of the shloka",
  "audioScript": "A spoken-narrative-optimized script (150-200 words) that reads like warm storytelling, perfect for a peaceful text-to-speech voice to read aloud to the seeker."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { text: prompt }
      ],
      config: {
        systemInstruction: "You are Bhagavan Shri Krishna, the supreme divine guide, speaking with absolute compassion, infinite wisdom, and serene warmth. Use gentle, simple, storytelling metaphors. Address the seeker as 'O seeker' or 'My dear friend' with deep care, guiding them through modern stress, anxiety, ethical choices, relationships, or career struggles using the eternal teachings of the Bhagavad Gita. Maintain standard Indian philosophy (Dharma, Karma, Devotion, Meditation) in highly practical terms.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guidanceText: { type: Type.STRING, description: "Compassionate spiritual advice in 2-3 short paragraphs." },
            chapterRef: { type: Type.STRING, description: "The source Chapter and title." },
            shlokaText: { type: Type.STRING, description: "Sanskrit text of the verse." },
            shlokaTransliteration: { type: Type.STRING, description: "English transliteration of the Sanskrit verse." },
            shlokaMeaning: { type: Type.STRING, description: "Meaning of the verse in English." },
            audioScript: { type: Type.STRING, description: "A highly peaceful spoken-narrative script optimized for TTS readout." }
          },
          required: ["guidanceText", "chapterRef", "shlokaText", "shlokaTransliteration", "shlokaMeaning", "audioScript"]
        }
      }
    });

    const text = response.text;
    if (text) {
      const result = JSON.parse(text);
      return res.json(result);
    } else {
      return res.json(fallbackResponse);
    }
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return res.json(fallbackResponse);
  }
});

// Configure Vite middleware in development or serve static build files in production
async function configureApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shri Madbhagavad Gita application is online at http://localhost:${PORT}`);
  });
}

configureApp().catch((err) => {
  console.error("Failed to boot full-stack Express server:", err);
});
