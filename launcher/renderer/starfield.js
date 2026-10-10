'use strict';
// Parallax starfield behind the launcher UI.
(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const mouse = { x: 0, y: 0 };
  let width = 0;
  let height = 0;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      size: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.12 + 0.03,
    }));
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / width - 0.5;
    mouse.y = e.clientY / height - 0.5;
  });
  resize();

  function frame() {
    ctx.fillStyle = 'rgba(6, 7, 10, 0.3)';
    ctx.fillRect(0, 0, width, height);
    for (const s of stars) {
      s.y += s.speed;
      if (s.y > height) {
        s.y = -5;
        s.x = Math.random() * width;
      }
      const alpha = 0.3 + s.z * 0.6;
      ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x + mouse.x * 40 * s.z, s.y + mouse.y * 40 * s.z, s.size * (0.5 + s.z * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
