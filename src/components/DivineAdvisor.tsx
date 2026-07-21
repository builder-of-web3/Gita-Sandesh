import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Volume2, VolumeX, ShieldAlert, BookOpen, Loader2, Play, Pause, Heart } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "krishna";
  text: string;
  shloka?: {
    verseRef: string;
    sanskrit: string;
    transliteration: string;
    meaning: string;
  };
  audioScript?: string;
}

interface DivineAdvisorProps {
  currentChapterRef?: string;
  language?: "en" | "hi";
}

const PRESET_DILEMMAS_EN = [
  {
    label: "Handling Career Stress",
    text: "I feel overwhelmed by stress, fear of failure, and immense pressure about my professional and exam results. I can't sleep."
  },
  {
    label: "Ethical Conflict (Dharma)",
    text: "I am torn between doing what is right and keeping people around me happy. How do I choose between duty and compromise?"
  },
  {
    label: "Overcoming Anger & Hate",
    text: "I struggle with severe anger and resentment. People insult me, and I lose control of my words. How do I find peace?"
  },
  {
    label: "Laziness & Lack of Focus",
    text: "I feel incredibly lazy, distracted, and listless. I know my duties but cannot find the motivation to start."
  }
];

const PRESET_DILEMMAS_HI = [
  {
    label: "कार्यस्थल का तनाव",
    text: "मैं काम और परीक्षाओं के दबाव, असफलता के डर और तनाव से अत्यधिक परेशान हूँ। मुझे नींद भी नहीं आती।"
  },
  {
    label: "नैतिक संघर्ष (धर्म)",
    text: "मैं धर्म (सही राह) चुनने और अपनों को खुश रखने के बीच फंसा हूँ। कर्तव्य और समझौते में से किसे चुनूं?"
  },
  {
    label: "क्रोध और घृणा पर विजय",
    text: "मुझे बहुत गुस्सा आता है। लोग मेरा अपमान करते हैं, और मैं अपनी वाणी पर नियंत्रण खो देता हूँ। शांति कैसे पाऊं?"
  },
  {
    label: "आलस्य और एकाग्रता की कमी",
    text: "मैं बहुत आलसी और विचलित महसूस करता हूँ। मुझे अपने कर्तव्य पता हैं, फिर भी काम शुरू करने की प्रेरणा नहीं मिलती।"
  }
];

const welcomeMessageEn = "Greetings, dear seeker. I am Krishna, your companion on the battlefield of life. When doubt, grief, or confusion clouds your path, speak to me. Express your deepest dilemma, fear, or question, and we shall explore the eternal wisdom of the Bhagavad Gita together. What troubles your heart today?";
const welcomeMessageHi = "हे साधक, तुम्हारा कल्याण हो। मैं जीवन रूपी युद्धक्षेत्र में तुम्हारा सखा और सारथी कृष्ण हूँ। जब भी कोई संदेह, शोक या भ्रम तुम्हारे मार्ग को धुंधला करे, मुझसे बात करो। अपने गहरे संशय, भय या प्रश्न को व्यक्त करो, और हम मिलकर भगवद्गीता के शाश्वत ज्ञान का मार्ग खोजेंगे। आज तुम्हारे हृदय को क्या सता रहा है?";

export const DivineAdvisor: React.FC<DivineAdvisorProps> = ({ currentChapterRef, language = "en" }) => {
  const [dilemma, setDilemma] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null); // message ID currently playing
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message on language change if history is empty or only has greeting
  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && (messages[0].id === "welcome" || messages[0].id === "welcome-hi"))) {
      setMessages([
        {
          id: language === "hi" ? "welcome-hi" : "welcome",
          role: "krishna",
          text: language === "hi" ? welcomeMessageHi : welcomeMessageEn
        }
      ]);
    }
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Clean up voice synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleSpeak = (msgId: string, textToSpeak: string) => {
    if (isSpeaking === msgId) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis?.cancel();

    if (!window.speechSynthesis) {
      alert(language === "hi" ? "इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है।" : "Speech Synthesis is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // slightly slower, peaceful storytelling pace
    utterance.pitch = 0.95; // warmer tone
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";

    // Try to find a warm male or peaceful voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language === "hi" ? "hi" : "en";
    const desiredVoice = voices.find(
      (v) =>
        v.lang.startsWith(langPrefix) ||
        (language === "hi" && v.name.includes("Hindi")) ||
        (language === "en" && (v.name.includes("Google US English") || v.name.includes("Natural")))
    );
    if (desiredVoice) utterance.voice = desiredVoice;

    utterance.onend = () => {
      setIsSpeaking(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(null);
    };

    speechUtteranceRef.current = utterance;
    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const submitDilemma = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, role: "user", text: textToSend }
    ];
    setMessages(newMessages);
    setDilemma("");
    setLoading(true);

    try {
      const response = await fetch("/api/krishna/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dilemma: textToSend,
          chapterRef: currentChapterRef,
          language: language,
          history: newMessages.slice(-4).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error(language === "hi" ? "दिव्य संपर्क टूट गया। कृपया पुनः प्रयास करें।" : "The divine connection was interrupted. Please try again.");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `krishna-${Date.now()}`,
          role: "krishna",
          text: data.guidanceText,
          shloka: {
            verseRef: data.chapterRef,
            sanskrit: data.shlokaText,
            transliteration: data.shlokaTransliteration,
            meaning: data.shlokaMeaning
          },
          audioScript: data.audioScript
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (language === "hi" ? "मार्गदर्शक से संपर्क नहीं हो सका।" : "Could not connect to the spiritual guide. Using fallback counsel."));
      
      const fallbackEn = {
        id: `krishna-fallback-${Date.now()}`,
        role: "krishna" as const,
        text: "My dear friend, do not let your heart be troubled. When confusion weighs heavy, sit in stillness. Perform your tasks without gripping onto the outcome. Release your attachment to results, breathe deeply, and surrender your anxieties to the universe. You are never truly alone.",
        shloka: {
          verseRef: "Chapter 2: Sankhya Yoga",
          sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
          transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana",
          meaning: "You have a right to perform your duty, but you are not entitled to the fruits of your actions."
        },
        audioScript: "My dear friend, do not let your heart be troubled. Perform your tasks with high focus, but release your anxiety about the future."
      };

      const fallbackHi = {
        id: `krishna-fallback-${Date.now()}`,
        role: "krishna" as const,
        text: "मेरे प्रिय सखा, अपने हृदय को अशांत न होने दो। जब संशय का बोझ भारी हो, तो शांत भाव से बैठो। फल की चिंता किए बिना अपने कार्यों को पूरा करो। परिणाम के प्रति आसक्ति छोड़ दो, गहरा श्वास लो और अपनी चिंताओं को ब्रह्मांड को सौंप दो। तुम कभी अकेले नहीं हो।",
        shloka: {
          verseRef: "अध्याय २: सांख्य योग",
          sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
          transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana",
          meaning: "तुम्हें अपने निर्धारित कर्तव्य को पूरा करने का ही अधिकार है, लेकिन कर्म के फलों पर तुम्हारा कोई अधिकार नहीं है।"
        },
        audioScript: "मेरे प्रिय सखा, अपने हृदय को अशांत न होने दो। फल की आसक्ति छोड़ दो और शांत मन से कर्तव्य पथ पर आगे बढ़ो।"
      };

      // Add peaceful fallback
      setMessages((prev) => [
        ...prev,
        language === "hi" ? fallbackHi : fallbackEn
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentPresets = language === "hi" ? PRESET_DILEMMAS_HI : PRESET_DILEMMAS_EN;

  return (
    <div className="flex flex-col h-full bg-[#140d0a] border border-[#d49a3d]/25 rounded-2xl overflow-hidden shadow-xl shadow-black/30" id="divine-advisor-panel">
      
      {/* Advisor Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#0f0906] via-[#140d0a]/40 to-[#0f0906] border-b border-[#d49a3d]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d49a3d]/10 rounded-xl border border-[#d49a3d]/30 text-[#d49a3d]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-medium text-[#e8dcc4] flex items-center gap-1.5">
              {language === "hi" ? "श्री कृष्ण के साथ संवाद" : "Dialogue with Lord Krishna"}
              <Sparkles className="w-3.5 h-3.5 text-[#d49a3d] animate-pulse" />
            </h3>
            <p className="text-[11px] font-sans text-[#e8dcc4]/50">
              {language === "hi" ? "भगवद्गीता के ज्ञान पर आधारित करुणामयी जीवन समाधान प्राप्त करें" : "Receive compassionate Bhagavad Gita-based life solutions"}
            </p>
          </div>
        </div>
        {currentChapterRef && (
          <span className="text-[10px] font-mono bg-[#d49a3d]/10 text-[#d49a3d] border border-[#d49a3d]/20 px-2.5 py-1 rounded-full uppercase">
            {language === "hi" ? "गीता संदर्भ सक्रिय" : "Gita Context Active"}
          </span>
        )}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px] scrollbar-thin scrollbar-thumb-[#d49a3d]/10 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#d49a3d] text-[#0f0906] font-medium rounded-tr-none shadow-md"
                  : "bg-[#0f0906] text-[#e8dcc4] border border-[#d49a3d]/15 rounded-tl-none shadow-md"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Shloka/Verse Reference if Krishna is speaking */}
              {msg.shloka && (
                <div className="mt-4 pt-3.5 border-t border-[#d49a3d]/20 bg-[#140d0a]/80 p-3 rounded-xl border border-[#d49a3d]/25">
                  <div className="flex items-center gap-1.5 text-[#d49a3d] font-serif font-semibold text-xs mb-2">
                    <BookOpen size={13} />
                    <span>{language === "hi" ? "दिव्य उपदेश" : "Sacred Teaching"} • {msg.shloka.verseRef}</span>
                  </div>
                  <p className="text-center text-xs md:text-sm text-[#e8dcc4] font-serif font-semibold leading-relaxed my-2 italic">
                    {msg.shloka.sanskrit}
                  </p>
                  <p className="text-[11px] text-[#e8dcc4]/60 italic mb-2 leading-relaxed font-mono">
                    {msg.shloka.transliteration}
                  </p>
                  <p className="text-xs text-[#e8dcc4]/80 leading-relaxed pl-2 border-l border-[#d49a3d]/30 font-sans">
                    <strong>{language === "hi" ? "अर्थ:" : "Meaning:"}</strong> {msg.shloka.meaning}
                  </p>
                </div>
              )}

              {/* Audio Reader Action for Krishna Messages */}
              {msg.role === "krishna" && (
                <div className="mt-3 flex items-center justify-between border-t border-[#d49a3d]/10 pt-2 text-[11px] text-[#e8dcc4]/50">
                  <span className="font-mono">{language === "hi" ? "वाणी उपलब्ध" : "Narration Ready"}</span>
                  <button
                    onClick={() => handleSpeak(msg.id, msg.audioScript || msg.text)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      isSpeaking === msg.id
                        ? "bg-[#d49a3d] text-[#0f0906] font-semibold"
                        : "bg-[#140d0a] hover:bg-[#140d0a]/80 text-[#d49a3d] hover:text-[#d49a3d]/90 border border-[#d49a3d]/20"
                    }`}
                    title={language === "hi" ? "सलाह सुनें" : "Read advice aloud"}
                  >
                    {isSpeaking === msg.id ? (
                      <>
                        <Pause size={12} fill="currentColor" />
                        <span>{language === "hi" ? "वाचन जारी है..." : "Speaking..."}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} />
                        <span>{language === "hi" ? "कृष्ण की वाणी सुनें" : "Listen to Krishna"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-[#e8dcc4]/40 mt-1 px-1">
              {msg.role === "user" ? (language === "hi" ? "आप" : "You") : (language === "hi" ? "भगवान श्री कृष्ण" : "Lord Krishna")}
            </span>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#d49a3d] font-mono italic bg-[#0f0906] border border-[#d49a3d]/20 py-2.5 px-4 rounded-xl w-fit shadow-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d49a3d]" />
            <span>{language === "hi" ? "सारथी आपकी दुविधा पर विचार कर रहे हैं..." : "Charioteer is contemplating your dilemma..."}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/25 border border-red-900/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Preset Dilemma Selectors */}
      <div className="px-4 py-2 border-t border-[#d49a3d]/10 bg-[#0f0906]/30">
        <span className="text-[10px] font-mono text-[#e8dcc4]/50 uppercase tracking-wider block mb-1.5">{language === "hi" ? "सामान्य दुविधाएँ:" : "Common Dilemmas:"}</span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {currentPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDilemma(preset.text);
                submitDilemma(preset.text);
              }}
              className="px-2.5 py-1 rounded bg-[#140d0a] hover:bg-[#140d0a]/80 border border-[#d49a3d]/15 text-[11px] text-[#e8dcc4]/95 hover:text-[#e8dcc4] transition-colors cursor-pointer text-left font-serif max-w-full truncate"
              disabled={loading}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitDilemma(dilemma);
        }}
        className="p-3 bg-[#0f0906]/80 border-t border-[#d49a3d]/20 flex gap-2"
      >
        <input
          type="text"
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          placeholder={language === "hi" ? "अपनी दुविधा, भय या प्रश्न यहाँ लिखें..." : "Type your current dilemma, fear, or question here..."}
          className="flex-1 bg-[#140d0a] border border-[#d49a3d]/10 focus:border-[#d49a3d]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#e8dcc4] outline-none transition-all placeholder-[#e8dcc4]/30 font-sans"
          disabled={loading}
          id="dilemma-text-input"
        />
        <button
          type="submit"
          className="p-3 bg-[#d49a3d] hover:bg-[#c08731] text-[#0f0906] rounded-xl transition-all font-semibold active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md shadow-[#d49a3d]/10"
          disabled={loading || !dilemma.trim()}
          id="submit-dilemma-btn"
        >
          <Send size={16} fill="currentColor" />
        </button>
      </form>
    </div>
  );
};
