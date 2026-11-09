import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, X } from 'lucide-react';
import Github from './GithubIcon';
import { projects } from './data/portfolio';
import { localize, t } from './i18n';
import s from './ProjectGallery.module.css';

const themes = ['#93ad88', '#b69ddf', '#92b990', '#deaa91', '#de9a86', '#91bf9d', '#94b9bd'];
const clamp = gsap.utils.clamp(0, 1);
const ease = value => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const external = { target: '_blank', rel: 'noreferrer noopener' };

export default function ProjectGallery({ reduced }) {
  const root = useRef(null), stage = useRef(null), seek = useRef(null), suppressClick = useRef(0);
  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 600px)', () => {
      const section = root.current, viewport = stage.current;
      const cards = [...section.querySelectorAll('[data-project]')];
      const covers = cards.map(card => card.querySelector('[data-cover]'));
      const features = cards.map(card => card.querySelector('[data-project-feature]'));
      const faces = covers.map(cover => cover.querySelector('[data-project-face]'));
      const featureFaces = features.map(feature => feature.querySelector('[data-project-face]'));
      const details = cards.map(card => card.querySelector('[data-project-detail]'));
      const washes = cards.map(card => card.querySelector('[data-project-wash]'));
      const copyParts = details.map(detail => [...detail.querySelectorAll('[data-project-copy-part]')]);
      let selected = -1;
      let view = idleScene();
      let width, height, mobile, inset, coverWidth, coverHeight, coverTop, coverLeft, trackPitch = 1;
      let detailHeights = [];
      let faceBounds, featureBounds;
      let lastFocused = -2, flow = 0, currentFocus = 0, lastDetailKey = '';
      let navigation = null, navigationTween, alignmentTween, focusTween, pointer = null, angularVelocity = 0;
      let keyboardFocus = -1;
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const arrival = { progress: 0 };
      let entranceTween;
      let visible = false, ticking = false, elapsed = 0;
      const setCovers = covers.map(cover => gsap.quickSetter(cover, 'css'));
      const setFeatures = features.map(feature => gsap.quickSetter(feature, 'css'));
      const setDetails = details.map(detail => gsap.quickSetter(detail, 'css'));
      const setWashes = washes.map(wash => gsap.quickSetter(wash, 'opacity'));
      const setCopyParts = copyParts.map(parts => parts.map(part => gsap.quickSetter(part, 'css')));
      section.dataset.showcase = 'true';

      function measure() {
        inset = document.querySelector('header')?.offsetHeight || 72;
        section.style.setProperty('--gallery-inset', inset + 'px');
        section.style.removeProperty('--gallery-content-height');
        width = viewport.clientWidth;
        height = viewport.clientHeight;
        mobile = width < 900;
        coverWidth = mobile ? width - 40 : Math.min(width * .57, 920);
        coverHeight = mobile ? Math.min(coverWidth * .625, height * (height < 700 ? .24 : .30)) : Math.min(coverWidth * .625, height * .66);
        coverTop = mobile ? 64 : Math.max(24, (height * .84 - coverHeight) / 2);
        coverLeft = mobile ? 20 : width * .045;
        section.style.setProperty('--gallery-heading', section.querySelector('h2').parentElement.offsetHeight + 'px');
        section.style.setProperty('--gallery-height', height + 'px');
        section.style.setProperty('--cover-width', coverWidth + 'px');
        section.style.setProperty('--cover-height', coverHeight + 'px');
        section.style.setProperty('--cover-top', coverTop + 'px');
        section.style.setProperty('--cover-left', coverLeft + 'px');
        detailHeights = details.map(detail => detail.offsetHeight);
        const contentHeight = mobile
          ? coverTop + coverHeight + 16 + Math.max(...detailHeights) + 110
          : Math.max(...detailHeights) / .75 + 32;
        section.style.setProperty('--gallery-content-height', contentHeight + 'px');
        height = viewport.clientHeight;
        section.style.setProperty('--gallery-height', height + 'px');
        // Measure the projected faces once per layout refresh. Spacing and wrap
        // then follow their real silhouettes, rather than the unrotated boxes.
        gsap.set([...covers, ...features], { x: 0, y: 0, scale: 1 });
        faces.forEach(face => gsap.killTweensOf(face));
        covers.forEach(cover => delete cover.dataset.hovered);
        gsap.set(faces, { scale: 1, y: 0, transformPerspective: mobile ? 1000 : 1700, rotationX: 12, rotationY: mobile ? -42 : -48, rotationZ: -11 });
        gsap.set(featureFaces, { transformPerspective: mobile ? 1200 : 1900, rotationX: 7, rotationY: mobile ? -20 : -26, rotationZ: -5 });
        const bounds = (shell, face) => {
          const box = shell.getBoundingClientRect(), projected = face.getBoundingClientRect();
          return { width: projected.width, height: projected.height,
            dx: projected.x + projected.width / 2 - box.x - box.width / 2,
            dy: projected.y + projected.height / 2 - box.y - box.height / 2 };
        };
        faceBounds = bounds(covers[0], faces[0]);
        featureBounds = bounds(features[0], featureFaces[0]);
      }

      function idleScene(travel = 0, index = -1) {
        return {
          travel,
          zooms: cards.map((_, i) => i === index ? 1 : 0),
          reads: cards.map((_, i) => i === index ? 1 : 0),
          shifts: cards.map((_, i) => i === index ? 0 : 1),
        };
      }

      function scene() {
        if (!navigation) return view;
        const { from, index, progress, travel } = navigation;
        const exit = 1 - ease(progress / .43);
        const enter = ease((progress - .28) / .54);
        return {
          travel: from.travel + (travel - from.travel) * ease((progress - .10) / .70),
          zooms: from.zooms.map((zoom, i) => zoom * exit + (i === index ? enter : 0)),
          reads: from.reads.map((read, i) => read * (1 - ease(progress / .27)) + (i === index ? ease((progress - .66) / .34) : 0)),
          shifts: from.shifts.map((shift, i) => i === index
            ? (from.zooms[i] > 0 ? shift : 1) * (1 - enter)
            : shift - (shift + 1) * (1 - exit)),
        };
      }

      function render() {
        const { zooms, reads, shifts, travel } = scene();
        const focus = Math.max(...zooms);
        const focused = reads.findIndex(read => read > .65);
        currentFocus = focus;

        if (focused !== lastFocused) {
          cards.forEach((card, i) => {
            const active = i === focused;
            card.dataset.active = String(active);
            details[i].inert = !active;
            details[i].setAttribute('aria-hidden', String(!active));
            covers[i].dataset.featured = String(active);
            covers[i].setAttribute('aria-pressed', String(active));
          });
          lastFocused = focused;
        }

        // The diagonal descends from upper right to lower left. Recycling still
        // happens beyond the side edges, with spacing based on the tilted faces.
        const scale = (mobile ? .86 : .82) * (1 - focus * .76);
        const tileWidth = faceBounds.width * scale;
        const tileHeight = faceBounds.height * scale;
        const gap = Math.max(mobile ? 22 : 36, tileWidth * .10);
        const pitch = Math.max(tileWidth + gap, (width + tileWidth + gap * 2) / cards.length);
        trackPitch = pitch;
        const span = pitch * cards.length;
        const wrap = gsap.utils.wrap(-tileWidth / 2 - gap, span - tileWidth / 2 - gap);
        const arrivalX = (1 - ease(arrival.progress)) * (width + tileWidth + gap * 2);
        const textFloor = mobile ? coverTop + coverHeight + 16 + Math.max(...detailHeights.map((size, j) => size * zooms[j])) : 0;
        const slope = (mobile ? .62 : .34) * (1 - focus * .78);
        const diagonalReach = (width + tileWidth) / 2 * slope;
        const featureFit = Math.min(1, coverWidth / featureBounds.width, coverHeight / featureBounds.height);
        cards.forEach((card, i) => {
          const zoom = zooms[i];
          const birth = ease(arrival.progress * 1.6 - i * .10);
          const centerX = wrap(width * .5 + (i - travel - flow) * pitch) + arrivalX;
          const restY = height * (mobile ? .38 : .42);
          const readingY = mobile
            ? Math.max(height * (height < 700 ? .89 : .84), textFloor + 18 + tileHeight / 2 + diagonalReach)
            : height * .87;
          const centerY = restY + (readingY - restY) * focus + (width / 2 - centerX) * slope;
          const faceScale = scale * (.84 + .16 * birth);
          setCovers[i]({
            x: centerX - coverWidth / 2 - faceBounds.dx * faceScale,
            y: centerY - coverHeight / 2 - faceBounds.dy * faceScale,
            scale: faceScale, opacity: birth,
          });
          const featureScale = featureFit * (.94 + .06 * zoom);
          // The selected face keeps some perspective and follows the same
          // diagonal during entry/exit, while its technical details stay level.
          setFeatures[i]({
            x: coverLeft - featureBounds.dx * featureScale + shifts[i] * (width + coverWidth),
            y: coverTop - featureBounds.dy * featureScale - shifts[i] * height * .30,
            scale: featureScale, opacity: zoom * birth,
            visibility: zoom > 0 ? 'visible' : 'hidden',
          });
        });
        // Keep the autoplay/drag loop light: only update copy when its reveal changes.
        const detailKey = reads.join(',') + '|' + zooms.join(',');
        if (detailKey !== lastDetailKey) {
          cards.forEach((card, i) => {
            const visible = reads[i];
            setDetails[i]({ opacity: visible, y: (1 - visible) * 12 });
            setCopyParts[i].forEach((set, part) => {
              const reveal = ease((visible - part * .045) / (1 - part * .045));
              set({ opacity: reveal, x: (1 - reveal) * (part % 2 ? 18 : -12), y: (1 - reveal) * 10 });
            });
            setWashes[i](zooms[i] * .16);
          });
          lastDetailKey = detailKey;
        }
      }
      function tick(_time, delta) {
        const step = Math.min(delta, 64);
        if (!navigation && !pointer?.dragged && keyboardFocus < 0) {
          flow -= angularVelocity * step / 1000;
          angularVelocity *= Math.exp(-step / 350);
          flow = gsap.utils.wrap(0, cards.length, flow + step / 1000 / 4.8 * (1 - currentFocus * .45));
        }
        elapsed += step;
        if (elapsed < (mobile ? 32 : 16)) return;
        elapsed = 0;
        render();
      }
      function syncPlayback() {
        const shouldPlay = visible && !document.hidden;
        if (shouldPlay === ticking) return;
        ticking = shouldPlay;
        if (ticking) {
          gsap.ticker.add(tick);
          if (!entranceTween) {
            entranceTween = gsap.to(arrival, { progress: 1, duration: 1.4, ease: 'power2.out', onUpdate: render });
          } else entranceTween.resume();
        }
        else {
          gsap.ticker.remove(tick);
          entranceTween?.pause();
        }
      }
      const visibility = new IntersectionObserver(entries => {
        visible = entries.at(-1).isIntersecting;
        syncPlayback();
      });
      document.addEventListener('visibilitychange', syncPlayback);
      measure();
      visibility.observe(viewport);
      function alignStage(animated) {
        const top = window.scrollY + viewport.getBoundingClientRect().top - inset;
        alignmentTween?.kill();
        if (!animated) { window.scrollTo({ top, behavior: 'instant' }); return; }
        const scroll = { y: window.scrollY };
        alignmentTween = gsap.to(scroll, {
          y: top, duration: .35, ease: 'power2.out',
          onUpdate: () => window.scrollTo({ top: scroll.y, behavior: 'instant' }),
        });
      }
      function goTo(index, animated = true) {
        if (selected === index) { if (index >= 0) alignStage(animated); return; }
        const from = scene(), previous = selected;
        const restoreFocus = index < 0 && section.contains(document.activeElement);
        selected = index;
        navigationTween?.kill();
        if (index >= 0) section.dataset.projectOpen = 'true';
        else delete section.dataset.projectOpen;
        // Only an explicit selection opens a presentation; scrolling owns no gallery state.
        const travel = index < 0 ? from.travel
          : from.travel + gsap.utils.wrap(0, projects.length, index - from.travel);
        const target = idleScene(travel, index);
        if (index >= 0) alignStage(animated);
        if (!animated) { view = target; navigation = null; delete section.dataset.switching; render(); return; }
        navigation = { from, index, travel, progress: 0 };
        section.dataset.switching = 'true';
        angularVelocity = 0;
        navigationTween = gsap.to(navigation, {
          progress: 1, duration: .86, ease: 'none', onUpdate: render,
          onComplete: () => {
            view = target;
            navigation = null;
            delete section.dataset.switching;
            render();
            if (restoreFocus && previous >= 0 && visible) covers[previous].focus({ preventScroll: true });
          },
        });
      }
      seek.current = goTo;
      function fromHash() {
        const index = projects.findIndex(project => location.hash === '#projeto-' + project.id);
        if (index >= 0) {
          arrival.progress = 1;
          entranceTween?.kill();
          goTo(index, false);
        }
      }
      function anchor(event) {
        const link = event.target.closest('a[href^="#projeto-"]');
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        history.pushState(null, '', link.hash);
        fromHash();
      }
      function highlight(index, active) {
        if (index < 0) return;
        gsap.killTweensOf(faces[index]);
        covers[index].dataset.hovered = String(active);
        gsap.to(faces[index], {
          scale: active ? 1.035 : 1, y: active ? -14 : 0,
          rotationX: active ? 8 : 12,
          rotationY: (mobile ? -42 : -48) + (active ? 5 : 0),
          rotationZ: active ? -7 : -11,
          duration: active ? .32 : .45, delay: active ? 0 : .06,
          ease: 'power3.out', overwrite: true,
        });
      }
      const hoverEnter = covers.map((cover, index) => event => {
        if (canHover && event.pointerType === 'mouse' && !pointer?.dragged) highlight(index, true);
      });
      const hoverLeave = covers.map((cover, index) => () => {
        if (keyboardFocus !== index) highlight(index, false);
      });
      function focus(event) {
        const index = covers.indexOf(event.target);
        if (index < 0 || !event.target.matches(':focus-visible')) return;
        keyboardFocus = index;
        angularVelocity = 0;
        highlight(index, true);
        focusTween?.kill();
        const position = { flow };
        // Bring keyboard focus into view, without opening the project.
        focusTween = gsap.to(position, {
          flow: flow + gsap.utils.wrap(-cards.length / 2, cards.length / 2, index - scene().travel - flow),
          duration: .35, ease: 'power2.out', onUpdate: () => { flow = position.flow; render(); },
        });
      }
      function blur(event) {
        const index = covers.indexOf(event.target);
        if (index < 0) return;
        keyboardFocus = -1;
        highlight(index, false);
      }
      function keyboard(event) {
        if (event.key === 'Escape' && selected >= 0) { event.preventDefault(); goTo(-1); return; }
        const index = covers.indexOf(event.target);
        if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1
          : gsap.utils.wrap(0, cards.length, index + (event.key === 'ArrowRight' ? 1 : -1));
        covers[next].focus({ preventScroll: true });
      }
      function finishSwitch() {
        alignmentTween?.kill();
        navigationTween?.progress(1);
      }
      function cancelAlignment() { alignmentTween?.kill(); }
      function pointerDown(event) {
        if (!event.isPrimary || event.button !== 0 || event.target.closest('a, [data-project-detail], [data-gallery-close]')) return;
        finishSwitch();
        focusTween?.kill();
        keyboardFocus = -1;
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastTime: event.timeStamp, dragged: false };
        angularVelocity = 0;
      }
      function pointerMove(event) {
        if (!pointer || event.pointerId !== pointer.id) return;
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
        if (!pointer.dragged) {
          if (Math.hypot(dx, dy) < 8) return;
          // Vertical touch gestures stay with the browser's native page scroll.
          if (Math.abs(dy) > Math.abs(dx)) { pointer = null; return; }
          pointer.dragged = true;
          viewport.setPointerCapture(event.pointerId);
          viewport.dataset.dragging = 'true';
          covers.forEach((_, index) => highlight(index, false));
        }
        if (event.cancelable) event.preventDefault();
        const delta = (event.clientX - pointer.lastX) / trackPitch;
        const dt = Math.max(8, event.timeStamp - pointer.lastTime);
        angularVelocity = gsap.utils.clamp(-4, 4, angularVelocity * .35 + delta / dt * 1000 * .65);
        flow -= delta;
        pointer.lastX = event.clientX;
        pointer.lastTime = event.timeStamp;
        render();
      }
      function pointerUp(event) {
        if (!pointer || event.pointerId !== pointer.id) return;
        if (pointer.dragged) suppressClick.current = performance.now() + 400;
        pointer = null;
        delete viewport.dataset.dragging;
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      }
      document.addEventListener('click', anchor);
      window.addEventListener('hashchange', fromHash);
      section.addEventListener('focusin', focus);
      section.addEventListener('focusout', blur);
      covers.forEach((cover, index) => {
        cover.addEventListener('pointerenter', hoverEnter[index]);
        cover.addEventListener('pointerleave', hoverLeave[index]);
      });
      section.addEventListener('keydown', keyboard);
      viewport.addEventListener('pointerdown', pointerDown);
      viewport.addEventListener('pointermove', pointerMove, { passive: false });
      viewport.addEventListener('pointerup', pointerUp);
      viewport.addEventListener('pointercancel', pointerUp);
      window.addEventListener('pointerup', pointerUp);
      window.addEventListener('wheel', cancelAlignment, { passive: true });
      window.addEventListener('touchstart', cancelAlignment, { passive: true });
      render();
      let disposed = false, refresh = 0;
      document.fonts.ready.then(() => {
        if (disposed) return;
        refresh = requestAnimationFrame(() => {
          measure();
          render();
          fromHash();
        });
      });
      const resize = () => {
        cancelAnimationFrame(refresh);
        refresh = requestAnimationFrame(() => { measure(); render(); });
      };
      window.addEventListener('resize', resize);
      return () => {
        disposed = true;
        visibility.disconnect();
        entranceTween?.kill();
        navigationTween?.kill();
        alignmentTween?.kill();
        focusTween?.kill();
        window.removeEventListener('resize', resize);
        faces.forEach(face => gsap.killTweensOf(face));
        gsap.ticker.remove(tick);
        document.removeEventListener('visibilitychange', syncPlayback);
        cancelAnimationFrame(refresh);
        seek.current = null;
        document.removeEventListener('click', anchor);
        window.removeEventListener('hashchange', fromHash);
        section.removeEventListener('focusin', focus);
        section.removeEventListener('focusout', blur);
        covers.forEach((cover, index) => {
          cover.removeEventListener('pointerenter', hoverEnter[index]);
          cover.removeEventListener('pointerleave', hoverLeave[index]);
        });
        section.removeEventListener('keydown', keyboard);
        viewport.removeEventListener('pointerdown', pointerDown);
        viewport.removeEventListener('pointermove', pointerMove);
        viewport.removeEventListener('pointerup', pointerUp);
        viewport.removeEventListener('pointercancel', pointerUp);
        window.removeEventListener('pointerup', pointerUp);
        window.removeEventListener('wheel', cancelAlignment);
        window.removeEventListener('touchstart', cancelAlignment);
        delete viewport.dataset.dragging;
        delete section.dataset.switching;
        delete section.dataset.showcase;
        delete section.dataset.projectOpen;
        gsap.set([...covers, ...features, ...faces, ...featureFaces, ...details, ...washes, ...copyParts.flat()], { clearProps: 'transform,opacity,zIndex,visibility' });
        cards.forEach((card, i) => {
          delete card.dataset.active;
          details[i].inert = false;
          details[i].removeAttribute('aria-hidden');
          delete covers[i].dataset.featured;
          delete covers[i].dataset.hovered;
          covers[i].removeAttribute('aria-pressed');
        });
      };
    }, root);
    return () => media.revert();
  }, [reduced]);

  function show(index, event) {
    if (performance.now() < suppressClick.current) return;
    if (seek.current) seek.current(index);
    else event.currentTarget.closest('[data-project]').querySelector('[data-project-detail]').scrollIntoView({ block: 'center', behavior: reduced ? 'instant' : 'smooth' });
  }

  return localize(<section id="projetos" className={s.section} ref={root} aria-labelledby="projects-title">
    <div className={s.heading}>
      <h2 id="projects-title"><span data-project-heading-line>Minha bagagem</span><span data-project-heading-line>em projetos.</span></h2>
    </div>
    <p id="gallery-help" className={s.visuallyHidden}>Arraste para os lados para explorar os projetos. Use as setas para navegar e Enter para abrir um projeto.</p>
    <div className={s.stage} ref={stage} aria-describedby="gallery-help">
      <button type="button" className={s.close} data-gallery-close onClick={() => seek.current?.(-1)} aria-label="Fechar projeto"><X size={16}/><span>Voltar à galeria</span></button>
      {projects.map((project, index) => <article key={project.id} id={'projeto-' + project.id}
        data-project={project.id} className={s.project} style={{ '--project-tint': themes[index] }}
        aria-labelledby={'project-title-' + project.id}>
        <div className={s.wash} data-project-wash aria-hidden="true" />
        <button type="button" data-cover className={s.cover}
          aria-label={t('Ver projeto') + ': ' + t(project.name)} onClick={event => show(index, event)}>
          <span className={s.face} data-project-face><img draggable={false} src={project.image} alt={project.imageType + ': ' + project.name}
            loading={index < 2 ? 'eager' : 'lazy'} width="1280" height="720" /></span>
        </button>
        <div className={s.feature} data-project-feature aria-hidden="true">
          <span className={s.face} data-project-face><img draggable={false} src={project.image} alt="" loading="lazy" width="1280" height="720" /></span>
        </div>
        <div className={s.information}>
          <div className={s.copy} data-project-detail>
            <p className={s.topic} data-project-copy-part>{project.topic}</p>
            <h3 id={'project-title-' + project.id} data-project-copy-part>{project.name}</h3>
            <ul className={s.stack} aria-label="Tecnologias" data-project-copy-part>{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
            <p className={s.description} data-project-copy-part>{project.detail}</p>
            <dl className={s.specs}>{project.implementation.map(item =>
              <div key={item.label} data-project-copy-part><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
            <div className={s.actions} data-project-copy-part>
              {project.repo ? <a href={'https://github.com/' + project.repo} {...external}
                aria-label={'GitHub de ' + project.name + (project.private ? ' (repositório privado)' : '')}>
                <Github size={18} /><span>GitHub{project.private && <small>privado</small>}</span>
              </a> : <span className={s.unavailable}>Código não publicado</span>}
              {project.id !== 'cortech' && (project.live
                ? <a href={project.live} {...external} aria-label={'Acessar ' + project.name}>Acessar<ArrowUpRight size={18} /></a>
                : <span className={s.unavailable}>Acesso em atualização</span>)}
            </div>
          </div>
        </div>
      </article>)}
    </div>
  </section>);
}
