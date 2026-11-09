const smooth = value => value * value * (3 - 2 * value);

// A short hold gives each image time to be read. The middle of each interval
// becomes the film-like, reversible handoff to the following chapter.
export function careerPosition(centers, focus) {
  if (!centers.length || focus <= centers[0]) return 0;
  for (let index = 0; index < centers.length - 1; index++) {
    if (focus > centers[index + 1]) continue;
    const fraction = (focus - centers[index]) / Math.max(1, centers[index + 1] - centers[index]);
    const progress = Math.max(0, Math.min(1, (fraction - .16) / .68));
    return index + smooth(progress);
  }
  return centers.length - 1;
}

export function careerFrame(scroll, count) {
  const raw = Math.max(0, Math.min(1, scroll)) * (count - 1);
  const index = Math.min(count - 2, Math.floor(raw));
  const phase = smooth(Math.max(0, Math.min(1, (raw - index - .12) / .76)));
  return { index, phase, position: index + phase };
}

export function careerPlacement(index, phase, layout) {
  const { width, height, imageWidth, textWidth } = layout;
  const right = index % 2 === 0;
  const lane = (size, onRight) => ({ x: onRight ? width - size / 2 : size / 2, y: height / 2 });
  const imageFrom = lane(imageWidth, right), imageTo = lane(imageWidth, !right);
  const textFrom = lane(textWidth, !right), textTo = lane(textWidth, right);
  const progress = (a, b) => smooth(Math.max(0, Math.min(1, (phase - a) / (b - a))));
  const imageRoute = progress(.08, .92), textRoute = progress(.02, .82);
  const between = (from, to, t, lift) => ({
    x: from.x + (to.x - from.x) * t,
    y: from.y + Math.sin(t * Math.PI) * lift,
  });
  return {
    imageFrom, imageTo, textFrom, textTo,
    image: between(imageFrom, imageTo, imageRoute, height * .10),
    text: between(textFrom, textTo, textRoute, -height * .10),
    before: 1 - progress(.03, .25), after: progress(.76, .98),
  };
}
