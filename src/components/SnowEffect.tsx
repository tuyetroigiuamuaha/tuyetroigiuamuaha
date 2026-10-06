import React, { useEffect, useRef } from 'react';

export type SnowType = 'snow' | 'crystal' | 'sakura';

interface SnowEffectProps {
  enabled: boolean;
  type?: SnowType;
  density?: 'light' | 'normal' | 'dense';
  darkMode?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  rotation: number;
  rotationSpeed: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  kind: 'crystal' | 'fluffy' | 'sparkle' | 'soft' | 'sakura';
}

export const SnowEffect: React.FC<SnowEffectProps> = ({
  enabled = true,
  type = 'snow',
  density = 'normal',
  darkMode = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const count =
      density === 'light' ? 40 : density === 'dense' ? 100 : 65;

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      let kind: Particle['kind'] = 'soft';
      let size = 2;
      let speedY = 0.35;

      if (type === 'sakura') {
        kind = 'sakura';
        size = Math.random() * 5 + 3.5;
        speedY = Math.random() * 0.5 + 0.35;
      } else if (type === 'crystal') {
        // Mode Bông tuyết pha lê lớn toàn phần
        const rand = Math.random();
        if (rand > 0.4) {
          kind = 'crystal';
          size = Math.random() * 6 + 7; // Bông tuyết pha lê lớn 7px - 13px
          speedY = Math.random() * 0.3 + 0.18; // Rơi rất chậm và êm đềm
        } else if (rand > 0.15) {
          kind = 'fluffy';
          size = Math.random() * 4 + 5; // Bông tuyết tròn mềm 5px - 9px
          speedY = Math.random() * 0.35 + 0.22;
        } else {
          kind = 'sparkle';
          size = Math.random() * 2 + 2.5;
          speedY = Math.random() * 0.4 + 0.28;
        }
      } else {
        // Mode Tuyết Lãng Mạn (phối hợp nhiều tầng: pha lê lớn + bông mềm + sao lấp lánh)
        const rand = Math.random();
        if (rand > 0.72) {
          // Bông tuyết pha lê 6 cánh lớn
          kind = 'crystal';
          size = Math.random() * 5 + 6.5; // 6.5px - 11.5px
          speedY = Math.random() * 0.28 + 0.18; // Rơi chậm lãng mạn
        } else if (rand > 0.45) {
          // Bông tuyết tròn mềm bồng bềnh
          kind = 'fluffy';
          size = Math.random() * 3.5 + 4; // 4px - 7.5px
          speedY = Math.random() * 0.32 + 0.22;
        } else if (rand > 0.2) {
          // Bông tuyết sao lấp lánh
          kind = 'sparkle';
          size = Math.random() * 2 + 2.2;
          speedY = Math.random() * 0.4 + 0.3;
        } else {
          // Hạt tuyết nền mờ dịu
          kind = 'soft';
          size = Math.random() * 1.5 + 1.2;
          speedY = Math.random() * 0.38 + 0.25;
        }
      }

      const baseOpacity = Math.random() * 0.45 + 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.25,
        baseOpacity,
        opacity: baseOpacity,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        swaySpeed: Math.random() * 0.012 + 0.005,
        swayAmplitude: Math.random() * 0.8 + 0.4,
        swayOffset: Math.random() * 100,
        kind,
      });
    }

    let time = 0;

    // Helper: Vẽ bông tuyết 6 cánh pha lê
    const drawCrystal = (pSize: number) => {
      const branches = 6;
      ctx.save();
      ctx.strokeStyle = darkMode ? 'rgba(255, 240, 248, 0.95)' : 'rgba(80, 140, 205, 0.9)';
      ctx.lineWidth = Math.max(0.7, pSize * 0.11);
      ctx.lineCap = 'round';

      // Hào quang phát sáng mềm mại
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, pSize * 1.4);
      glow.addColorStop(0, darkMode ? 'rgba(255, 225, 240, 0.55)' : 'rgba(80, 140, 205, 0.35)');
      glow.addColorStop(0.5, darkMode ? 'rgba(244, 114, 182, 0.22)' : 'rgba(80, 140, 205, 0.12)');
      glow.addColorStop(1, 'rgba(192, 132, 252, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, pSize * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 6 nhánh chính đối xứng
      for (let b = 0; b < branches; b++) {
        ctx.rotate((Math.PI * 2) / branches);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, pSize);

        // Nhánh phụ 1
        const subPos1 = pSize * 0.52;
        const subLen1 = pSize * 0.32;
        ctx.moveTo(0, subPos1);
        ctx.lineTo(subLen1 * 0.7, subPos1 + subLen1 * 0.45);
        ctx.moveTo(0, subPos1);
        ctx.lineTo(-subLen1 * 0.7, subPos1 + subLen1 * 0.45);

        // Nhánh phụ 2
        const subPos2 = pSize * 0.78;
        const subLen2 = pSize * 0.22;
        ctx.moveTo(0, subPos2);
        ctx.lineTo(subLen2 * 0.6, subPos2 + subLen2 * 0.4);
        ctx.moveTo(0, subPos2);
        ctx.lineTo(-subLen2 * 0.6, subPos2 + subLen2 * 0.4);

        ctx.stroke();
      }

      // Tâm hoa tuyết phát sáng
      ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(70, 120, 185, 1)';
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, pSize * 0.18), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: Bông tuyết mềm bồng bềnh
    const drawFluffy = (pSize: number) => {
      ctx.save();
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pSize);
      if (darkMode) {
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(0.35, 'rgba(253, 218, 230, 0.8)');
        gradient.addColorStop(0.7, 'rgba(216, 180, 254, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(80, 140, 205, 0.95)');
        gradient.addColorStop(0.5, 'rgba(120, 175, 230, 0.55)');
        gradient.addColorStop(1, 'rgba(120, 175, 230, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, pSize, 0, Math.PI * 2);
      ctx.fill();

      // Tia sáng chữ thập nhẹ trong tâm
      ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(90, 150, 215, 0.75)';
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(-pSize * 0.65, 0);
      ctx.lineTo(pSize * 0.65, 0);
      ctx.moveTo(0, -pSize * 0.65);
      ctx.lineTo(0, pSize * 0.65);
      ctx.stroke();

      ctx.restore();
    };

    // Helper: Hạt tuyết sao lấp lánh
    const drawSparkle = (pSize: number) => {
      ctx.save();
      ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(80, 140, 205, 0.95)';
      ctx.beginPath();
      ctx.arc(0, 0, pSize * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = darkMode ? 'rgba(244, 114, 182, 0.85)' : 'rgba(80, 140, 205, 0.75)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(-pSize * 1.35, 0);
      ctx.lineTo(pSize * 1.35, 0);
      ctx.moveTo(0, -pSize * 1.35);
      ctx.lineTo(0, pSize * 1.35);
      ctx.stroke();
      ctx.restore();
    };

    // Helper: Hạt tuyết xa mờ
    const drawSoft = (pSize: number) => {
      ctx.save();
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, pSize);
      if (darkMode) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        grad.addColorStop(0.6, 'rgba(244, 114, 182, 0.35)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      } else {
        grad.addColorStop(0, 'rgba(80, 140, 205, 0.8)');
        grad.addColorStop(0.6, 'rgba(120, 175, 230, 0.3)');
        grad.addColorStop(1, 'rgba(120, 175, 230, 0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, pSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Helper: Cánh hoa đào
    const drawSakura = (pSize: number) => {
      ctx.save();
      const grad = ctx.createLinearGradient(-pSize, -pSize, pSize, pSize);
      grad.addColorStop(0, 'rgba(252, 231, 243, 0.95)');
      grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.85)');
      grad.addColorStop(1, 'rgba(219, 39, 119, 0.6)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, pSize * 1.25, pSize * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rơi chậm và đung đưa hình sin êm ái
        p.y += p.speedY;
        p.x += Math.sin(time * p.swaySpeed + p.swayOffset) * p.swayAmplitude + p.speedX;
        p.rotation += p.rotationSpeed;

        // Nhấp nháy êm dịu theo nhịp thở (twinkle effect)
        p.opacity =
          p.baseOpacity * (0.75 + 0.25 * Math.sin(time * p.twinkleSpeed + p.swayOffset));

        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));

        if (p.kind === 'crystal') {
          drawCrystal(p.size);
        } else if (p.kind === 'fluffy') {
          drawFluffy(p.size);
        } else if (p.kind === 'sparkle') {
          drawSparkle(p.size);
        } else if (p.kind === 'sakura') {
          drawSakura(p.size);
        } else {
          drawSoft(p.size);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, type, density, darkMode]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-700"
      style={{ opacity: enabled ? 1 : 0 }}
    />
  );
};
