// Rasterize the actual, translated HTML typography. The live HTML remains the
// reading surface; these transparent textures only supply ink for the morph.
export function captureCareerText(card, width, height) {
  const density = 1.35;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * density);
  canvas.height = Math.ceil(height * density);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Text sampling unavailable');
  ctx.scale(density, density);
  const root = card.getBoundingClientRect();
  const paddingY = (height - root.height) / 2;
  const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!node.textContent.trim() || parent.closest('[data-chapter-mobile]')) continue;
    const style = getComputedStyle(parent);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
    for (const match of node.textContent.matchAll(/\S+/g)) {
      range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
      const boxes = [...range.getClientRects()];
      const write = (text, box) => {
        const metrics = ctx.measureText(text);
        const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * .8;
        const descent = metrics.fontBoundingBoxDescent ?? parseFloat(style.fontSize) * .2;
        ctx.fillText(text, box.left - root.left, box.top - root.top + paddingY + (box.height + ascent - descent) / 2);
      };
      if (boxes.length === 1) write(match[0], boxes[0]);
      else for (let j = 0; j < match[0].length; j++) {
        range.setStart(node, match.index + j); range.setEnd(node, match.index + j + 1);
        write(match[0][j], range.getBoundingClientRect());
      }
    }
  }
  for (const image of card.querySelectorAll('[data-career-client] img')) {
    if (!image.naturalWidth) continue;
    const box = image.getBoundingClientRect(), ratio = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const w = image.naturalWidth * ratio, h = image.naturalHeight * ratio;
    ctx.save(); ctx.filter = getComputedStyle(image).filter;
    ctx.drawImage(image, box.left - root.left + (box.width - w) / 2, box.top - root.top + paddingY + (box.height - h) / 2, w, h);
    ctx.restore();
  }
  for (const link of card.querySelectorAll('[data-career-link]')) {
    const box = link.getBoundingClientRect();
    ctx.fillStyle = getComputedStyle(link).color;
    ctx.fillRect(box.left - root.left, box.bottom - root.top + paddingY - 1, box.width, 1);
  }
  const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];
  for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) {
    if (rgba[(y * canvas.width + x) * 4 + 3] > 45) points.push([(x + .5) / canvas.width, 1 - (y + .5) / canvas.height]);
  }
  return { canvas, points };
}
