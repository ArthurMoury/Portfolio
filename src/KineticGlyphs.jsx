import { useEffect, useRef } from 'react';
import s from './PracticeLab.module.css';

// Cross-sections of a moving surface. Scroll alters its number of folds,
// while elapsed time keeps the surface turning even between scroll gestures.
function drawSilk(ctx, size, time, slide) {
  const rings = 29;
  const phase = time * .95 + slide * 2;
  for (let i = 0; i < rings; i++) {
    const band = i / (rings - 1);
    const tilt = phase * .53 + band * 2.2;
    const depth = (band - .5) * .76;
    ctx.beginPath();
    for (let j = 0; j <= 96; j++) {
      const angle = j / 96 * Math.PI * 2;
      const lobe = Math.sin(angle * 3 + band * 3 - phase);
      const pleat = Math.cos(angle * 5 - phase * .65);
      const mix = .5 + .5 * Math.cos(slide * Math.PI);
      const radius = .62 + .18 * (mix * lobe + (1 - mix) * pleat);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const projectedX = x * Math.cos(tilt) + depth * Math.sin(tilt);
      const projectedY = y * .84 + .25 * (depth * Math.cos(tilt) - x * Math.sin(tilt));
      const px = size * (.5 + .51 * projectedX);
      const py = size * (.5 + .56 * projectedY);
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    const light = Math.round(137 + 78 * Math.sin(band * Math.PI - .3));
    ctx.strokeStyle = 'rgba(' + light + ',' + light + ',' + (light + 5) + ',.84)';
    ctx.stroke();
  }
}

function drawFan(ctx, size, time, slide) {
  ctx.translate(size / 2, size / 2);
  ctx.rotate(time * .38 - slide * 1.7);
  for (let blade = 0; blade < 8; blade++) {
    ctx.rotate(Math.PI / 4);
    ctx.save();
    const fold = .58 + .35 * Math.sin(time * 1.8 + slide * 2 + blade * .48);
    ctx.scale(1, fold);
    ctx.fillStyle = blade % 2 ? '#aeb0b5' : '#76797f';
    ctx.beginPath();
    ctx.moveTo(size * .11, 0);
    ctx.quadraticCurveTo(size * .28, -size * .18, size * .46, -size * .13);
    ctx.quadraticCurveTo(size * .44, size * .08, size * .11, 0);
    ctx.fill();
    ctx.restore();
  }
}

export default function KineticGlyphs({ motion, reduced }) {
  const field = useRef(null);
  useEffect(() => {
    const nodes = [...field.current.children];
    const surfaces = nodes.map(node => node.getContext('2d'));
    if (surfaces.some(ctx => !ctx)) return;
    let frame = 0, time = 0, last = 0, visible = false;
    function draw(now) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (last && now - last < 32 && !reduced) { schedule(); return; }
      if (last) time += Math.min(now - last, 100) / 1000;
      last = now;
      nodes.forEach((node, index) => {
        const size = node.width, ctx = surfaces[index];
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.lineWidth = size / 230;
        (index ? drawFan : drawSilk)(ctx, size, time, motion.current.slide);
        ctx.restore();
      });
      if (!reduced) schedule();
    }
    function schedule() {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resume() { last = 0; schedule(); }
    const section = field.current.closest('section');
    function updateVisibility() {
      const bounds = section.getBoundingClientRect();
      const inView = bounds.bottom > 0 && bounds.top < innerHeight;
      if (inView && !visible) last = 0;
      visible = inView;
      schedule();
    }
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    document.addEventListener('visibilitychange', resume);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [motion, reduced]);
  return <div ref={field} className={s.glyphField} aria-hidden="true">
    <canvas width="384" height="384" /><canvas width="240" height="240" />
  </div>;
}
