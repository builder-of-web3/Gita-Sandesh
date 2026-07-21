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
}

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
        this.y = theme === "final_liberation" || theme === "glowing_knowledge" ? height + 10 : Math.random() * height;
        if (theme === "vishwaroopam") {
          // Spawn in center for whirlpool effect
          this.x = width / 2 + (Math.random() * 40 - 20);
          this.y = height / 2 + (Math.random() * 40 - 20);
        }
        this.size = Math.random() * 4 + 1;
        this.alpha = Math.random() * 0.5 + 0.4;
        this.angle = Math.random() * Math.PI * 2;
      }

      update(theme: string) {
        // Theme specific behaviors
        if (theme === "vishwaroopam") {
          // Orbital rotation around center
          const dx = this.x - width / 2;
          const dy = this.y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          this.angle += 0.01 + (150 / (dist + 50)) * 0.01;
          this.x = width / 2 + Math.cos(this.angle) * (dist + 0.2);
          this.y = height / 2 + Math.sin(this.angle) * (dist + 0.2);
          if (dist > width * 0.6) this.reset();
        } else if (theme === "final_liberation" || theme === "glowing_knowledge" || theme === "bhakti_devotion" || theme === "chariot_wisdom") {
          // Floating upwards
          this.y -= this.velocity * 1.5;
          this.x += Math.sin(this.angle) * 0.3;
          this.angle += 0.02;
          if (this.y < -10) this.reset();
        } else if (theme === "battlefield_grief") {
          // Dust storm moving left to right
          this.x += this.velocity * 1.2;
          this.y += Math.sin(this.angle) * 0.2;
          if (this.x > width + 10) this.reset();
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
        ctx.shadowBlur = theme === "vishwaroopam" || theme === "glowing_knowledge" ? 10 : 0;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Audio Waveform parameters
    let waveOffset = 0;

    // Main animation loop
    const render = () => {
      // 1. Draw Background Gradients based on Chapter Theme
      let bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      switch (theme) {
        case "battlefield_grief":
          // Dusty, heavy bronze-grey sky
          bgGradient.addColorStop(0, "#1c1917");
          bgGradient.addColorStop(0.5, "#292524");
          bgGradient.addColorStop(1, "#1c1917");
          break;
        case "chariot_wisdom":
          // Golden dawn of spiritual teachings
          bgGradient.addColorStop(0, "#1e1b4b");
          bgGradient.addColorStop(0.6, "#78350f");
          bgGradient.addColorStop(1, "#1e1b4b");
          break;
        case "action_duty":
          // Fire, energy, dynamic action
          bgGradient.addColorStop(0, "#2a0800");
          bgGradient.addColorStop(0.5, "#7c2d12");
          bgGradient.addColorStop(1, "#170500");
          break;
        case "glowing_knowledge":
          // Brilliant white-gold light breaking darkness
          bgGradient.addColorStop(0, "#0c0a09");
          bgGradient.addColorStop(0.5, "#451a03");
          bgGradient.addColorStop(1, "#0c0a09");
          break;
        case "inner_renunciation":
          // Serene teal water reflection
          bgGradient.addColorStop(0, "#022c22");
          bgGradient.addColorStop(0.7, "#064e3b");
          bgGradient.addColorStop(1, "#022c22");
          break;
        case "meditation_peace":
          // Indigo, spiritual deep focus
          bgGradient.addColorStop(0, "#1e1b4b");
          bgGradient.addColorStop(0.5, "#311042");
          bgGradient.addColorStop(1, "#090514");
          break;
        case "vishwaroopam":
          // Infinite cosmic vortex deep purple/navy
          bgGradient.addColorStop(0, "#03001e");
          bgGradient.addColorStop(0.5, "#7303c0");
          bgGradient.addColorStop(1, "#ec38bc");
          bgGradient.addColorStop(1, "#03001e");
          break;
        case "bhakti_devotion":
          // Soft pink, golden heart warmth
          bgGradient.addColorStop(0, "#1e1b4b");
          bgGradient.addColorStop(0.6, "#4d1d49");
          bgGradient.addColorStop(1, "#170c1b");
          break;
        case "final_liberation":
          // Golden sunrise of absolute victory and peace
          bgGradient.addColorStop(0, "#1c1917");
          bgGradient.addColorStop(0.4, "#f59e0b");
          bgGradient.addColorStop(0.8, "#b45309");
          bgGradient.addColorStop(1, "#1c1917");
          break;
        default:
          bgGradient.addColorStop(0, "#090d16");
          bgGradient.addColorStop(1, "#04060b");
      }

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Cosmic Portal/Emanations in specific themes
      if (theme === "vishwaroopam") {
        // Draw rotating spiral galaxy behind the silhouette
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(waveOffset * 0.02);
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.4);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.1, "rgba(253, 224, 71, 0.8)");
        grad.addColorStop(0.3, "rgba(236, 72, 153, 0.4)");
        grad.addColorStop(0.6, "rgba(147, 51, 234, 0.1)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (theme === "chariot_wisdom" || theme === "glowing_knowledge") {
        // Radiant halo in the center
        const haloGrad = ctx.createRadialGradient(width / 2, height / 2 - 30, 5, width / 2, height / 2 - 30, 200);
        haloGrad.addColorStop(0, "rgba(254, 240, 138, 0.8)");
        haloGrad.addColorStop(0.3, "rgba(217, 119, 6, 0.3)");
        haloGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 30, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & Draw Particles
      particles.forEach((p) => {
        // Adjust particle colors to match theme
        if (theme === "vishwaroopam") {
          p.color = Math.random() > 0.5 ? "#f472b6" : "#c084fc"; // Pink/Purple cosmic stars
        } else if (theme === "inner_renunciation") {
          p.color = "#34d399"; // Emerald lotus drops
        } else if (theme === "action_duty") {
          p.color = "#f97316"; // Fiery orange spark
        } else if (theme === "battlefield_grief") {
          p.color = "#a8a29e"; // Stone dust
        } else {
          p.color = "#fef08a"; // Pure gold light
        }
        p.update(theme);
        p.draw();
      });

      // 4. Render Dynamic SVG Silhouettes (Chariot, Lord Krishna, Arjuna)
      ctx.save();
      ctx.globalAlpha = 0.85;

      if (theme === "vishwaroopam") {
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
          ctx.rotate((i * Math.PI) / 10);
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

      } else if (theme === "inner_renunciation") {
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
          ctx.strokeStyle = w === 0 ? "rgba(254, 240, 138, 0.85)" : w === 1 ? "rgba(245, 158, 11, 0.5)" : "rgba(236, 72, 153, 0.3)";
          ctx.lineWidth = w === 0 ? 3 : 1.5;
          const amp = 15 + w * 10;
          const speed = waveOffset * (1 - w * 0.2);

          for (let x = 0; x < width; x++) {
            const y = height - 50 + Math.sin(x * 0.015 + speed) * amp * Math.sin(x * Math.PI / width);
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
  }, [theme, isPlaying]);

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[450px] bg-[#0f0906] rounded-2xl overflow-hidden border border-[#d49a3d]/25 shadow-2xl shadow-black flex flex-col justify-between" id="battlefield-visualizer-theater">
      
      {/* 1. Header overlay containing metadata */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-[#0f0906]/95 to-transparent flex justify-between items-center z-10 pointer-events-none">
        <div>
          <span className="text-xs font-mono text-[#d49a3d] font-semibold tracking-wider uppercase block">
            Chapter {chapterNumber < 10 ? `0${chapterNumber}` : chapterNumber}
          </span>
          <h2 className="text-lg md:text-xl font-serif text-[#e8dcc4] font-medium tracking-tight">
            {chapterTitle}
          </h2>
        </div>
        <div className="bg-[#140d0a]/90 border border-[#d49a3d]/30 px-3 py-1 rounded-full text-[10px] font-mono text-[#d49a3d] font-semibold uppercase flex items-center gap-1.5 backdrop-blur-sm shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#d49a3d] animate-pulse" />
          {isPlaying ? "Divine Narration Playing" : "Wisdom Theater"}
        </div>
      </div>

      {/* 2. Interactive Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" onClick={onPlayPause} />

      {/* 3. Subtitles/Script Overlay below canvas */}
      <div className="absolute bottom-16 left-4 right-4 bg-[#0f0906]/95 backdrop-blur-md border border-[#d49a3d]/20 p-3.5 rounded-xl text-center z-10 transition-all duration-500 max-h-20 overflow-y-auto shadow-lg flex items-center justify-center">
        <p className="text-xs sm:text-sm font-serif text-[#e8dcc4] leading-relaxed font-medium italic">
          {currentSentence || "Select a chapter or press Play to listen to the divine discourse..."}
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
          <span className="text-[10px] font-mono text-[#e8dcc4]/50 uppercase hidden sm:inline tracking-wider">Narrator Speed</span>
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
