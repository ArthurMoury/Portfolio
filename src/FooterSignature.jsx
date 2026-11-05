import { useEffect, useRef } from 'react';
import { t } from './i18n';
import s from './FooterSignature.module.css';

const name = 'Arthur Moury';

function jitter(index) {
  const n = Math.sin(index * 127.1 + 23.4) * 43758.5453;
  return n - Math.floor(n);
}

export default function FooterSignature({ reduced }) {
  const link = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    if (reduced) return;
    const node = link.current;
    const surface = canvas.current;
    const context = surface.getContext('2d');
    if (!context) return;
    let visible = false, disposed = false, frame = 0;
    let width, height, particles = [];
    let target = 0, progress = 0;
    const pointer = { x: -100, y: -100, strength: 0, active: false };

    function schedule() {
      if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(render);
    }
    function measure() {
      width = node.clientWidth;
      height = node.clientHeight;
      if (!width || !height) return;
      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const ink = mask.getContext('2d', { willReadFrequently: true });
      const word = node.querySelector('span');
      const font = getComputedStyle(word);
      ink.font = font.fontWeight + ' ' + font.fontSize + ' ' + font.fontFamily;
      ink.letterSpacing = font.letterSpacing;
      ink.textBaseline = 'middle';
      ink.fillText(name, 4, height / 2);
      const pixels = ink.getImageData(0, 0, width, height).data;
      particles = [];
      for (let y = 1; y < height; y += 2) {
        for (let x = 1; x < width; x += 2) {
          if (pixels[(y * width + x) * 4 + 3] < 128) continue;
          const seed = jitter(x + y * width);
          particles.push({ x, y, dx: (seed - 0.5) * width * 0.8, dy: (jitter(y * width - x) - 0.5) * height, size: 0.9 + seed });
        }
      }
      const dpr = Math.min(window.devicePixelRatio, 2);
      surface.width = Math.ceil(width * dpr);
      surface.height = Math.ceil(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      schedule();
    }
    function updateScroll() {
      const rect = node.getBoundingClientRect();
      target = Math.max(0, Math.min(1, (innerHeight - rect.top) / (rect.height + 32)));
      schedule();
    }
    function render() {
      frame = 0;
      if (!visible || document.hidden || !particles.length) return;
      progress += (target - progress) * 0.12;
      if (Math.abs(target - progress) < 0.001) progress = target;
      const strength = pointer.active ? 1 : 0;
      pointer.strength += (strength - pointer.strength) * 0.18;
      const spread = (1 - progress) ** 1.6;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#dfdfda';
      for (const point of particles) {
        let x = point.x + point.dx * spread, y = point.y + point.dy * spread;
        const dx = x - pointer.x, dy = y - pointer.y;
        const radius = Math.hypot(dx, dy);
        if (radius < 45 && radius > 0) {
          const shift = (1 - radius / 45) ** 2 * 15 * pointer.strength;
          x += dx / radius * shift;
          y += dy / radius * shift;
        }
        context.fillRect(x, y, point.size, point.size);
      }
      node.dataset.drawn = 'true';
      if (progress !== target || Math.abs(strength - pointer.strength) > 0.002) schedule();
    }
    function move(event) {
      if (event.pointerType === 'touch') return;
      const box = node.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.active = true;
      schedule();
    }
    const leave = () => { pointer.active = false; schedule(); };
    const size = new ResizeObserver(() => { measure(); updateScroll(); });
    size.observe(node);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();
      } else {
        window.removeEventListener('scroll', updateScroll);
      }
    });
    observer.observe(node);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      size.disconnect();
      observer.disconnect();
      window.removeEventListener('scroll', updateScroll);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', schedule);
      delete node.dataset.drawn;
    };
  }, [reduced]);

  return <a href="#inicio" className={s.signature} ref={link} aria-label={name + ', ' + t('Voltar ao início')}>
    <span>{name}</span>
    {!reduced && <canvas aria-hidden="true" ref={canvas}/>}
  </a>;
}
