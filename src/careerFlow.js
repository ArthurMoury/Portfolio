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
