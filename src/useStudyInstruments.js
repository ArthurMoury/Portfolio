import { useEffect } from 'react';
import { blueprintRenderer } from './studyBlueprints';
import { ribbonFrame } from './studyMechanics';

export function useStudyInstruments(viewport, motion, reduced) {
  useEffect(() => {
    const view = viewport.current;
    const firstSlot = view.querySelector('[data-instrument]');
    const blueprint = document.createElement('canvas');
    const surface = document.createElement('canvas');
    for (const canvas of [blueprint, surface]) canvas.setAttribute('aria-hidden', 'true');
    const flat = blueprintRenderer(blueprint);
    view.appendChild(blueprint);
    let frame = 0, disposed = false, healthy = true, loading = false;
    let gl = null;

    function invalidate() {
      if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function loadRenderer() {
      if (loading || reduced) return;
      loading = true;
      import('./studySculpture').then(({createStudyRenderer}) => {
        if (disposed) return;
        gl = createStudyRenderer(surface);
        view.appendChild(surface);
        invalidate();
      }).catch(invalidate);
    }
    function draw() {
      frame = 0;
      if (disposed || document.hidden) return;
      const bounds = view.getBoundingClientRect();
      if (bounds.bottom < -240 || bounds.top > innerHeight + 240) return;
      if (!motion.current.horizontal || motion.current.slide <= .001) {
        surface.hidden = true;
        blueprint.hidden = true;
        return;
      }
      loadRenderer();
      const height = Math.min(view.clientHeight, innerHeight);
      const width = view.clientWidth;
      if (!width || !height) return;
      // In the stacked layout the shared canvas covers just the visible slice.
      const offset = Math.min(view.clientHeight - height, Math.max(0, -bounds.top));
      const horizontal = motion.current.horizontal;
      const slot = horizontal ? null : firstSlot.getBoundingClientRect();
      const frameData = horizontal
        ? ribbonFrame(width,height,motion.current.slide,false)
        : ribbonFrame(slot.width,slot.height,0,true);
      const useGL = healthy && gl;
      const canvas = useGL ? surface : blueprint;
      canvas.style.height = frameData.height + 'px';
      canvas.style.width = frameData.width + 'px';
      canvas.style.transform = 'translate(' + (slot ? slot.left-bounds.left : 0) + 'px,' + (slot ? slot.top-bounds.top : offset) + 'px)';
      (useGL || flat)?.paint(frameData);
      surface.hidden = !useGL;
      blueprint.hidden = !!useGL;
    }
    function contextLost(event) { event.preventDefault(); healthy = false; invalidate(); }
    function contextRestored() { healthy = true; invalidate(); }
    surface.addEventListener('webglcontextlost', contextLost);
    surface.addEventListener('webglcontextrestored', contextRestored);
    motion.current.invalidate = invalidate;

    const observer = new IntersectionObserver(invalidate, { rootMargin: '240px' });
    observer.observe(view);
    const resize = new ResizeObserver(invalidate);
    resize.observe(view);
    resize.observe(firstSlot);
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('pageshow', invalidate);
    document.addEventListener('visibilitychange', invalidate);
    document.fonts.ready.then(invalidate);
    invalidate();
    return () => {
      disposed = true;
      motion.current.invalidate = null;
      cancelAnimationFrame(frame);
      observer.disconnect(); resize.disconnect();
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('pageshow', invalidate);
      document.removeEventListener('visibilitychange', invalidate);
      surface.removeEventListener('webglcontextlost', contextLost);
      surface.removeEventListener('webglcontextrestored', contextRestored);
      gl?.dispose();
      surface.remove(); blueprint.remove();
    };
  }, [viewport, motion, reduced]);
}
