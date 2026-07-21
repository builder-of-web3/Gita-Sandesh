import React, { useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldAlert } from "lucide-react";

interface BattlefieldTheaterProps {
  theme: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  playbackRate: number;
  onRateChange: (rate: number) => void;
  currentSentence: string;
  progress: number; // 0 to 100
  chapterTitle: string;
  chapterNumber: number;
  language?: "en" | "hi";
  customVisualCue?: string;
}

const devanagariNumeralsLocal = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const toDevanagariLocal = (num: number) => {
  return num
    .toString()
    .split("")
    .map((digit) => devanagariNumeralsLocal[parseInt(digit)] || digit)
    .join("");
};

export const BattlefieldTheater: React.FC<BattlefieldTheaterProps> = ({
  theme,
  isPlaying,
  onPlayPause,
  onReset,
  isMuted,
  onToggleMute,
  playbackRate,
  onRateChange,
  currentSentence,
  progress,
  chapterTitle,
  chapterNumber,
  language = "en",
  customVisualCue = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const activeVisualMode = customVisualCue || theme;

    // Particle class for diverse spiritual animations
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      decay: number;
      angle: number;
      velocity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = "#FFD700"; // Default Gold
        this.alpha = Math.random() * 0.5 + 0.3;
        this.decay = Math.random() * 0.005 + 0.002;
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * width;
        this.y =
          activeVisualMode === "final_liberation" ||
          activeVisualMode === "glowing_knowledge" ||
          activeVisualMode === "glowing_aura" ||
          activeVisualMode === "golden_victory"
            ? height + 10
            : Math.random() * height;
        if (activeVisualMode === "vishwaroopam" || activeVisualMode === "cosmic_vortex") {
          // Spawn in center for whirlpool effect
          this.x = width / 2 + (Math.random() * 40 - 20);
          this.y = height / 2 + (Math.random() * 40 - 20);
        }
        this.size = Math.random() * 4 + 1;
        this.alpha = Math.random() * 0.5 + 0.4;
        this.angle = Math.random() * Math.PI * 2;
      }

      update(activeTheme: string) {
        // Theme specific behaviors
        if (activeTheme === "vishwaroopam" || activeTheme === "cosmic_vortex") {
          // Orbital rotation around center
          const dx = this.x - width / 2;
          const dy = this.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          this.angle += 0.01 + (150 / (dist + 50)) * 0.01;
          this.x = width / 2 + Math.cos(this.angle) * (dist + 0.2);
          this.y = height / 2 + Math.sin(this.angle) * (dist + 0.2);
          if (dist > width * 0.6) this.reset();
        } else if (
          activeTheme === "final_liberation" ||
          activeTheme === "glowing_knowledge" ||
          activeTheme === "bhakti_devotion" ||
          activeTheme === "chariot_wisdom" ||
          activeTheme === "divine_dawn" ||
          activeTheme === "glowing_aura" ||
          activeTheme === "golden_victory"
        ) {
          // Floating upwards
          this.y -= this.velocity * 1.5;
          this.x += Math.sin(this.angle) * 0.3;
          this.angle += 0.02;
          if (this.y < -10) this.reset();
        } else if (activeTheme === "battlefield_grief" || activeTheme === "grief_storm") {
          // Dust storm moving left to right
          this.x += this.velocity * 1.2;
          this.y += Math.sin(this.angle) * 0.2;
          if (this.x > width + 10) this.reset();
        } else if (activeTheme === "action_duty" || activeTheme === "sacred_fire") {
          // Fire rising upwards rapidly
          this.y -= this.velocity * 2.2;
          this.x += Math.sin(this.angle) * 0.5;
          this.angle += 0.04;
          if (this.y < -10) this.reset();
        } else {
          // Calm drift
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
          }
        }
        this.alpha -= this.decay;
        if (this.alpha <= 0) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur =
          activeVisualMode === "vishwaroopam" ||
          activeVisualMode === "cosmic_vortex" ||
          activeVisualMode === "glowing_knowledge" ||
          activeVisualMode === "glowing_aura"
            ? 10
            : 0;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 140; // slightly denser for richer effect
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Audio Waveform parameters
    let waveOffset = 0;

    // Main animation loop
    const render = () => {
      // 1. Draw Background Gradients based on Chapter Theme / Custom Cue
      let bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      switch (activeVisualMode) {
        case "grief_storm":
        case "battlefield_grief":
          // Heavy dark crimson, slate ash sky
          bgGradient.addColorStop(0, "#1a1212");
          bgGradient.addColorStop(0.5, "#2a1c1c");
          bgGradient.addColorStop(1, "#140c0c");
          break;
        case "divine_dawn":
        case "chariot_wisdom":
          // Golden dawn of spiritual teachings
          bgGradient.addColorStop(0, "#1e1b4b");
          bgGradient.addColorStop(0.6, "#78350f");
          bgGradient.addColorStop(1, "#140d0a");
          break;
        case "sacred_fire":
        case "action_duty":
          // Fire, energy, dynamic action
          bgGradient.addColorStop(0, "#2a0800");
          bgGradient.addColorStop(0.5, "#7c2d12");
          bgGradient.addColorStop(1, "#170500");
          break;
        case "glowing_aura":
        case "glowing_knowledge":
          // Brilliant white-gold light breaking darkness
          bgGradient.addColorStop(0, "#0c0a09");
          bgGradient.addColorStop(0.5, "#451a03");
          bgGradient.addColorStop(1, "#0a0706");
          break;
        case "calm_lotus":
        case "inner_renunciation":
          // Serene teal water reflection
          bgGradient.addColorStop(0, "#022c22");
          bgGradient.addColorStop(0.7, "#064e3b");
          bgGradient.addColorStop(1, "#021c15");
          break;
        case "meditation_peace":
          // Indigo, spiritual deep focus
          bgGradient.addColorStop(0, "#1e1b4b");
          bgGradient.addColorStop(0.5, "#311042");
          bgGradient.addColorStop(1, "#090514");
          break;
        case "cosmic_vortex":
        case "vishwaroopam":
          // Infinite cosmic vortex deep purple/navy
          bgGradient.addColorStop(0, "#03001e");
          bgGradient.addColorStop(0.5, "#7303c0");
          bgGradient.addColorStop(1, "#ec38bc");
          bgGradient.addColorStop(1, "#03001e");
          break;
        case "golden_victory":
        case "final_liberation":
        case "bhakti_devotion":
          // Golden sunrise of absolute victory and peace
          bgGradient.addColorStop(0, "#1c1917");
          bgGradient.addColorStop(0.4, "#f59e0b");
          bgGradient.addColorStop(0.8, "#b45309");
          bgGradient.addColorStop(1, "#110b07");
          break;
        default:
          bgGradient.addColorStop(0, "#090d16");
          bgGradient.addColorStop(1, "#04060b");
      }

      ctx.fillStyle = bgGradient;

      // Subtle screen shake for grief_storm theme for dramatic visual impact
      if (activeVisualMode === "grief_storm") {
        ctx.save();
        const shakeX = Math.sin(waveOffset * 3) * 1.5;
        const shakeY = Math.cos(waveOffset * 2) * 1.5;
        ctx.translate(shakeX, shakeY);
      }

      ctx.fillRect(0, 0, width, height);

      // 2. Render Cosmic Portal/Emanations in specific themes
      if (activeVisualMode === "vishwaroopam" || activeVisualMode === "cosmic_vortex") {
        // Draw rotating spiral galaxy behind the silhouette
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(waveOffset * 0.02);
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.45);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.15, "rgba(253, 224, 71, 0.8)");
        grad.addColorStop(0.4, "rgba(236, 72, 153, 0.45)");
        grad.addColorStop(0.7, "rgba(147, 51, 234, 0.15)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (
        activeVisualMode === "chariot_wisdom" ||
        activeVisualMode === "glowing_knowledge" ||
        activeVisualMode === "divine_dawn" ||
        activeVisualMode === "glowing_aura"
      ) {
        // Radiant halo in the center
        const haloGrad = ctx.createRadialGradient(width / 2, height / 2 - 30, 5, width / 2, height / 2 - 30, 220);
        haloGrad.addColorStop(0, "rgba(254, 240, 138, 0.85)");
        haloGrad.addColorStop(0.4, "rgba(217, 119, 6, 0.35)");
        haloGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 30, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & Draw Particles
      particles.forEach((p) => {
        // Adjust particle colors to match theme
        if (activeVisualMode === "vishwaroopam" || activeVisualMode === "cosmic_vortex") {
          p.color = Math.random() > 0.5 ? "#f472b6" : "#c084fc"; // Pink/Purple cosmic stars
        } else if (activeVisualMode === "inner_renunciation" || activeVisualMode === "calm_lotus") {
          p.color = "#34d399"; // Emerald lotus drops
        } else if (activeVisualMode === "action_duty" || activeVisualMode === "sacred_fire") {
          p.color = Math.random() > 0.4 ? "#f97316" : "#ef4444"; // Fiery orange/red sparks
        } else if (activeVisualMode === "battlefield_grief" || activeVisualMode === "grief_storm") {
          p.color = Math.random() > 0.3 ? "#ef4444" : "#78716c"; // Red embers and ash dust
        } else if (activeVisualMode === "golden_victory") {
          p.color = "#fef08a"; // Bright gold shining sparkles
        } else {
          p.color = "#fef08a"; // Pure gold light
        }
        p.update(activeVisualMode);
        p.draw();
      });

      // Special overlay animations based on customVisualCue
      if (activeVisualMode === "grief_storm") {
        // Draw falling rain/ash dashes
        ctx.save();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
        ctx.lineWidth = 1;
        for (let r = 0; r < 25; r++) {
          const rx = (Math.sin(waveOffset + r) * 0.5 + 0.5) * width;
          const ry = ((waveOffset * 3 + r * 20) % height);
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx + 5, ry + 15);
          ctx.stroke();
        }
        ctx.restore();
      } else if (activeVisualMode === "sacred_fire") {
        // Pulse background aura
        ctx.save();
        const pulse = Math.sin(waveOffset * 1.5) * 0.15 + 0.85;
        const fireGrad = ctx.createRadialGradient(width / 2, height - 20, 10, width / 2, height - 20, 150 * pulse);
        fireGrad.addColorStop(0, "rgba(249, 115, 22, 0.4)");
        fireGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.15)");
        fireGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height - 20, 150 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (activeVisualMode === "glowing_aura") {
        // Expand golden concentric rings representing aura emanations
        ctx.save();
        ctx.strokeStyle = "rgba(254, 240, 138, 0.15)";
        ctx.lineWidth = 1.5;
        const ringRad = ((waveOffset * 15) % 180) + 20;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 30, ringRad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (activeVisualMode === "calm_lotus") {
        // Drifting horizontal ripples
        ctx.save();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.25)";
        ctx.lineWidth = 1;
        const rippleFactor = Math.sin(waveOffset * 0.5) * 5;
        for (let l = 1; l <= 2; l++) {
          ctx.beginPath();
          ctx.ellipse(width / 2, height - 50, 80 * l + rippleFactor, 15 * l, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. Render Dynamic SVG Silhouettes (Chariot, Lord Krishna, Arjuna)
      ctx.save();
      ctx.globalAlpha = 0.85;

      if (activeVisualMode === "vishwaroopam" || activeVisualMode === "cosmic_vortex") {
        // Draw majestic cosmic multi-armed deity silhouette in the center
        ctx.fillStyle = "#0c0415";
        ctx.strokeStyle = "rgba(253, 224, 71, 0.6)";
        ctx.lineWidth = 1.5;

        // Multiple arms
        const scale = height / 400;
        ctx.translate(width / 2, height / 2 + 50);
        ctx.scale(scale, scale);

        // Render many arms in background first
        ctx.fillStyle = "#150824";
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          ctx.save();
          ctx.rotate((i * Math.PI) / 10 + Math.sin(waveOffset * 0.05 + i) * 0.03); // gentle swaying of cosmic arms
          ctx.beginPath();
          // Abstract arm paths
          ctx.ellipse(0, -60, 15, 80, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Draw central cosmic body
        ctx.fillStyle = "#0a0312";
        ctx.beginPath();
        // Head
        ctx.arc(0, -140, 30, 0, Math.PI * 2);
        // Torso & legs (meditating lotus position)
        ctx.moveTo(-20, -110);
        ctx.lineTo(20, -110);
        ctx.lineTo(30, -20);
        ctx.lineTo(80, 10);
        ctx.lineTo(40, 30);
        ctx.lineTo(-40, 30);
        ctx.lineTo(-80, 10);
        ctx.lineTo(-30, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing crown
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(0, -190);
        ctx.lineTo(15, -165);
        ctx.lineTo(25, -175);
        ctx.lineTo(10, -155);
        ctx.lineTo(-10, -155);
        ctx.lineTo(-25, -175);
        ctx.lineTo(-15, -165);
        ctx.closePath();
        ctx.fill();

      } else if (activeVisualMode === "inner_renunciation" || activeVisualMode === "calm_lotus") {
        // Draw Lotus & water ripples
        ctx.translate(width / 2, height / 2 + 40);
        ctx.fillStyle = "#022c22";
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;

        // Ripples
        ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.ellipse(0, 50, 40 * r, 12 * r, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Beautiful lotus petals
        ctx.fillStyle = "#043f2e";
        ctx.strokeStyle = "#10b981";
        ctx.beginPath();
        // Central petal
        ctx.moveTo(0, -60);
        ctx.quadraticCurveTo(20, -20, 0, 30);
        ctx.quadraticCurveTo(-20, -20, 0, -60);
        // Left petals
        ctx.moveTo(0, 10);
        ctx.quadraticCurveTo(-40, -30, -50, -10);
        ctx.quadraticCurveTo(-20, 20, 0, 30);
        // Right petals
        ctx.moveTo(0, 10);
        ctx.quadraticCurveTo(40, -30, 50, -10);
        ctx.quadraticCurveTo(20, 20, 0, 30);
        ctx.fill();
        ctx.stroke();
      } else {
        // DEFAULT: Golden Chariot Silhouette of Kurukshetra (Krishna guiding Arjuna)
        const scale = height / 450;
        ctx.translate(width / 2 - 120 * scale, height - 20);
        ctx.scale(scale, scale);

        // Draw ground line
        ctx.fillStyle = "#1c1917";
        ctx.fillRect(-width, 0, width * 3, 100);

        // 1. Chariot outline
        ctx.fillStyle = "#0c0a09";
        ctx.strokeStyle = "#ca8a04";
        ctx.lineWidth = 2;

        // Wheel
        ctx.beginPath();
        ctx.arc(80, -40, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Wheel spokes
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          ctx.moveTo(80, -40);
          ctx.lineTo(80 + Math.cos(a) * 40, -40 + Math.sin(a) * 40);
        }
        ctx.stroke();

        // Chariot Body & Canopy
        ctx.beginPath();
        ctx.moveTo(10, -50);
        ctx.lineTo(150, -50);
        ctx.lineTo(130, -110);
        ctx.quadraticCurveTo(150, -130, 120, -150); // back dome
        ctx.lineTo(40, -150);
        ctx.lineTo(10, -50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Banner Pole & Flag
        ctx.beginPath();
        ctx.moveTo(130, -110);
        ctx.lineTo(130, -240);
        ctx.lineTo(200, -220);
        ctx.lineTo(130, -200);
        ctx.stroke();
        ctx.fillStyle = "#b45309";
        ctx.beginPath();
        ctx.moveTo(130, -240);
        ctx.lineTo(200, -220);
        ctx.lineTo(130, -200);
        ctx.closePath();
        ctx.fill();

        // 2. Lord Krishna Silhouette (Standing in front, holding reins/hand pointing)
        ctx.fillStyle = "#0c0a09";
        ctx.beginPath();
        // Head with crown
        ctx.arc(95, -125, 12, 0, Math.PI * 2);
        ctx.fill();
        // Crown tip
        ctx.beginPath();
        ctx.moveTo(90, -136);
        ctx.lineTo(95, -152);
        ctx.lineTo(100, -136);
        ctx.closePath();
        ctx.fillStyle = "#facc15";
        ctx.fill();

        // Krishna Body
        ctx.fillStyle = "#0c0a09";
        ctx.beginPath();
        ctx.moveTo(85, -113);
        ctx.lineTo(105, -113);
        ctx.lineTo(110, -60);
        ctx.lineTo(80, -60);
        ctx.closePath();
        ctx.fill();
        // Pointing arm (Dharma Upadesh)
        ctx.strokeStyle = "#0c0a09";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(100, -100);
        ctx.lineTo(135, -105);
        ctx.lineTo(150, -120); // pointing fingers up
        ctx.stroke();

        // 3. Arjuna Silhouette (Kneeling/sitting in back of chariot, dejected or praying)
        ctx.fillStyle = "#1e293b";
        // Arjuna Head
        ctx.beginPath();
        ctx.arc(45, -100, 10, 0, Math.PI * 2);
        ctx.fill();
        // Arjuna Body (Kneeling)
        ctx.beginPath();
        ctx.moveTo(35, -90);
        ctx.lineTo(55, -90);
        ctx.lineTo(60, -50);
        ctx.lineTo(20, -50);
        ctx.closePath();
        ctx.fill();

        // Dropped Bow (Gandiva) on floor
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-15, -15, 30, Math.PI * 0.25, Math.PI * 0.85);
        ctx.stroke();
      }

      ctx.restore();

      // Shake restorer
      if (activeVisualMode === "grief_storm") {
        ctx.restore();
      }

      // 5. Draw Animated Audio Waveform at bottom when playing
      if (isPlaying) {
        ctx.save();
        ctx.strokeStyle = "rgba(254, 240, 138, 0.85)"; // Golden yellow glow
        ctx.lineWidth = 3;
        ctx.beginPath();
        waveOffset += 0.15;

        // Draw multiple beautiful sine waves overlaying each other
        for (let w = 0; w < 3; w++) {
          ctx.beginPath();
          ctx.strokeStyle =
            w === 0
              ? "rgba(254, 240, 138, 0.85)"
              : w === 1
              ? "rgba(245, 158, 11, 0.5)"
              : "rgba(236, 72, 153, 0.3)";
          ctx.lineWidth = w === 0 ? 3 : 1.5;
          const amp = 15 + w * 10;
          const speed = waveOffset * (1 - w * 0.2);

          for (let x = 0; x < width; x++) {
            const y =
              height - 50 + Math.sin(x * 0.015 + speed) * amp * Math.sin((x * Math.PI) / width);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // Loop animation
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, isPlaying, customVisualCue]);

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[450px] bg-[#0f0906] rounded-2xl overflow-hidden border border-[#d49a3d]/25 shadow-2xl shadow-black flex flex-col justify-between" id="battlefield-visualizer-theater">
      
      {/* 1. Header overlay containing metadata */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-[#0f0906]/95 to-transparent flex justify-between items-center z-10 pointer-events-none">
        <div>
          <span className="text-xs font-mono text-[#d49a3d] font-semibold tracking-wider uppercase block">
            {language === "hi" ? `अध्याय ${toDevanagariLocal(chapterNumber)}` : `Chapter ${chapterNumber < 10 ? `0${chapterNumber}` : chapterNumber}`}
          </span>
          <h2 className="text-lg md:text-xl font-serif text-[#e8dcc4] font-medium tracking-tight">
            {chapterTitle}
          </h2>
        </div>
        <div className="bg-[#140d0a]/90 border border-[#d49a3d]/30 px-3 py-1 rounded-full text-[10px] font-mono text-[#d49a3d] font-semibold uppercase flex items-center gap-1.5 backdrop-blur-sm shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#d49a3d] animate-pulse" />
          {isPlaying 
            ? (language === "hi" ? "दिव्य कथा-वाचन सक्रिय" : "Divine Narration Playing") 
            : (language === "hi" ? "ज्ञान थियेटर" : "Wisdom Theater")}
        </div>
      </div>

      {/* 2. Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" onClick={onPlayPause} />

      {/* 3. Subtitles/Script Overlay below canvas */}
      <div className="absolute bottom-16 left-4 right-4 bg-[#0f0906]/95 backdrop-blur-md border border-[#d49a3d]/20 p-3.5 rounded-xl text-center z-10 transition-all duration-500 max-h-20 overflow-y-auto shadow-lg flex items-center justify-center">
        <p className="text-xs sm:text-sm font-serif text-[#e8dcc4] leading-relaxed font-medium italic">
          {currentSentence || (language === "hi" ? "अध्याय चुनें या दिव्य प्रवचन सुनने के लिए प्ले बटन दबाएं..." : "Select a chapter or press Play to listen to the divine discourse...")}
        </p>
      </div>

      {/* 4. Audio Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#140d0a] border-t border-[#d49a3d]/25 px-4 flex items-center justify-between gap-4 z-10 backdrop-blur-sm">
        
        {/* Playback Progress */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0f0906]">
          <div
            className="h-full bg-[#d49a3d] shadow-md transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#e8dcc4] border border-[#d49a3d] shadow-sm" />
          </div>
        </div>

        {/* Narrator controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="p-2.5 rounded-full bg-[#d49a3d] hover:bg-[#c08731] text-[#0f0906] transition-all shadow-md active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause Narration" : "Play Narration"}
            id="control-play-pause-btn"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          
          <button
            onClick={onReset}
            className="p-2 rounded-full hover:bg-[#d49a3d]/10 text-[#e8dcc4]/50 hover:text-[#d49a3d] transition-colors cursor-pointer"
            title="Restart Narrative"
            id="control-restart-btn"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Speed adjustment */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#e8dcc4]/50 uppercase hidden sm:inline tracking-wider">
            {language === "hi" ? "वाचन गति" : "Narrator Speed"}
          </span>
          <div className="flex bg-[#0f0906] p-0.5 rounded-lg border border-[#d49a3d]/10">
            {[0.8, 1.0, 1.2, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => onRateChange(rate)}
                className={`px-2 py-1 text-[10px] font-mono rounded font-semibold transition-all cursor-pointer ${
                  playbackRate === rate
                    ? "bg-[#d49a3d]/20 text-[#d49a3d] border border-[#d49a3d]/30"
                    : "text-[#e8dcc4]/50 hover:text-[#e8dcc4]"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Mute toggle / Voice status */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isMuted ? "text-red-400 hover:bg-red-950/30" : "text-[#e8dcc4]/50 hover:text-[#d49a3d] hover:bg-[#d49a3d]/10"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
            id="control-mute-btn"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

      </div>
    </div>
  );
};
