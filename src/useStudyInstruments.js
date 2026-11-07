import { useEffect } from 'react';
import { blueprintRenderer } from './studyBlueprints';
import { ribbonFrame } from './studyMechanics';

export function useStudyInstruments(viewport, motion, reduced) {
  useEffect(() => {
    const view = viewport.current;
    const blueprint = document.createElement('canvas');
    const surface = document.createElement('canvas');
    for (const canvas of [blueprint, surface]) canvas.setAttribute('aria-hidden', 'true');
    const flat = blueprintRenderer(blueprint);
    view.appendChild(blueprint);
    let frame = 0, disposed = false, healthy = true, loading = false;
    let gl = null, lastDraw = 0;

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
    function draw(now) {
      frame = 0;
      if (disposed || document.hidden) return;
      const bounds = view.getBoundingClientRect();
      if (bounds.bottom < -240 || bounds.top > innerHeight + 240) return;
      if (!motion.current.axis || motion.current.slide <= .001) {
        surface.hidden = true;
        blueprint.hidden = true;
        return;
      }
      if (motion.current.axis === 'vertical' && now - lastDraw < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      loadRenderer();
      const height = Math.min(view.clientHeight, innerHeight);
      const width = view.clientWidth;
      if (!width || !height) return;
      const frameData = ribbonFrame(width, height, motion.current.slide, false);
      frameData.vertical = motion.current.axis === 'vertical';
      if (frameData.vertical) frameData.scale = Math.min(width * .23, height * .13);
      const useGL = healthy && gl;
      const canvas = useGL ? surface : blueprint;
      canvas.style.height = frameData.height + 'px';
      canvas.style.width = frameData.width + 'px';

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
