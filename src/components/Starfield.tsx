import { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const STAR_COUNT = 250;
    const stars: Star[] = [];

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          size: Math.random() * 1.8 + 0.3,
          speed: Math.random() * 0.15 + 0.03,
        });
      }
    };
    initStars();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / width - 0.5,
        y: e.clientY / height - 0.5,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let raf: number;
    const render = () => {
      ctx.fillStyle = 'rgba(6, 7, 10, 0.3)';
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x * 40;
      const my = mouseRef.current.y * 40;

      for (const star of stars) {
        star.y += star.speed;
        if (star.y > height) {
          star.y = -10;
          star.x = Math.random() * width;
        }

        const offsetX = mx * star.z;
        const offsetY = my * star.z;
        const alpha = 0.3 + star.z * 0.6;
        const size = star.size * (0.5 + star.z * 0.8);

        if (star.z > 0.85) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(138, 43, 226, ${alpha * 0.6})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x + offsetX, star.y + offsetY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
