import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  // Monitor scroll to know if user reached the end of the welcome page
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // If scrolled past 85% of the total scroll height, consider reached end
    if (scrollTop + clientHeight >= scrollHeight - 120) {
      setScrolledToEnd(true);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Intersection Observer for scroll-revealed elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-12', 'scale-95');
            entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Canvas Particles: 2-layer Snow, Twinkling Stars, Floating Sakura Petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Classes
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      type: 'snow-large' | 'snow-small' | 'star' | 'petal';
      twinkleSpeed?: number;
      swing: number;
      swingSpeed: number;
    }

    const particles: Particle[] = [];

    // Initialize particles
    const initParticles = () => {
      particles.length = 0;

      // 1. Static Twinkling Stars (spread out across screen)
      const starCount = Math.floor((width * height) / 15000);
      for (let i = 0; i < starCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.8,
          speedY: 0, // Stars do not fall
          speedX: 0,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          type: 'star',
          swing: 0,
          swingSpeed: 0,
        });
      }

      // 2. Large Slow Snow (Layer 1)
      const largeSnowCount = Math.floor(width / 32);
      for (let i = 0; i < largeSnowCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2.5 + 2.5, // 2.5px to 5px
          speedY: Math.random() * 0.5 + 0.6, // Slower fall
          speedX: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.4 + 0.4,
          type: 'snow-large',
          swing: Math.random() * 20,
          swingSpeed: Math.random() * 0.01 + 0.005,
        });
      }

      // 3. Small Fast Snow (Layer 2 - creates depth)
      const smallSnowCount = Math.floor(width / 16);
      for (let i = 0; i < smallSnowCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.8, // 0.8px to 2px
          speedY: Math.random() * 1.2 + 1.5, // Faster fall
          speedX: Math.random() * 0.4 - 0.2,
          opacity: Math.random() * 0.3 + 0.2,
          type: 'snow-small',
          swing: Math.random() * 10,
          swingSpeed: Math.random() * 0.02 + 0.01,
        });
      }

      // 4. Floating Sakura/Flower Petals (Very slow drift)
      const petalCount = Math.floor(width / 64);
      for (let i = 0; i < petalCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 5, // 5px to 9px
          speedY: Math.random() * 0.4 + 0.4, // Extremely slow fall
          speedX: Math.random() * 0.6 - 0.3,
          opacity: Math.random() * 0.35 + 0.4,
          type: 'petal',
          swing: Math.random() * 40,
          swingSpeed: Math.random() * 0.008 + 0.004,
        });
      }
    };

    initParticles();

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Particle update and draw loop
    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Draw Particles based on type
        if (p.type === 'star') {
          // Twinkle logic
          p.opacity += p.twinkleSpeed || 0.01;
          if (p.opacity > 1 || p.opacity < 0.1) {
            p.twinkleSpeed = -(p.twinkleSpeed || 0.01);
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 244, 255, ${p.opacity * 0.85})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#d8b4fe';
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else if (p.type === 'snow-large') {
          p.swing += p.swingSpeed;
          const currentX = p.x + Math.sin(p.swing) * 2;
          p.y += p.speedY;

          ctx.beginPath();
          ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
          ctx.shadowBlur = 0;

          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        } else if (p.type === 'snow-small') {
          p.swing += p.swingSpeed;
          const currentX = p.x + Math.sin(p.swing) * 1;
          p.y += p.speedY;

          ctx.beginPath();
          ctx.arc(currentX, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();

          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        } else if (p.type === 'petal') {
          p.swing += p.swingSpeed;
          const currentX = p.x + Math.sin(p.swing) * 4;
          p.y += p.speedY;

          // Draw an elegant organic leaf/petal shape
          ctx.save();
          ctx.translate(currentX, p.y);
          ctx.rotate(p.swing * 0.4);
          ctx.beginPath();
          // Draw a curved petal
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 180, 204, ${p.opacity * 0.8})`; // soft blush pink
          ctx.fill();
          ctx.restore();

          if (p.y > height) {
            p.y = -p.size;
            p.x = Math.random() * width;
          }
        }
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 overflow-y-auto overflow-x-hidden select-none animate-welcome-bg"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Immersive Particle Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
      />

      {/* Screen 1: Top Welcome Greeting */}
      <div className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 py-12">
        {/* Soft layout gap on top */}
        <div />

        {/* Hero Welcome Typography with delicate effects */}
        <div className="space-y-6 max-w-3xl transform translate-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 text-pink-300 border border-purple-800/50 text-xs font-bold tracking-wider uppercase animate-bounce duration-1000">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Tuyết Rơi Giữa Mùa Hạ</span>
          </div>

          <h1 className="font-serif-novel text-4xl sm:text-5xl md:text-6xl font-black text-[#ffdce7] tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] animate-in fade-in zoom-in-95 duration-1000">
            Chào mừng bạn đến với <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-[#ebd5ff] to-rose-400 font-script-poetic text-5xl sm:text-6xl md:text-7xl block sm:inline-block ml-1">
              góc nhỏ của Hạ
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#fad2e1] max-w-xl mx-auto font-serif-novel font-semibold italic drop-shadow-sm leading-relaxed opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
            "Tuyết lạc thiên sơn, tình chôn vạn dặm... Nơi thời gian ngừng trôi để nhường chỗ cho những dòng lưu bút tri kỷ bắt đầu."
          </p>
        </div>

        {/* Bouncing Chevron down indicator to prompt scrolling */}
        <div className="flex flex-col items-center gap-2 mt-8 animate-pulse">
          <span className="text-[11px] font-bold text-purple-300/80 tracking-widest uppercase">
            Cuộn xuống để đọc tiếp
          </span>
          <ChevronDown className="w-6 h-6 text-pink-400 animate-bounce" />
        </div>
      </div>

      {/* Screen 2: Poetical Introduction Content blocks */}
      <div className="relative max-w-3xl mx-auto px-6 py-24 space-y-16 sm:space-y-24">
        {/* Paragraph Block 1 */}
        <div className="scroll-reveal opacity-0 translate-y-12 scale-95 transition-all duration-1000 ease-out glass-panel rounded-3xl p-6 sm:p-8 border border-purple-900/60 bg-slate-900/90 shadow-xl relative">
          <div className="absolute top-4 left-4 text-purple-800 text-3xl font-serif">“</div>
          <p className="font-serif-novel text-base sm:text-lg text-[#fed7e2] leading-relaxed text-center font-medium pl-6">
            Nơi Hạ sáng tạo, nơi những câu chuyện thơ mộng được viết nên. Mỗi nét vẽ, mỗi con chữ đều là hơi ấm gom góp giữa đêm đông buốt giá.
          </p>
        </div>

        {/* Paragraph Block 2 */}
        <div className="scroll-reveal opacity-0 translate-y-12 scale-95 transition-all duration-1000 ease-out glass-panel rounded-3xl p-6 sm:p-8 border-purple-900/60 bg-slate-900/90 shadow-xl relative">
          <div className="absolute top-4 left-4 text-purple-800 text-3xl font-serif">“</div>
          <p className="font-serif-novel text-base sm:text-lg text-[#fed7e2] leading-relaxed text-center font-medium pl-6">
            Mỗi người một nét, mỗi nhân vật một câu chuyện riêng biệt. Từ những ngọt ngào dịu êm của nắng ấm cho đến những trầm tư, bí mật thâm sâu dưới sương tuyết.
          </p>
        </div>

        {/* Paragraph Block 3 */}
        <div className="scroll-reveal opacity-0 translate-y-12 scale-95 transition-all duration-1000 ease-out glass-panel rounded-3xl p-6 sm:p-8 border-purple-900/60 bg-slate-900/90 shadow-xl relative">
          <div className="absolute top-4 left-4 text-purple-800 text-3xl font-serif">“</div>
          <p className="font-serif-novel text-base sm:text-lg text-[#fed7e2] leading-relaxed text-center font-medium pl-6 flex flex-col items-center justify-center gap-2">
            <span>Cảm ơn bạn đã bước vào, cùng khám phá thế giới này nhé 💜</span>
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500 animate-pulse mt-1" />
          </p>
        </div>

        {/* CTA Screen / Glowing entry Button */}
        <div className="scroll-reveal opacity-0 translate-y-12 scale-95 transition-all duration-1000 ease-out flex flex-col items-center justify-center pt-8 pb-20">
          <div className="relative group">
            {/* Pulsating back glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 blur-xl opacity-30 group-hover:opacity-75 transition-opacity duration-1000 ${scrolledToEnd ? 'scale-110 opacity-70 animate-pulse' : ''}`} />

            {/* Glowing enter button */}
            <button
              onClick={onDismiss}
              className={`relative px-10 py-5 rounded-2xl font-serif-novel text-base sm:text-lg font-bold text-white bg-gradient-to-r from-purple-800 via-pink-700 to-blue-800 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl active:scale-95 overflow-hidden border border-pink-400/30 cursor-pointer ${
                scrolledToEnd ? 'ring-2 ring-pink-400 shadow-[0_0_35px_rgba(244,114,182,0.55)] scale-105' : ''
              }`}
            >
              {/* Shimmer line */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-welcome-shine pointer-events-none" />

              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <Sparkles className="w-5 h-5 text-pink-200 animate-spin duration-3000" />
                <span>Vào giao diện chính ✨</span>
              </span>
            </button>
          </div>
          
          {!scrolledToEnd && (
            <span className="text-[10px] font-bold text-purple-400/60 tracking-wider uppercase mt-4">
              Hãy cuộn tiếp hoặc đọc hết để nút sẵn sàng sáng rực 💜
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
