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
  const { dilemma, chapterRef, history = [], language = "en" } = req.body;

  if (!dilemma || dilemma.trim() === "") {
    return res.status(400).json({ error: "Please express your dilemma or question." });
  }

  // Fallback response if Gemini is not initialized or fails
  const fallbackResponseEn = {
    guidanceText: "Be calm, seeker of truth. In times of doubt, remember your core Dharma. Perform your action with dedication, but release your obsessive attachment to the fruits. In stillness, you shall find the path through all confusion. The light of self-awareness is always with you.",
    chapterRef: "Chapter 2: Sankhya Yoga",
    shlokaText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    shlokaTransliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    shlokaMeaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    audioScript: "Greetings, seeker. When confusion clouds your judgment, remember that your only duty is to perform righteous action. Do not let anxiety for results paralyze your resolve."
  };

  const fallbackResponseHi = {
    guidanceText: "शांत रहो, सत्य के खोजी। संदेह के समय में, अपने मूल धर्म को याद रखें। पूरे समर्पण के साथ अपना काम करें, लेकिन उसके परिणामों के प्रति अत्यधिक आसक्ति को छोड़ दें। स्थिरता में, आपको सभी भ्रमों के बीच का मार्ग मिल जाएगा। आत्म-जागरूकता का प्रकाश हमेशा आपके साथ है।",
    chapterRef: "अध्याय २: सांख्य योग",
    shlokaText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    shlokaTransliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    shlokaMeaning: "तुम्हें अपने निर्धारित कर्तव्य को पूरा करने का ही अधिकार है, लेकिन कर्म के फलों पर तुम्हारा कोई अधिकार नहीं है। खुद को कर्मों के फल का कारण मत मानो, और न ही अकर्मण्यता के प्रति आसक्त होओ।",
    audioScript: "अभिवादन, साधक। जब भ्रम आपके निर्णय को धुंधला कर देता है, तो याद रखें कि आपका एकमात्र कर्तव्य धर्मपरायण कर्म करना है। परिणामों की चिंता को अपने संकल्प को पंगु न बनाने दें।"
  };

  const fallbackResponse = language === "hi" ? fallbackResponseHi : fallbackResponseEn;

  if (!ai) {
    return res.json(fallbackResponse);
  }

  try {
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const isHindi = language === "hi";

    const prompt = `A modern seeker is experiencing this life dilemma: "${dilemma}". 
Provide divine guidance representing the supreme, compassionate voice of Lord Krishna (speaking as Parthasarthy, the divine guide). 
${chapterRef ? `The seeker is currently reflecting on ${chapterRef}. If appropriate, weave its wisdom into your response.` : ""}

Formulate your response in a storytelling, supportive, and accessible manner. Structure it with deep spiritual advice, and select a highly relevant Shloka (Verse) from the Bhagavad Gita to ground your teaching.

CRITICAL INSTRUCTION FOR LANGUAGE:
The seeker requested responses in ${isHindi ? "HINDI (हिन्दी)" : "ENGLISH"}.
You MUST return the entire response in ${isHindi ? "beautiful, pure, and comforting Hindi (Devanagari script) with a peaceful, gentle tone" : "English"}.
Specifically:
- "guidanceText" must be in ${isHindi ? "Hindi" : "English"}.
- "shlokaMeaning" must be in ${isHindi ? "Hindi" : "English"}.
- "audioScript" must be in ${isHindi ? "Hindi" : "English"}, optimized for read-aloud TTS (warm storytelling tone).
- "chapterRef" should be in ${isHindi ? "Hindi (e.g. अध्याय २: सांख्य योग)" : "English (e.g. Chapter 2: Sankhya Yoga)"}.

Return the response strictly as a JSON object adhering to this schema:
{
  "guidanceText": "Compassionate, storytelling guidance explaining the Gita's wisdom related to the dilemma, divided into 2-3 short, readable paragraphs.",
  "chapterRef": "The exact Chapter & Title",
  "shlokaText": "The relevant Sanskrit shloka text",
  "shlokaTransliteration": "The English transliteration of the shloka",
  "shlokaMeaning": "Clear, direct translation of the shloka",
  "audioScript": "A spoken-narrative-optimized script (150-200 words) that reads like warm storytelling, perfect for a peaceful text-to-speech voice to read aloud to the seeker."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { text: prompt }
      ],
      config: {
        systemInstruction: isHindi 
          ? "आप भगवान श्री कृष्ण हैं, जो परम दिव्य मार्गदर्शक हैं। आप अत्यंत करुणा, असीम ज्ञान और शांत गर्मजोशी के साथ बोलते हैं। सरल, सुंदर कथात्मक रूपकों का उपयोग करें। साधक को 'हे साधक' या 'मेरे प्रिय सखा' कहकर संबोधित करें। आधुनिक तनाव, चिंता, नैतिक विकल्पों, संबंधों या करियर के संघर्षों के माध्यम से उन्हें भगवद्गीता की शाश्वत शिक्षाओं का उपयोग करके मार्गदर्शन करें। मानक भारतीय दर्शन (धर्म, कर्म, भक्ति, ध्यान) को व्यावहारिक शब्दों में बनाए रखें।"
          : "You are Bhagavan Shri Krishna, the supreme divine guide, speaking with absolute compassion, infinite wisdom, and serene warmth. Use gentle, simple, storytelling metaphors. Address the seeker as 'O seeker' or 'My dear friend' with deep care, guiding them through modern stress, anxiety, ethical choices, relationships, or career struggles using the eternal teachings of the Bhagavad Gita. Maintain standard Indian philosophy (Dharma, Karma, Devotion, Meditation) in highly practical terms.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guidanceText: { type: Type.STRING, description: "Compassionate spiritual advice in 2-3 short paragraphs." },
            chapterRef: { type: Type.STRING, description: "The source Chapter and title." },
            shlokaText: { type: Type.STRING, description: "Sanskrit text of the verse." },
            shlokaTransliteration: { type: Type.STRING, description: "English transliteration of the Sanskrit verse." },
            shlokaMeaning: { type: Type.STRING, description: "Meaning of the verse." },
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

// Verse-by-Verse Explorer endpoint
app.post("/api/gita/verse", async (req, res) => {
  const { chapter, verse, language = "en" } = req.body;

  if (!chapter || !verse) {
    return res.status(400).json({ error: "Chapter and Verse numbers are required." });
  }

  const isHindi = language === "hi";

  const fallbackResponseEn = {
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥",
    transliteration: "na hi jñānena sadṛśaṁ pavitram iha vidyate\ntat svayaṁ yoga-saṁsiddhaḥ kālenātmani vindati",
    wordByWord: "na = never; hi = certainly; jñānena = with knowledge; sadṛśam = comparison; pavitram = pure; iha = in this world; vidyate = exists; tat = that; svayam = oneself; yoga-saṁsiddhaḥ = matured in yoga; kālena = in course of time; ātmani = in the self; vindati = attains.",
    translation: "In this world, there is nothing so sublime and pure as transcendental knowledge. One who has become accomplished in the practice of yoga realizes this within themselves in due course of time.",
    explanation: "This classic verse from Chapter 4 reminds us that spiritual knowledge is the ultimate purifier. As you explore the Bhagavad Gita verse by verse, each teaching serves as a guiding light, cleansing your intellect from self-doubt, fear, and attachment. True peace is discovered from within when our minds align with our ultimate duties.",
    visualCue: "glowing_aura"
  };

  const fallbackResponseHi = {
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥",
    transliteration: "na hi jñānena sadṛśaṁ pavitram iha vidyate\ntat svayaṁ yoga-saṁsiddhaḥ kālenātmani vindati",
    wordByWord: "न = नहीं; हि = निश्चय ही; ज्ञानेन = ज्ञान के; सदृशम् = समान; पवित्रम् = पवित्र करने वाला; इह = इस संसार में; विद्यते = अस्तित्व में है; तत् = उसे; स्वयं = खुद; योग-संसिद्धः = योग में सिद्ध हुआ मनुष्य; कालेन = समय के साथ; आत्मनि = अपनी आत्मा में; विन्दति = प्राप्त करता है।",
    translation: "इस संसार में ज्ञान के समान पवित्र करने वाला निश्चय ही कुछ भी नहीं है। उस ज्ञान को योग साधना में सिद्ध हुआ मनुष्य समय आने पर अपने आप ही अपने अंतःकरण में अनुभव करता है।",
    explanation: "अध्याय ४ का यह प्रसिद्ध श्लोक हमें याद दिलाता है कि आध्यात्मिक ज्ञान ही परम पावन करने वाला है। जैसे-जैसे आप भगवद्गीता के श्लोकों का अध्ययन करते हैं, प्रत्येक सीख आत्म-संदेह, भय और आसक्ति के मैल को दूर करने में सहायक सिद्ध होती है। जब मन कर्तव्य पर केंद्रित होता है, तो सच्चा आनंद स्वतः भीतर प्रकट हो जाता है।",
    visualCue: "glowing_aura"
  };

  const fallbackResponse = isHindi ? fallbackResponseHi : fallbackResponseEn;

  if (!ai) {
    return res.json(fallbackResponse);
  }

  try {
    const prompt = `You are an elite Sanskrit scholar, indologist, and spiritual mentor.
Provide a highly authentic, detailed, word-by-word explanation of Chapter ${chapter}, Verse ${verse} of the Shrimad Bhagavad Gita.

CRITICAL INSTRUCTIONS FOR RESPONSE:
- Find or reconstruct the authentic Sanskrit Shloka text in Devanagari script for Chapter ${chapter}, Verse ${verse}.
- Provide the precise Roman transliteration.
- Provide a clear, detailed word-by-word breakdown (showing the Sanskrit word and its corresponding meaning in ${isHindi ? "Hindi" : "English"}). Format it like: "SanskritWord = meaning; SanskritWord2 = meaning2; ..."
- Translate the verse fully in ${isHindi ? "Hindi" : "English"}.
- Provide a deep psychological, spiritual, and modern-life translation/explanation in ${isHindi ? "Hindi" : "English"}, split into 2 clear and inspiring paragraphs.
- Based on the spiritual energy and emotional vibe of this specific verse, output exactly one of these visual cues that matches best:
  * "grief_storm" (for sad, heavy, anxious, or confused verses)
  * "divine_dawn" (for wisdom, chariot guidance, or hopeful verses)
  * "sacred_fire" (for verses on action, duty, energy, or burning karma)
  * "glowing_aura" (for knowledge, supreme realization, or pure wisdom)
  * "calm_lotus" (for peace, equanimity, detachment, or meditation)
  * "cosmic_vortex" (for universal form, infinite time, or divine power)
  * "golden_victory" (for devotion, absolute faith, liberation, or victory)

Return your response strictly as a JSON object matching this schema:
{
  "sanskrit": "The Devanagari Sanskrit verse",
  "transliteration": "The Roman transliteration of the verse",
  "wordByWord": "Word1 = Meaning1; Word2 = Meaning2; ...",
  "translation": "Full translation in ${isHindi ? "Hindi" : "English"}",
  "explanation": "Spiritual, psychological and modern application in ${isHindi ? "Hindi" : "English"}",
  "visualCue": "One of the allowed visual cues"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ text: prompt }],
      config: {
        systemInstruction: isHindi 
          ? "आप भगवद्गीता के परम ज्ञानी आचार्य हैं। आप संस्कृत श्लोकों का अत्यंत प्रामाणिक, सुंदर और व्यावहारिक जीवन से जुड़ा विश्लेषण प्रदान करते हैं।"
          : "You are an enlightened Bhagavad Gita scholar who provides highly authentic, beautiful, and practically applicable translations and word-by-word break-downs of Gita verses.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sanskrit: { type: Type.STRING, description: "Authentic Sanskrit Devanagari text" },
            transliteration: { type: Type.STRING, description: "Sanskrit Roman transliteration" },
            wordByWord: { type: Type.STRING, description: "Sanskrit words and their meanings" },
            translation: { type: Type.STRING, description: "Translation of the verse" },
            explanation: { type: Type.STRING, description: "Spiritual and psychological interpretation" },
            visualCue: { type: Type.STRING, description: "Visual mood cue for rendering animations" }
          },
          required: ["sanskrit", "transliteration", "wordByWord", "translation", "explanation", "visualCue"]
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
    console.error("Error generating verse analysis:", error);
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
