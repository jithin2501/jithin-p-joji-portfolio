'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import '../style/HeroCanvas.css';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let mx = 0, my = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();

    const mouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setMousePos({ x: mx, y: my });
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mouseMove);

    const logoUrls = [
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    ];
    const loadedLogos = logoUrls.map(url => { const img = new Image(); img.src = url; return img; });

    function r(a: number, b: number) { return a + Math.random() * (b - a); }

    class Logo {
      img!: HTMLImageElement;
      x!: number; y!: number; z!: number;
      baseSize!: number; dZ!: number; alpha!: number;
      theta!: number; dTheta!: number;
      color!: string;

      constructor() { this.reset(true); }
      reset(init: boolean) {
        this.img = loadedLogos[Math.floor(Math.random() * loadedLogos.length)];
        this.x = r(-800, 800); this.y = r(-500, 500);
        this.z = init ? r(-600, 600) : r(200, 800);
        this.baseSize = r(30, 70); this.dZ = r(-0.5, -1.5);
        this.alpha = r(0.1, 0.5);
        this.theta = r(0, Math.PI * 2); this.dTheta = r(-0.01, 0.01);

        const t = Math.random();
        if (t < 0.5) this.color = 'rgba(124,92,255,';
        else if (t < 0.75) this.color = 'rgba(0,229,255,';
        else if (t < 0.9) this.color = 'rgba(255,78,205,';
        else this.color = 'rgba(0,255,136,';
      }
      update() { this.z += this.dZ; this.theta += this.dTheta; if (this.z < -800) this.reset(false); }
      project(px: number, py: number, pz: number) {
        const fov = 500;
        const s = fov / (fov + pz + 300);
        return { x: W / 2 + px * s, y: H / 2 + py * s, s };
      }
      draw() {
        if (!this.img.complete) return;
        const px = this.x + Math.cos(this.theta) * 40;
        const py = this.y + Math.sin(this.theta) * 40;
        const p = this.project(px, py, this.z);
        if (p.s < 0) return;

        const size = this.baseSize * p.s;
        const dist = Math.hypot(p.x - mx, p.y - my);
        const mouseGlow = Math.max(0, 1 - dist / 250);
        let zFade = 1;
        if (this.z > 400) zFade = 1 - (this.z - 400) / 400;
        if (this.z < -600) zFade = 1 - (-600 - this.z) / 200;

        ctx!.shadowBlur = (15 + mouseGlow * 30) * p.s;
        ctx!.shadowColor = this.color + Math.min(1, this.alpha * 0.5 + mouseGlow * 0.8) * zFade + ')';
        ctx!.globalAlpha = Math.max(0, Math.min(1, (this.alpha + mouseGlow * 0.4) * zFade));
        ctx!.drawImage(this.img, p.x - size / 2, p.y - size / 2, size, size);
        ctx!.shadowBlur = 0;
      }
    }

    class Particle {
      x!: number; y!: number; rr!: number; a!: number;
      dx!: number; dy!: number; c!: string;

      constructor() { this.reset(); }
      reset() {
        this.x = r(0, W); this.y = r(0, H);
        this.rr = r(0.5, 1.5); this.a = r(0.1, 0.4);
        this.dx = r(-0.2, 0.2); this.dy = r(-0.5, -0.1);
        const t = Math.random();
        this.c = t < 0.5 ? '#7c5cff' : t < 0.75 ? '#00e5ff' : '#ff4ecd';
      }
      update() {
        this.x += this.dx; this.y += this.dy; this.a -= 0.0008;
        if (this.a <= 0 || this.y < 0) this.reset();
      }
      draw() {
        ctx!.globalAlpha = this.a;
        ctx!.beginPath(); ctx!.arc(this.x, this.y, this.rr, 0, Math.PI * 2);
        ctx!.fillStyle = this.c; ctx!.fill();
      }
    }

    const LOGOS: Logo[] = [];
    for (let i = 0; i < 50; i++) LOGOS.push(new Logo());

    const PARTS: Particle[] = [];
    for (let i = 0; i < 100; i++) PARTS.push(new Particle());

    function drawBg() {
      const g = ctx!.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#020212'); g.addColorStop(0.5, '#050516'); g.addColorStop(1, '#08082a');
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, W, H);

      // Add radial glow spots from the HTML
      [
        [W * 0.2, H * 0.3, 300, 'rgba(124,92,255,0.04)'],
        [W * 0.8, H * 0.2, 250, 'rgba(0,229,255,0.04)'],
        [W * 0.6, H * 0.7, 200, 'rgba(255,78,205,0.03)']
      ].forEach(([x, y, rr, c]) => {
        const rg = ctx!.createRadialGradient(Number(x), Number(y), 0, Number(x), Number(y), Number(rr));
        rg.addColorStop(0, String(c));
        rg.addColorStop(1, 'transparent');
        ctx!.fillStyle = rg;
        ctx!.fillRect(0, 0, W, H);
      });
    }

    function drawGrid() {
      const horizon = H * 0.72, vp = { x: W / 2, y: horizon };
      ctx!.strokeStyle = 'rgba(124,92,255,0.06)'; ctx!.lineWidth = 1;
      for (let i = 1; i <= 12; i++) {
        const y = horizon + (i / 12) * (H - horizon);
        ctx!.beginPath();
        for (let x = 0; x <= W; x += 20) {
          const dist = Math.hypot(x - mx, y - my);
          const bend = Math.max(0, 1 - dist / 300) * 40;
          const dy = (y - my) > 0 ? bend : -bend;
          x === 0 ? ctx!.moveTo(x, y + dy) : ctx!.lineTo(x, y + dy);
        }
        ctx!.stroke();
      }
      for (let i = -8; i <= 8; i++) {
        ctx!.beginPath(); ctx!.moveTo(vp.x, vp.y); ctx!.lineTo(W / 2 + i * (W / 12), H); ctx!.stroke();
      }
    }

    let rafId: number;
    function loop() {
      ctx!.clearRect(0, 0, W, H);
      drawBg();
      drawGrid();

      // Connections
      ctx!.lineWidth = 0.5;
      for (let i = 0; i < LOGOS.length; i++) {
        for (let j = i + 1; j < LOGOS.length; j++) {
          const l1 = LOGOS[i], l2 = LOGOS[j];
          const dx = l1.x - l2.x, dy = l1.y - l2.y, dz = l1.z - l2.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < 160000) {
            const p1 = l1.project(l1.x + Math.cos(l1.theta) * 40, l1.y + Math.sin(l1.theta) * 40, l1.z);
            const p2 = l2.project(l2.x + Math.cos(l2.theta) * 40, l2.y + Math.sin(l2.theta) * 40, l2.z);
            if (p1.s > 0 && p2.s > 0) {
              const alpha = (1 - Math.sqrt(distSq) / 400) * 0.15 * Math.min(p1.s, p2.s);
              ctx!.strokeStyle = l1.color + alpha + ')';
              ctx!.beginPath(); ctx!.moveTo(p1.x, p1.y); ctx!.lineTo(p2.x, p2.y); ctx!.stroke();
            }
          }
        }
      }

      LOGOS.sort((a, b) => b.z - a.z);
      LOGOS.forEach(l => { l.update(); l.draw(); });
      PARTS.forEach(p => { p.update(); p.draw(); });

      rafId = requestAnimationFrame(loop);
    }
    loop();

    const handleClick = (e: MouseEvent) => {
      // Check if we are on the project details page, contact page, or admin panel
      if (window.location.pathname.includes('/projects/') || window.location.pathname === '/contact' || window.location.pathname.startsWith('/admin')) return;
      
      // Prevent spawning ripples when clicking on navbar or footer items
      if ((e.target as HTMLElement).closest('.navbar') || (e.target as HTMLElement).closest('.footer-section')) return;
      
      const rip = document.createElement('div');
      rip.className = 'ripple';
      rip.style.left = e.clientX + 'px';
      rip.style.top = e.clientY + 'px';
      document.getElementById('ripples-container')?.appendChild(rip);
      setTimeout(() => rip.remove(), 1000);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="noise"></div>
      <div className="vignette"></div>
      <div id="spotlight" style={{
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(124, 92, 255, 0.08), transparent 100%)`,
        zIndex: 2,
        pointerEvents: 'none',
        transition: 'background 0.5s ease'
      }}></div>
      <div id="ripples-container" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}></div>
    </>
  );
}
