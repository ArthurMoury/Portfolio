import { blend, breathAt, instruction, membership, meanAt, sample, unit } from './studyMechanics';

const tau = 2 * Math.PI;
const colors = ['#dab690', '#e8a977', '#bfa8f2', '#88ccbf'];

function alignment(ctx, p) {
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate((i - 1) * (36 - 22 * p), (i - 1) * 9);
    ctx.rotate((i - 1) * 0.46 * (1 - p) + p * 0.32);
    ctx.scale(0.76, 1);
    ctx.strokeStyle = ['#c9936d', '#a69cc7', '#7ab9af'][i];
    for (let layer = 0; layer < 9; layer++) {
      ctx.beginPath();
      for (let j = 0; j <= 180; j++) {
        const a = j * tau / 180, r = 82 + layer * 1.8 + 12 * Math.cos(3 * a);
        const x = r * Math.cos(a), y = r * Math.sin(a);
        if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 18 - 29 * p, 3 + 4 * p, 0, tau);
  ctx.fill();
}

function reeds(ctx, p) {
  const { channel, phase, pressure } = breathAt(p);
  ctx.rotate(-0.12);
  ctx.strokeRect(-116, -37, 232, 72);
  ctx.strokeRect(-119, -42 - 26 * blend(p * 6), 238, 15);
  for (let i = 0; i < 8; i++) {
    const x = (i - 3.5) * 27;
    ctx.strokeRect(x - 9, -24, 18, 46);
    ctx.globalAlpha = i === channel ? 0.48 + 0.52 * pressure : 0.24;
    ctx.fillRect(x - 5, -22, 10, 36 + (i === channel ? 8 * pressure : 0));
    ctx.globalAlpha = 1;
  }
  const inlet = (channel - 3.5) * 27;
  for (let i = 0; i < 23; i++) {
    const f = (i / 23 + phase) % 1;
    ctx.beginPath();
    ctx.arc(inlet + Math.sin(f * 10 + i) * 11 * (1 - f), 97 - 73 * f, 1 + 2 * pressure, 0, tau);
    ctx.fill();
  }
  ctx.beginPath();
  for (let j = 0; j <= 80; j++) {
    const x = -111 + j * 2.8;
    const y = -83 - Math.sin(j * 0.34 + phase * tau) * pressure * 11 * Math.sin(Math.PI * j / 80);
    if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function bytes(ctx, p) {
  const phase = p * 3.55, active = Math.min(2, Math.floor(phase));
  for (let i = 0; i < 256; i++) {
    ctx.globalAlpha = i < 3 && i <= active ? 1 : 0.28;
    ctx.fillRect(-114 + (i % 16) * 8, -58 + Math.floor(i / 16) * 8, 5.6, 5.6);
  }
  for (let r = 0; r < 4; r++) {
    const y = -52 + r * 31;
    ctx.globalAlpha = 1;
    ctx.strokeRect(34, y, 89, 20);
    for (let bit = 0; bit < 8; bit++) {
      const on = phase >= 3 && r === 0 && (instruction[2] & (1 << (7 - bit)));
      ctx.globalAlpha = on ? 1 : 0.22;
      ctx.fillRect(39 + bit * 10, y + 5, 6, 10);
    }
  }
  ctx.globalAlpha = 1;
  const x = -111 + active * 8, t = unit(phase - active);
  ctx.beginPath();
  ctx.moveTo(x, -59); ctx.lineTo(x, -79); ctx.lineTo(23, -79); ctx.lineTo(40, -43);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + (40 - x) * t, -58 - 28 * Math.sin(t * Math.PI) + 15 * t, 4, 0, tau);
  ctx.fill();
}

function salaries(ctx, p) {
  sample.forEach((row, i) => {
    const weight = membership(i, p), height = 3 + weight * row[4] / 1300;
    ctx.globalAlpha = 0.25 + 0.75 * weight;
    ctx.fillRect(-112 + i * 14, 83 - height, 9, height);
  });
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#f4bf88';
  const y = 80 - meanAt(p) / 1300;
  ctx.beginPath(); ctx.moveTo(-121, y); ctx.lineTo(117, y); ctx.stroke();
}
const diagrams = [alignment, reeds, bytes, salaries];

export function blueprintRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return {
    paint(width, height, slots) {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.ceil(width * ratio), h = Math.ceil(height * ratio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const {index, x, y, width: sw, height: sh, progress} of slots) {
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, sw, sh); ctx.clip();
        ctx.translate(x + sw / 2, y + sh / 2);
        const scale = Math.min(sw, sh) / 282;
        ctx.scale(scale, scale);
        ctx.strokeStyle = ctx.fillStyle = colors[index];
        ctx.lineWidth = 1.25;
        diagrams[index](ctx, progress);
        ctx.restore();
      }
    },
  };
}
