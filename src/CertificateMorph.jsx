import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import s from './Certificates.module.css';

gsap.registerPlugin(ScrollTrigger);

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => value * value * (3 - 2 * value);

// Sample the same local thumbnails the visitor is looking at. Object-fit:
// contain leaves margins, so project the pixels into the fitted image box.
function sampleRow(row, origin) {
  const columns = origin.width < 700 ? 36 : 38;
  const sample = document.createElement('canvas');
  const ink = sample.getContext('2d', { willReadFrequently: true });
  const points = [];
  if (!ink) return points;
  for (const image of row.querySelectorAll('img')) {
    const box = image.getBoundingClientRect();
    if (!image.naturalWidth || !box.width || box.right <= origin.left || box.left >= origin.right) continue;
    const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    const left = box.left - origin.left + (box.width - width) / 2;
    const top = box.top - origin.top + (box.height - height) / 2;
    sample.width = columns;
    sample.height = Math.max(1, Math.round(columns * height / width));
    ink.drawImage(image, 0, 0, sample.width, sample.height);
    const { data } = ink.getImageData(0, 0, sample.width, sample.height);
    for (let i = 0; i < data.length; i += 4) {
      const pixel = i / 4;
      const x = left + (pixel % columns + .5) * width / columns;
      if (x < 0 || x > origin.width || data[i + 3] < 32) continue;
      const y = top + (Math.floor(pixel / columns) + .5) * height / sample.height;
      const shade = Math.round(50 + (data[i] * .3 + data[i + 1] * .6 + data[i + 2] * .1) * .76);
      points.push({ x, y, shade, size: width / columns });
    }
  }
  return points;
}

// Rasterize the actual word spans so the particle silhouette inherits the
// language, typography, line breaks and responsive scale of the HTML heading.
function sampleHeading(heading) {
  const box = heading.getBoundingClientRect();
  const padding = 8;
  const mask = document.createElement('canvas');
  mask.width = Math.ceil(box.width) + 2 * padding;
  mask.height = Math.ceil(box.height) + 2 * padding;
  const ink = mask.getContext('2d', { willReadFrequently: true });
  if (!ink) return [];
  heading.querySelectorAll('[data-study-word]').forEach(word => {
    const rect = word.getBoundingClientRect();
    const style = getComputedStyle(word);
    ink.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ink.letterSpacing = style.letterSpacing;
    const metrics = ink.measureText(word.textContent);
    const fontSize = parseFloat(style.fontSize);
    const baseline = (rect.height + (metrics.fontBoundingBoxAscent ?? fontSize * .8) - (metrics.fontBoundingBoxDescent ?? fontSize * .2)) / 2;
    ink.fillText(word.textContent, padding + rect.left - box.left, padding + rect.top - box.top + baseline);
  });
  const { data } = ink.getImageData(0, 0, mask.width, mask.height);
  const glyphs = [];
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (data[(y * mask.width + x) * 4 + 3] > 110) glyphs.push({x: x - padding, y: y - padding});
    }
  }
  return glyphs;
}

export default function CertificateMorph({ host: hostRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current, host = hostRef.current;
    const ctx = canvas.getContext('2d');
    const heading = document.getElementById('studies-title');
    if (!ctx || !host || !heading) return;
    const clock = { progress: 0 };
    let points = [], letters = [], prepared = false, frame = 0, disposed = false;
    let dotSize = 1, width = 0, height = 0, sourceOffset = 0;
    const compact = matchMedia('(max-width: 899px)').matches;
    const ratio = Math.min(devicePixelRatio || 1, compact ? 1 : 1.25);
    const colors = Array.from({ length: 32 }, (_, i) => `rgb(${Math.round(i * 255 / 31)} ${Math.round(i * 255 / 31)} ${Math.round(i * 255 / 31)})`);
    function schedule() {
      if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(() => { frame = 0; paint(); });
    }
    function release() {
      canvas.hidden = true;
      heading.style.removeProperty('opacity');
      host.style.removeProperty('--morph-ink');
      delete host.dataset.morphActive;
    }
    function paint() {
      const progress = clock.progress;
      canvas.dataset.morphProgress = progress.toFixed(4);
      if (progress <= .001 || progress >= .999 || host.querySelector(':focus-visible')) {
        release();
        if (progress >= .999 && !host.querySelector(':focus-visible')) host.style.setProperty('--morph-ink', '0');
        points = []; prepared = false; return;
      }
      const nextWidth = innerWidth, nextHeight = innerHeight;
      if (width !== nextWidth || height !== nextHeight) {
        width = nextWidth; height = nextHeight;
        canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        points = []; letters = []; prepared = false;
      }
      const rowBox = host.getBoundingClientRect();
      const depthOffset = host.querySelector('[data-certificate-depth]').getBoundingClientRect().top - rowBox.top;
      if (!points.length) {
        host.dataset.morphActive = 'true';
        points = sampleRow(host, { left: 0, right: width, width, top: rowBox.top });
        sourceOffset = depthOffset;
        if (compact && points.length > 1600) {
          const source = points;
          points = Array.from({ length: 1600 }, (_, i) => source[Math.floor(i * source.length / 1600)]);
        }
      }
      if (!letters.length) letters = sampleHeading(heading);
      if (!points.length || !letters.length) { release(); return; }
      if (!prepared) {
        dotSize = Math.max(1.1, Math.sqrt(letters.length / points.length) * .83);
        points.forEach((point, i) => {
          const letter = letters[Math.floor((i + .5) * letters.length / points.length)];
          point.targetX = letter.x; point.targetY = letter.y;
          point.arc = Math.sin(i * 2.39996) * Math.min(64, width * .06);
        });
        prepared = true;
      }
      canvas.hidden = false;
      canvas.dataset.sourcePoints = String(points.length);
      const box = heading.getBoundingClientRect();
      const lettering = smooth(clamp((progress - .06) / .80));
      const handoff = smooth(clamp((progress - .90) / .10));
      const visibility = smooth(clamp(progress / .12)) * (1 - handoff);
      heading.style.opacity = String(handoff);
      host.style.setProperty('--morph-ink', String(1 - smooth(clamp(progress / .20))));
      ctx.clearRect(0, 0, width, height);
      const bend = Math.sin(lettering * Math.PI);
      for (const point of points) {
        const sourceY = rowBox.top + point.y + depthOffset - sourceOffset;
        const x = point.x + (box.left + point.targetX - point.x) * lettering + bend * point.arc;
        const y = sourceY + (box.top + point.targetY - sourceY) * lettering - bend * Math.abs(point.arc) * .8;
        const dot = point.size + (dotSize - point.size) * lettering;
        ctx.globalAlpha = visibility;
        const shade = Math.round(point.shade + (238 - point.shade) * lettering);
        ctx.fillStyle = colors[Math.round(shade * 31 / 255)];
        ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot);
      }
    }
    function reset() { points = []; letters = []; prepared = false; schedule(); }
    const tween = gsap.to(clock, {
      progress: 1, ease: 'none', onUpdate: schedule,
      scrollTrigger: {
        id: 'certificate-title-morph', trigger: host, start: 'bottom 82%', endTrigger: heading.closest('section'),
        end: () => 'top ' + Math.max(document.querySelector('header')?.offsetHeight || 0, parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 'px',
        scrub: .18, onRefresh: reset,
      },
    });
    host.addEventListener('load', reset, true);
    host.addEventListener('focusin', schedule); host.addEventListener('focusout', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    document.fonts.ready.then(() => { if (!disposed) { reset(); ScrollTrigger.refresh(); } });
    schedule();
    return () => {
      disposed = true; cancelAnimationFrame(frame); tween.scrollTrigger?.kill(); tween.kill(); release();
      host.removeEventListener('load', reset, true);
      host.removeEventListener('focusin', schedule); host.removeEventListener('focusout', schedule);
      window.removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule);
    };
  }, [hostRef]);
  // This overlay must escape the certificates' stacking context, so the next
  // section's opaque background cannot cover the particles during the handoff.
  return createPortal(<canvas ref={ref} className={s.morph} data-certificate-morph hidden aria-hidden="true" />, document.body);
}
