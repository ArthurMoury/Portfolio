import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import s from './Certificates.module.css';

gsap.registerPlugin(ScrollTrigger);

const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => value * value * (3 - 2 * value);
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

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
      points.push({ x, y, color: `rgb(${shade},${shade},${shade})`, size: width / columns });
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
    const baseline = (rect.height + metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
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

export default function CertificateMorph() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current, host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const heading = document.getElementById('studies-title');
    if (!ctx || !host || !heading) return;
    let points = [], letters = [], progress = 0;
    function paint() {
      // No drawing or pixel sampling outside the handoff.
      if (progress <= 0 || progress >= 1) {
        canvas.hidden = true;
        points = [];
        heading.style.removeProperty('opacity');
        host.style.removeProperty('--morph-ink');
        return;
      }
      canvas.hidden = false;
      const bounds = canvas.getBoundingClientRect();
      if (canvas.width !== Math.round(bounds.width) || canvas.height !== Math.round(bounds.height)) {
        canvas.width = Math.round(bounds.width);
        canvas.height = Math.round(bounds.height);
        points = [];
      }
      if (!points.length) points = sampleRow(host, bounds);
      if (!letters.length) letters = sampleHeading(heading);
      if (!points.length || !letters.length) {
        heading.style.removeProperty('opacity');
        return;
      }
      const headingBox = heading.getBoundingClientRect();
      const lettering = smooth(clamp((progress - .46) / .39));
      const handoff = smooth(clamp((progress - .88) / .12));
      const settle = smooth(clamp((progress - .76) / .12));
      const readingY = Math.min(headingBox.top, innerHeight * .52);
      const textY = readingY + (headingBox.top - readingY) * settle - bounds.top;
      heading.style.opacity = String(handoff);
      const gather = smooth(clamp((progress - .04) / .36));
      const visibility = smooth(clamp(progress / .18)) * (1 - handoff);
      host.style.setProperty('--morph-ink', 1 - .8 * visibility);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = Math.min(canvas.width * .19, innerHeight * .16, 136);
      const cx = canvas.width / 2, cy = host.offsetHeight + radius * .72;
      const swirl = 2.2 * progress, lift = Math.sin(gather * Math.PI);
      points.forEach((point, i) => {
        const latitude = 1 - 2 * (i + .5) / points.length;
        const ring = Math.sqrt(1 - latitude * latitude);
        const angle = i * goldenAngle + swirl;
        const depth = ring * Math.sin(angle);
        const zoom = 1 / (1 - .25 * depth);
        const targetX = cx + radius * ring * Math.cos(angle) * zoom;
        const targetY = cy + radius * latitude * zoom;
        const x = point.x + (targetX - point.x) * gather + lift * radius * .25 * Math.sin(angle);
        const y = point.y + (targetY - point.y) * gather - lift * radius * (.35 + depth * .4);
        const size = point.size * (1 - gather) + (canvas.width < 700 ? 1.9 : 2.2) * zoom * gather;
        ctx.globalAlpha = visibility * (1 - gather * (.36 - depth * .28));
        ctx.fillStyle = point.color;
        const letter = letters[Math.floor((i + .5) * letters.length / points.length)];
        const px = x + (headingBox.left - bounds.left + letter.x - x) * lettering;
        const py = y + (textY + letter.y - y) * lettering;
        const dot = size + (Math.max(1, Math.sqrt(letters.length / points.length) * .83) - size) * lettering;
        ctx.fillRect(px - dot / 2, py - dot / 2, dot, dot);
      });
    }
    const trigger = ScrollTrigger.create({
      trigger: host, start: 'bottom 70%', endTrigger: heading.closest('section'),
      end: () => 'top ' + (document.querySelector('header')?.offsetHeight || 0) + 'px',
      onUpdate: self => { progress = self.progress; paint(); },
      onRefresh: self => { progress = self.progress; points = []; letters = []; paint(); },
    });
    host.addEventListener('load', paint, true);
    return () => {
      host.removeEventListener('load', paint, true);
      trigger.kill();
      heading.style.removeProperty('opacity');
      host.style.removeProperty('--morph-ink');
    };
  }, []);
  return <canvas ref={ref} className={s.morph} hidden aria-hidden="true" />;
}
