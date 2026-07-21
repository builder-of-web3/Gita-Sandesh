import { useState, useEffect, useRef } from "react";
import { gitaChapters, Chapter } from "./gitaData";
import { gitaChaptersHindi } from "./gitaDataHindi";
import { BattlefieldTheater } from "./components/BattlefieldTheater";
import { DivineAdvisor } from "./components/DivineAdvisor";
import {
  BookOpen,
  Search,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Music,
  Compass,
  ArrowRight,
  Flame,
  Volume2,
  ListRestart
} from "lucide-react";

const devanagariNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toDevanagari = (num: number) => {
  return num
    .toString()
    .split("")
    .map((digit) => devanagariNumerals[parseInt(digit)] || digit)
    .join("");
};

export default function App() {
  const [selectedIdx, setSelectedIdx] = useState<number>(1); // Default to Chapter 2: Sankhya Yoga (wisdom start)
  const [activeTab, setActiveTab] = useState<"wisdom" | "verses" | "dialogue">("wisdom");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");

  // Audio / Speech state for Chapter Storytelling Narrative
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentSentence, setCurrentSentence] = useState("");
  const [progress, setProgress] = useState(0);

  const activeChapter = language === "hi"
    ? { ...gitaChaptersHindi[selectedIdx], visualTheme: gitaChapters[selectedIdx].visualTheme }
    : gitaChapters[selectedIdx];

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split narrative into sentences for real-time highlighting
  const sentences = activeChapter.narrativeSummary.match(/[^.!?]+[.!?]+(\s+|$)/g) || [
    activeChapter.narrativeSummary
  ];

  // Keep track of characters mapping
  const sentenceRanges = useRef<{ start: number; end: number; text: string }[]>([]);

  // Localized Labels
  const t = {
    title: language === "hi" ? "गीता संदेश" : "Gita Sandesh",
    subtitle: language === "hi" ? "दिव्य कथा-वाचन एवं आध्यात्मिक मार्गदर्शक" : "Divine Audio-Storytelling & Spiritual Advisor",
    chaptersHeader: language === "hi" ? "१८ दिव्य अध्याय" : "18 Divine Chapters",
    plains: language === "hi" ? "कुरुक्षेत्र मैदान" : "Kurukshetra Plains",
    searchPlaceholder: language === "hi" ? "अध्याय, कर्म, ज्ञान खोजें..." : "Search Karma, Wisdom, Chapter...",
    noChapters: language === "hi" ? "कोई आध्यात्मिक अध्याय नहीं मिला।" : "No matching spiritual chapters found.",
    tabWisdom: language === "hi" ? "अध्याय का ज्ञान और शिक्षाएँ" : "Chapter Wisdom & Lessons",
    tabVerses: language === "hi" ? "विशेष श्लोक (Shloka)" : "Featured Verses (Shloka)",
    tabDialogue: language === "hi" ? "श्री कृष्ण से पूछें" : "Ask Lord Krishna",
    sacredNarrative: language === "hi" ? "पवित्र कथा उपदेश" : "Sacred Narrative Discourses",
    modernLifeTranslate: language === "hi" ? "आधुनिक जीवन में इसका महत्व" : "How It Translates to Modern Life",
    featuredTeaching: language === "hi" ? "विशेष उपदेश" : "Featured Teaching",
    gitaVerse: language === "hi" ? "गीता श्लोक" : "Gita Verse",
    explorer: language === "hi" ? "श्लोक अन्वेषक" : "Shloka Explorer",
    translation: language === "hi" ? "अनुवाद" : "Translation",
    context: language === "hi" ? "आध्‍यात्‍मिक संदर्भ" : "Spiritual Context",
    footerText: language === "hi"
      ? "श्रीमद्भगवद्गीता का ज्ञान शाश्वत है। शांति से जिएं, अपना कर्तव्य निभाएं, प्रेम में समर्पित रहें।"
      : "SHRI MADBHAGAVAD GITA wisdom is timeless. Live in peace, perform your duty, surrendered in love.",
  };

  useEffect(() => {
    // Build character ranges for the current chapter's sentences
    let cumulativeLength = 0;
    sentenceRanges.current = sentences.map((s) => {
      const start = cumulativeLength;
      const end = cumulativeLength + s.length;
      cumulativeLength = end;
      return { start, end, text: s.trim() };
    });

    // Reset speech states on chapter or language change
    stopNarration();
    setCurrentSentence(sentences[0]?.trim() || "");
    setProgress(0);
  }, [selectedIdx, language]);

  // Handle Speech boundary event to highlight sentences
  const handleBoundary = (event: SpeechSynthesisEvent) => {
    if (event.name !== "word" && event.name !== "sentence") return;
    
    const charIndex = event.charIndex;
    const totalLength = activeChapter.narrativeSummary.length;

    // Set percentage progress
    setProgress(Math.min(100, Math.round((charIndex / totalLength) * 100)));

    // Find the current sentence
    const matchingRange = sentenceRanges.current.find(
      (range) => charIndex >= range.start && charIndex <= range.end
    );

    if (matchingRange) {
      setCurrentSentence(matchingRange.text);
    }
  };

  const startNarration = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in your browser.");
      return;
    }

    // If already speaking, pause/resume
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      }
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = activeChapter.narrativeSummary;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : 1;
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";

    // Find custom serene storytelling voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language === "hi" ? "hi" : "en";
    const desiredVoice = voices.find(
      (v) =>
        v.lang.startsWith(langPrefix) ||
        (language === "hi" && v.name.includes("Hindi")) ||
        (language === "en" && (v.name.includes("Google US English") || v.name.includes("Natural")))
    );
    if (desiredVoice) utterance.voice = desiredVoice;

    utterance.onboundary = handleBoundary;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentSentence(sentences[sentences.length - 1]?.trim() || "");
    };

    utterance.onerror = (err) => {
      console.error("Speech Synthesis error:", err);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = () => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setProgress(0);
    setCurrentSentence(sentences[0]?.trim() || "");
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (utteranceRef.current) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(activeChapter.narrativeSummary);
          utterance.rate = playbackRate;
          utterance.volume = nextMuted ? 0 : 1;
          utterance.lang = language === "hi" ? "hi-IN" : "en-US";
          utterance.onboundary = handleBoundary;
          utterance.onend = () => setIsPlaying(false);
          utteranceRef.current = utterance;
          setIsPlaying(true);
          window.speechSynthesis.speak(utterance);
        }, 100);
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(activeChapter.narrativeSummary);
        utterance.rate = rate;
        utterance.volume = isMuted ? 0 : 1;
        utterance.lang = language === "hi" ? "hi-IN" : "en-US";
        utterance.onboundary = handleBoundary;
        utterance.onend = () => setIsPlaying(false);
        utteranceRef.current = utterance;
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Filter Chapters based on Search
  const currentChaptersDataset = language === "hi" ? gitaChaptersHindi : gitaChapters;
  const filteredChapters = currentChaptersDataset.filter((chap) => {
    const q = searchQuery.toLowerCase();
    const title = "englishTitle" in chap ? chap.englishTitle : chap.hindiTitle;
    return (
      chap.sanskritName.toLowerCase().includes(q) ||
      title.toLowerCase().includes(q) ||
      chap.narrativeSummary.toLowerCase().includes(q) ||
      chap.number.toString().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0f0906] text-[#e8dcc4] font-serif flex flex-col antialiased selection:bg-[#d49a3d] selection:text-[#0f0906] relative">
      
      {/* Dynamic Background Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#d49a3d 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* 1. Golden Temple Header with Artistic Flair theme */}
      <header className="bg-[#0f0906]/95 border-b border-[#d49a3d]/20 py-4 px-6 sticky top-0 z-40 backdrop-blur-md shadow-lg" id="main-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#d49a3d] rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(212,154,61,0.15)] bg-[#d49a3d]/5">
              <span className="-rotate-45 font-bold text-lg text-[#d49a3d]">ॐ</span>
            </div>
            <div>
              <h1 className="text-xl tracking-[0.15em] uppercase font-serif font-light text-[#d49a3d] leading-none">
                {t.title}
              </h1>
              <span className="text-[10px] font-mono text-[#e8dcc4]/50 font-semibold uppercase tracking-widest block mt-1.5">
                {t.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex bg-[#140d0a] border border-[#d49a3d]/30 rounded-xl p-0.5">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-xs rounded-lg font-serif transition-all cursor-pointer font-semibold ${
                  language === "en"
                    ? "bg-[#d49a3d] text-[#0f0906] font-bold"
                    : "text-[#e8dcc4]/50 hover:text-[#e8dcc4]"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-3 py-1.5 text-xs rounded-lg font-serif transition-all cursor-pointer font-semibold ${
                  language === "hi"
                    ? "bg-[#d49a3d] text-[#0f0906] font-bold"
                    : "text-[#e8dcc4]/50 hover:text-[#e8dcc4]"
                }`}
              >
                हिन्दी
              </button>
            </div>

            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#d49a3d]/60 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-[#140d0a] border border-[#d49a3d]/20 rounded-full py-1.5 pl-9 pr-4 text-xs text-[#e8dcc4] placeholder-[#e8dcc4]/30 outline-none focus:border-[#d49a3d]/60 focus:ring-1 focus:ring-[#d49a3d]/15 transition-all font-sans"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT COLUMN: CHAPTER SELECTOR LIST (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col bg-[#140d0a] border border-[#d49a3d]/20 rounded-2xl p-4 overflow-hidden shadow-xl" id="chapter-list-sidebar">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#d49a3d]/10">
            <h3 className="text-xs font-serif text-[#e8dcc4]/60 uppercase tracking-widest flex items-center gap-1.5 font-semibold">
              <Compass size={13} className="text-[#d49a3d]" />
              {t.chaptersHeader} ({filteredChapters.length})
            </h3>
            <span className="text-[10px] font-mono text-[#d49a3d] bg-[#d49a3d]/10 border border-[#d49a3d]/20 px-2.5 py-0.5 rounded">
              {t.plains}
            </span>
          </div>

          {/* List scroll panel */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[350px] lg:max-h-[640px] pr-1 scrollbar-thin scrollbar-thumb-[#d49a3d]/10 scrollbar-track-transparent">
            {filteredChapters.map((chap) => {
              const isActive = gitaChapters[selectedIdx].number === chap.number;
              return (
                <button
                  key={chap.number}
                  onClick={() => {
                    const originalIdx = gitaChapters.findIndex((c) => c.number === chap.number);
                    setSelectedIdx(originalIdx);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 group relative cursor-pointer ${
                    isActive
                      ? "bg-[#d49a3d]/10 border-[#d49a3d] shadow-md shadow-[#d49a3d]/5 text-[#e8dcc4]"
                      : "bg-[#0f0906]/45 hover:bg-[#0f0906] border-white/5 text-[#e8dcc4]/70 hover:text-[#e8dcc4]"
                  }`}
                  id={`chapter-select-btn-${chap.number}`}
                >
                  {/* Visual Aura Halo Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#d49a3d] rounded-r-full" />
                  )}

                  {/* Chapter number circle */}
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-serif text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? "bg-[#d49a3d] text-[#0f0906] border-[#d49a3d] shadow-md"
                        : "bg-transparent text-[#e8dcc4]/50 border-white/10 group-hover:border-[#d49a3d]/40 group-hover:text-[#d49a3d]"
                    }`}
                  >
                    {language === "hi" ? toDevanagari(chap.number) : (chap.number < 10 ? `0${chap.number}` : chap.number)}
                  </div>

                  {/* Chapter descriptions */}
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono text-[#d49a3d] font-semibold block uppercase tracking-wider">
                      {chap.sanskritName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-serif font-medium truncate">
                      {"englishTitle" in chap ? (chap as any).englishTitle : (chap as any).hindiTitle}
                    </h4>
                  </div>

                  <ArrowRight
                    size={13}
                    className={`text-[#e8dcc4]/30 transition-all group-hover:translate-x-1 shrink-0 ${
                      isActive ? "text-[#d49a3d]" : ""
                    }`}
                  />
                </button>
              );
            })}

            {filteredChapters.length === 0 && (
              <div className="text-center py-10 text-[#e8dcc4]/40 text-xs font-mono bg-[#0f0906]/40 border border-[#d49a3d]/10 rounded-xl">
                {t.noChapters}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MULTIMEDIA THEATER & DETAILS (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="multimedia-narrative-workspace">
          
          {/* A. Battlefield Theater Player Card */}
          <BattlefieldTheater
            theme={activeChapter.visualTheme}
            isPlaying={isPlaying}
            onPlayPause={startNarration}
            onReset={stopNarration}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            playbackRate={playbackRate}
            onRateChange={handleRateChange}
            currentSentence={currentSentence}
            progress={progress}
            chapterTitle={"englishTitle" in activeChapter ? (activeChapter as any).englishTitle : (activeChapter as any).hindiTitle}
            chapterNumber={activeChapter.number}
            language={language}
          />

          {/* B. Navigation Tabs for deep content */}
          <div className="flex bg-[#140d0a] p-1.5 rounded-xl border border-[#d49a3d]/25 shadow-md">
            <button
              onClick={() => setActiveTab("wisdom")}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-serif font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "wisdom"
                  ? "bg-[#d49a3d] text-[#0f0906] font-bold shadow-inner"
                  : "text-[#e8dcc4]/60 hover:text-[#e8dcc4] hover:bg-[#d49a3d]/5"
              }`}
              id="tab-wisdom-btn"
            >
              <Lightbulb size={14} />
              {t.tabWisdom}
            </button>
            <button
              onClick={() => setActiveTab("verses")}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-serif font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "verses"
                  ? "bg-[#d49a3d] text-[#0f0906] font-bold shadow-inner"
                  : "text-[#e8dcc4]/60 hover:text-[#e8dcc4] hover:bg-[#d49a3d]/5"
              }`}
              id="tab-verses-btn"
            >
              <BookOpen size={14} />
              {t.tabVerses}
            </button>
            <button
              onClick={() => setActiveTab("dialogue")}
              className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-serif font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "dialogue"
                  ? "bg-[#d49a3d] text-[#0f0906] font-bold shadow-inner"
                  : "text-[#e8dcc4]/60 hover:text-[#e8dcc4] hover:bg-[#d49a3d]/5"
              }`}
              id="tab-dialogue-btn"
            >
              <MessageSquare size={14} />
              {t.tabDialogue}
            </button>
          </div>

          {/* C. Dynamic Tab Display panels */}
          <div className="flex-1">
            {activeTab === "wisdom" && (
              <div className="space-y-6 animate-fadeIn" id="content-wisdom-panel">
                {/* Storytelling details */}
                <div className="bg-[#140d0a] border border-[#d49a3d]/20 p-6 rounded-2xl shadow-md relative overflow-hidden">
                  
                  {/* Subtle Sanskrit numeral watermark */}
                  <div className="absolute top-0 right-0 p-8 text-[140px] leading-none font-bold opacity-[0.04] select-none text-[#d49a3d] font-serif pointer-events-none">
                    {toDevanagari(activeChapter.number)}
                  </div>

                  <h3 className="text-xs font-mono text-[#d49a3d] uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                    <Music size={14} />
                    {t.sacredNarrative}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#e8dcc4]/90 leading-relaxed font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-[#d49a3d] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {activeChapter.narrativeSummary}
                  </p>
                </div>

                {/* Modern life application bento box */}
                <div>
                  <h3 className="text-sm font-serif font-semibold text-[#e8dcc4] mb-3.5 flex items-center gap-2">
                    <Compass className="text-[#d49a3d] w-4 h-4" />
                    {t.modernLifeTranslate}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeChapter.keyLessons.map((lesson, index) => {
                      const parts = lesson.split(":");
                      const title = parts[0];
                      const desc = parts.slice(1).join(":");
                      return (
                        <div
                          key={index}
                          className="bg-[#140d0a]/65 border border-[#d49a3d]/15 p-4 rounded-xl hover:border-[#d49a3d]/40 transition-all flex flex-col justify-between shadow"
                        >
                          <div>
                            <span className="w-6 h-6 rounded-lg bg-[#d49a3d]/10 border border-[#d49a3d]/25 flex items-center justify-center text-[#d49a3d] font-mono text-xs font-bold mb-3">
                              {language === "hi" ? toDevanagari(index + 1) : `0${index + 1}`}
                            </span>
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#e8dcc4] mb-1">
                              {title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-[#e8dcc4]/70 leading-relaxed font-sans">
                              {desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "verses" && (
              <div className="bg-[#140d0a] border border-[#d49a3d]/20 p-6 rounded-2xl shadow-lg space-y-6 animate-fadeIn relative overflow-hidden" id="content-verses-panel">
                
                {/* Subtle Sanskrit numeral watermark */}
                <div className="absolute top-0 right-0 p-8 text-[140px] leading-none font-bold opacity-[0.04] select-none text-[#d49a3d] font-serif pointer-events-none">
                  {toDevanagari(activeChapter.number)}
                </div>

                <div className="flex items-center justify-between border-b border-[#d49a3d]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#d49a3d] font-semibold uppercase tracking-wider">{t.featuredTeaching}</span>
                    <h3 className="text-base font-serif font-medium text-[#e8dcc4]">
                      {t.gitaVerse} {activeChapter.featuredShloka.verseRef}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#d49a3d] border border-[#d49a3d]/25 bg-[#d49a3d]/10 px-3 py-1 rounded-full uppercase font-semibold">
                    {t.explorer}
                  </span>
                </div>

                {/* Sanskrit text scroll */}
                <div className="bg-[#0f0906] p-5 rounded-xl border border-[#d49a3d]/20 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 bg-[#d49a3d]/10 border-l border-b border-[#d49a3d]/20 rounded-bl-lg text-[9px] font-mono text-[#d49a3d] uppercase tracking-wider font-semibold">
                    Devanagari
                  </div>
                  <p className="text-lg md:text-xl font-serif font-bold text-[#e8dcc4] leading-loose py-2 tracking-wide text-center italic">
                    {activeChapter.featuredShloka.sanskrit}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="bg-[#0f0906]/60 p-4 rounded-xl border border-[#d49a3d]/10">
                  <span className="text-[10px] font-mono text-[#e8dcc4]/50 block mb-1 uppercase tracking-wider">Transliteration</span>
                  <p className="text-xs md:text-sm font-mono text-[#e8dcc4]/80 leading-relaxed italic whitespace-pre-line">
                    {activeChapter.featuredShloka.transliteration}
                  </p>
                </div>

                {/* English/Hindi Translation */}
                <div className="bg-[#d49a3d]/5 border-l-4 border-[#d49a3d] p-4 rounded-r-xl">
                  <span className="text-[10px] font-mono text-[#d49a3d] block mb-1 uppercase tracking-wider font-bold">{t.translation}</span>
                  <p className="text-xs sm:text-sm font-serif text-[#e8dcc4] leading-relaxed font-medium">
                    "{activeChapter.featuredShloka.translation}"
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-[#0f0906]/30 p-4 rounded-xl border border-[#d49a3d]/15">
                  <span className="text-[10px] font-mono text-[#e8dcc4]/50 block mb-1.5 uppercase tracking-wider">{t.context}</span>
                  <p className="text-xs sm:text-sm font-sans text-[#e8dcc4]/80 leading-relaxed">
                    {activeChapter.featuredShloka.explanation}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "dialogue" && (
              <div className="animate-fadeIn" id="content-dialogue-panel">
                <DivineAdvisor 
                  currentChapterRef={language === "hi" ? `${activeChapter.number}: ${(activeChapter as any).hindiTitle}` : `${activeChapter.number}: ${(activeChapter as any).englishTitle}`}
                  language={language}
                />
              </div>
            )}
          </div>

        </div>

      </main>

      {/* 3. Footer */}
      <footer className="mt-auto bg-[#0f0906] border-t border-[#d49a3d]/20 py-6 px-6 text-center" id="main-footer">
        <p className="text-[11px] font-mono text-[#e8dcc4]/40 tracking-widest uppercase">
          {t.footerText}
        </p>
      </footer>

    </div>
  );
}

