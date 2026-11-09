import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from './data/portfolio';
import { careerFrame, careerPlacement } from './careerFlow';
import { captureCareerText } from './careerText';
import s from './CareerMorph.module.css';

gsap.registerPlugin(ScrollTrigger);
const loadImage = src => new Promise((resolve, reject) => {
  if (!src) { resolve(null); return; }
  const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src;
});

export default function CareerMorph({ reduced, onChapterChange }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (min-height: 700px)', () => {
      const canvas = ref.current, scene = canvas.parentElement, story = scene.closest('[data-career-story]');
      if (!canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' })) return;
      const grid = story.querySelector('[data-career-grid]'), cards = [...story.querySelectorAll('[data-chapter]')];
      const buttons = [...story.querySelectorAll('[data-chapter-visual]')];
      const setCards = cards.map(card => gsap.quickSetter(card, 'css'));
      const setButtons = buttons.map(button => gsap.quickSetter(button, 'css'));
      const clock = { scroll: 0 };
      let layout, heights = [], travel = 1, sticky = 92, current = -1, pendingFocus = -1;
      let engine = null, createEngine, images, brands, ready = false, healthy = true, disposed = false, visible = false, pending = 0;
      story.dataset.careerAlternating = 'true';
      function measure() {
        sticky = (document.querySelector('header')?.offsetHeight || 72) + 20;
        const width = scene.clientWidth, height = Math.max(560, innerHeight - sticky - 20);
        const style = getComputedStyle(scene), textWidth = width * parseFloat(style.getPropertyValue('--career-text-ratio'));
        const imageWidth = width * parseFloat(style.getPropertyValue('--career-image-ratio'));
        travel = Math.max(540, innerHeight * .75) * (cards.length - 1);
        story.style.setProperty('--career-scene-height', height + 'px');
        story.style.setProperty('--career-travel', travel + 'px');
        story.style.setProperty('--career-sticky-top', sticky + 'px');
        story.style.setProperty('--career-text-width', textWidth + 'px');
        story.style.setProperty('--career-image-width', imageWidth + 'px');
        story.style.setProperty('--career-image-height', imageWidth * .625 + 'px');
        heights = cards.map(card => card.offsetHeight);
        layout = { width, height, textWidth, imageWidth, imageHeight: imageWidth * .625, surfaceWidth: canvas.clientWidth, surfaceHeight: canvas.clientHeight };
      }
      function state() { return careerFrame(clock.scroll, cards.length); }
      function html(frame, particles) {
        const placement = careerPlacement(frame.index, frame.phase, layout);
        const nearest = Math.round(frame.position);
        cards.forEach((card, index) => {
          const endpoint = careerPlacement(index === cards.length - 1 ? index - 1 : index, index === cards.length - 1 ? 1 : 0, layout);
          const alpha = particles ? index === frame.index ? placement.before : index === frame.index + 1 ? placement.after : 0 : index === nearest ? 1 : 0;
          const text = particles && alpha > 0 ? placement.text : endpoint.text;
          const image = particles ? placement.image : endpoint.image;
          setCards[index]({ x: text.x - layout.textWidth / 2, y: text.y - heights[index] / 2, opacity: alpha });
          setButtons[index]({ x: image.x - layout.imageWidth / 2, y: image.y - layout.imageHeight / 2 });
          const active = index === nearest;
          card.inert = !active; card.setAttribute('aria-hidden', String(!active));
          card.dataset.careerReadable = String(active && alpha > .65);
          const readable = active && alpha > .65;
          buttons[index].tabIndex = readable ? 0 : -1;
          buttons[index].inert = !readable;
          buttons[index].style.pointerEvents = readable ? 'auto' : 'none';
          if (readable && pendingFocus === index) { pendingFocus = -1; buttons[index].focus({ preventScroll: true }); }
        });
        if (nearest !== current) { current = nearest; onChapterChange(nearest); }
        scene.dataset.careerPosition = frame.position.toFixed(4);
        scene.dataset.imageSide = nearest % 2 === 0 ? 'right' : 'left';
      }
      function invalidate() {
        if (!pending && !disposed && !document.hidden) pending = requestAnimationFrame(draw);
      }
      function draw() {
        pending = 0;
        if (disposed || !layout) return;
        const frame = state();
        if (engine && healthy && visible && !document.hidden) {
          try {
            engine.draw(frame, layout);
            scene.dataset.morphReady = 'true';
            canvas.dataset.morphPosition = frame.position.toFixed(4);
          } catch { healthy = false; delete scene.dataset.morphReady; engine.dispose(); engine = null; }
        }
        html(frame, !!engine && healthy);
      }
      async function prepare() {
        if (ready || disposed) return;
        ready = true;
        try {
          const [{ createCareerParticles }, loadedImages, loadedBrands] = await Promise.all([
            import('./careerParticles'), Promise.all(chapters.map(c => loadImage(c.image))),
            Promise.all(chapters.map(c => loadImage(c.brandImage))), document.fonts.ready,
            Promise.all([...story.querySelectorAll('[data-career-client] img')].map(image => image.decode().catch(() => {}))),
          ]);
          if (disposed) return;
          images = loadedImages; brands = loadedBrands; createEngine = createCareerParticles;
          measure();
          engine = createCareerParticles(canvas, chapters, images, brands, cards.map(card => captureCareerText(card, layout.textWidth, layout.height)));
          canvas.dataset.particles = String(engine.count); canvas.dataset.textParticles = String(engine.textCount);
          ScrollTrigger.refresh(); fromHash(); invalidate();
        } catch { healthy = false; invalidate(); }
      }
      const visibility = new IntersectionObserver(entries => {
        visible = entries.at(-1).isIntersecting;
        if (visible) { prepare(); invalidate(); }
      }, { rootMargin: '320px 0px' });
      measure(); html(state(), false);
      const tween = gsap.to(clock, {
        scroll: 1, ease: 'none', onUpdate: invalidate,
        scrollTrigger: {
          id: 'career-image-morph', trigger: grid,
          start: () => window.scrollY + grid.getBoundingClientRect().top - sticky,
          end: () => '+=' + travel, scrub: .24, onRefreshInit: measure, onRefresh: invalidate,
        },
      });
      function seek(index, animated = true) {
        const trigger = tween.scrollTrigger;
        window.scrollTo({ top: trigger.start + index / (cards.length - 1) * (trigger.end - trigger.start), behavior: animated ? 'smooth' : 'instant' });
      }
      function fromHash() { const index = chapters.findIndex(c => location.hash === '#capitulo-' + c.id); if (index >= 0) seek(index, false); }
      function anchor(event) {
        const link = event.target.closest('a[href^="#capitulo-"]');
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const index = chapters.findIndex(c => link.hash === '#capitulo-' + c.id);
        if (index >= 0) { event.preventDefault(); history.pushState(null, '', link.hash); seek(index); }
      }
      function keyboard(event) {
        if (!event.target.closest('[data-chapter-visual]') || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        pendingFocus = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1)));
        seek(pendingFocus);
      }
      function focus(event) {
        const card = event.target.closest('[data-chapter]'), index = cards.indexOf(card);
        if (index >= 0 && event.target.matches(':focus-visible') && card.dataset.careerReadable !== 'true') seek(index);
      }
      const lost = () => { healthy = false; delete scene.dataset.morphReady; invalidate(); };
      const restored = () => { healthy = true; invalidate(); };
      const pageVisibility = () => { if (!document.hidden && visible) invalidate(); };
      function resize() {
        if (disposed) return;
        const oldWidth = layout.width, oldHeight = layout.height;
        measure();
        if (engine && (oldWidth !== layout.width || oldHeight !== layout.height)) {
          try {
            engine.dispose();
            engine = createEngine(canvas, chapters, images, brands, cards.map(card => captureCareerText(card, layout.textWidth, layout.height)));
          } catch { healthy = false; delete scene.dataset.morphReady; engine = null; }
        }
        if (!disposed) { ScrollTrigger.refresh(); invalidate(); }
      }
      canvas.addEventListener('webglcontextlost', lost); canvas.addEventListener('webglcontextrestored', restored);
      document.addEventListener('visibilitychange', pageVisibility); document.addEventListener('click', anchor);
      window.addEventListener('resize', resize); window.addEventListener('hashchange', fromHash);
      story.addEventListener('keydown', keyboard); story.addEventListener('focusin', focus);
      visibility.observe(story);
      return () => {
        disposed = true; cancelAnimationFrame(pending); visibility.disconnect(); tween.scrollTrigger?.kill(); tween.kill(); engine?.dispose();
        canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restored);
        document.removeEventListener('visibilitychange', pageVisibility); document.removeEventListener('click', anchor);
        window.removeEventListener('resize', resize); window.removeEventListener('hashchange', fromHash);
        story.removeEventListener('keydown', keyboard); story.removeEventListener('focusin', focus);
        delete story.dataset.careerAlternating; delete scene.dataset.morphReady; delete scene.dataset.careerPosition; delete scene.dataset.imageSide;
        delete canvas.dataset.morphPosition; delete canvas.dataset.particles; delete canvas.dataset.textParticles;
        gsap.set([...cards, ...buttons], { clearProps: 'transform,opacity,pointerEvents' });
        cards.forEach(card => { card.inert = false; card.removeAttribute('aria-hidden'); delete card.dataset.careerReadable; });
        buttons.forEach((button, i) => { button.inert = false; button.tabIndex = i === current ? 0 : -1; });
      };
    });
    return () => media.revert();
  }, [reduced, onChapterChange]);
  return <canvas ref={ref} className={s.canvas} data-career-morph aria-hidden="true" />;
}
