import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from './data/portfolio';
import { careerPosition } from './careerFlow';
import s from './CareerMorph.module.css';

gsap.registerPlugin(ScrollTrigger);

const loadImage = src => new Promise((resolve, reject) => {
  if (!src) { resolve(null); return; }
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

export default function CareerMorph({ reduced }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 900px)', () => {
      const canvas = ref.current, host = canvas.parentElement;
      const story = host.closest('[data-career-story]');
      const elements = [...story.querySelectorAll('[data-chapter]')];
      let centers = [], width = 0, height = 0, visible = false, disposed = false;
      let engine = null, loading = false, healthy = true, frame = 0;
      const clock = { scroll: 0 };
      function measure() {
        centers = elements.map(el => { const rect = el.getBoundingClientRect(); return window.scrollY + rect.top + rect.height / 2; });
        width = host.clientWidth; height = host.clientHeight;
      }
      function invalidate() {
        if (!frame && visible && healthy && !disposed && !document.hidden) frame = requestAnimationFrame(draw);
      }
      function draw() {
        frame = 0;
        if (!engine || disposed || !visible || !healthy || document.hidden || !width || !height) return;
        const focus = centers[0] + (centers.at(-1) - centers[0]) * clock.scroll;
        const position = careerPosition(centers, focus);
        try {
          engine.draw(position, width, height);
          host.dataset.morphReady = 'true';
          canvas.dataset.morphPosition = position.toFixed(4);
        } catch {
          healthy = false;
          delete host.dataset.morphReady;
          engine?.dispose();
          engine = null;
        }
      }
      async function prepare() {
        if (loading || disposed) return;
        loading = true;
        try {
          const [{ createCareerParticles }, images, brands] = await Promise.all([
            import('./careerParticles'), Promise.all(chapters.map(chapter => loadImage(chapter.image))),
            Promise.all(chapters.map(chapter => loadImage(chapter.brandImage))),
          ]);
          if (disposed) return;
          if (!canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' })) return;
          engine = createCareerParticles(canvas, chapters, images, brands);
          canvas.dataset.particles = String(engine.count);
          invalidate();
        } catch { healthy = false; }
      }
      const visibility = new IntersectionObserver(entries => {
        visible = entries.at(-1).isIntersecting;
        if (visible) { prepare(); invalidate(); }
      }, { rootMargin: '320px 0px' });
      const lost = () => { healthy = false; delete host.dataset.morphReady; };
      const restored = () => { healthy = true; invalidate(); };
      const pageVisibility = () => { if (!document.hidden) invalidate(); };
      canvas.addEventListener('webglcontextlost', lost);
      canvas.addEventListener('webglcontextrestored', restored);
      document.addEventListener('visibilitychange', pageVisibility);
      measure();
      const tween = gsap.to(clock, {
        scroll: 1, ease: 'none', onUpdate: invalidate,
        scrollTrigger: {
          id: 'career-image-morph', trigger: elements[0],
          start: () => centers[0] - innerHeight * .55,
          end: () => centers.at(-1) - innerHeight * .55,
          scrub: .24, onRefreshInit: measure, onRefresh: invalidate,
        },
      });
      const resize = new ResizeObserver(() => { measure(); invalidate(); });
      resize.observe(host);
      visibility.observe(host);
      return () => {
        disposed = true;
        cancelAnimationFrame(frame); visibility.disconnect(); resize.disconnect();
        tween.scrollTrigger?.kill(); tween.kill(); engine?.dispose();
        canvas.removeEventListener('webglcontextlost', lost);
        canvas.removeEventListener('webglcontextrestored', restored);
        document.removeEventListener('visibilitychange', pageVisibility);
        delete host.dataset.morphReady; delete canvas.dataset.morphPosition; delete canvas.dataset.particles;
      };
    });
    return () => media.revert();
  }, [reduced]);
  return <canvas ref={ref} className={s.canvas} data-career-morph aria-hidden="true" />;
}
