// Keep each visual line together, with a short ripple within it.
export function revealText(timeline, node, at = 0, direction = 1) {
  if (!node) return timeline;
  const words = [...node.querySelectorAll('[data-reveal-word]')];
  const lines = [];
  const delays = words.map(word => {
    const top = word.parentElement.offsetTop;
    let line = lines.findIndex(value => Math.abs(value.top - top) < 4);
    if (line < 0) { line = lines.length; lines.push({ top, count: 0 }); }
    const column = lines[line].count++;
    return Math.min(line * .065, .3) + Math.min(column * .018, .12);
  });
  timeline.fromTo(words, { yPercent: 110, rotation: direction * 2 }, {
    yPercent: 0, rotation: 0, duration: .64, stagger: i => delays[i], ease: 'power4.out', clearProps: 'transform'
  }, at);
  const shutters = node.querySelectorAll('[data-text-shutter]');
  if (shutters.length) timeline.fromTo(shutters, { x: 0, xPercent: 0 }, {
    xPercent: i => (i % 2 ? 110 : -110) * direction, duration: .74, stagger: .055, ease: 'power3.inOut'
  }, at);
  return timeline;
}
