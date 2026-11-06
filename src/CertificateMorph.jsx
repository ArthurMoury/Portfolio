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
  const columns = origin.width < 700 ? 26 : 38;
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

export default function CertificateMorph() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current, host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !host) return;
    let points = [], progress = 0;
    function paint() {
      // No drawing or pixel sampling outside the handoff.
      if (progress <= 0 || progress >= 1) {
        canvas.hidden = true;
        points = [];
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
      if (!points.length) return;
      const gather = smooth(clamp((progress - .07) / .68));
      const visibility = smooth(clamp(progress / .18)) * smooth(clamp((1 - progress) / .23));
      host.style.setProperty('--morph-ink', 1 - .8 * visibility);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const radius = Math.min(canvas.width * .19, canvas.height * .21, 136);
      const cx = canvas.width / 2, cy = canvas.height - radius * 1.18;
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
        ctx.fillRect(x, y, size, size);
      });
    }
    const trigger = ScrollTrigger.create({
      trigger: host, start: 'bottom 70%', end: 'bottom 9%',
      onUpdate: self => { progress = self.progress; paint(); },
      onRefresh: self => { progress = self.progress; points = []; paint(); },
    });
    host.addEventListener('load', paint, true);
    return () => {
      host.removeEventListener('load', paint, true);
      trigger.kill();
      host.style.removeProperty('--morph-ink');
    };
  }, []);
  return <canvas ref={ref} className={s.morph} hidden aria-hidden="true" />;
}
