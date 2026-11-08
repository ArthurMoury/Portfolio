import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ScanLine } from 'lucide-react';
import Github from './GithubIcon';
import { projects } from './data/portfolio';
import { localize, t } from './i18n';
import s from './ProjectGallery.module.css';

gsap.registerPlugin(ScrollTrigger);

const themes = ['#93ad88', '#b69ddf', '#92b990', '#deaa91', '#de9a86', '#91bf9d', '#94b9bd'];
const clamp = gsap.utils.clamp(0, 1);
const ease = value => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
const external = { target: '_blank', rel: 'noreferrer noopener' };

export default function ProjectGallery({ reduced, onOpen }) {
  const root = useRef(null), stage = useRef(null), seek = useRef(null);

  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 600px)', () => {
      const section = root.current, viewport = stage.current;
      const cards = [...section.querySelectorAll('[data-project]')];
      const covers = cards.map(card => card.querySelector('[data-cover]'));
      const details = cards.map(card => card.querySelector('[data-project-detail]'));
      const washes = cards.map(card => card.querySelector('[data-project-wash]'));
      const playhead = { position: 0 };
      let width, height, mobile, inset, distance, coverWidth, coverHeight, coverTop, coverLeft;
      let lastFocused = -2;
      section.dataset.showcase = 'true';

      function measure() {
        inset = document.querySelector('header')?.offsetHeight || 72;
        section.style.setProperty('--gallery-inset', inset + 'px');
        width = viewport.clientWidth;
        height = viewport.clientHeight;
        mobile = width < 900;
        coverWidth = mobile ? width - 40 : Math.min(width * .57, 920);
        coverHeight = mobile ? Math.min(coverWidth * .625, height * (height < 700 ? .24 : .30)) : Math.min(coverWidth * .625, height * .66);
        coverTop = mobile ? 20 : Math.max(24, (height * .84 - coverHeight) / 2);
        coverLeft = mobile ? 20 : width * .045;
        distance = projects.length * height * (mobile ? 1.55 : 1.4);
        section.style.setProperty('--gallery-travel', distance + 'px');
        section.style.setProperty('--gallery-heading', section.querySelector('h2').parentElement.offsetHeight + 'px');
        section.style.setProperty('--gallery-height', height + 'px');
        section.style.setProperty('--cover-width', coverWidth + 'px');
        section.style.setProperty('--cover-height', coverHeight + 'px');
        section.style.setProperty('--cover-top', coverTop + 'px');
        section.style.setProperty('--cover-left', coverLeft + 'px');
      }

      function render() {
        const position = Math.min(projects.length - .00001, playhead.position);
        const index = Math.floor(position), phase = position - index;
        const approach = ease((phase - .07) / .23);
        const retreat = ease((phase - .73) / .22);
        const focus = approach * (1 - retreat);
        const read = ease((phase - .26) / .10) * (1 - ease((phase - .70) / .12));
        const travel = index + ease((phase - .92) / .08);
        const focused = read > .65 ? index : -1;

        if (focused !== lastFocused) {
          cards.forEach((card, i) => {
            const active = i === focused;
            card.dataset.active = String(active);
            details[i].inert = !active;
            details[i].setAttribute('aria-hidden', String(!active));
            covers[i].dataset.featured = String(active);
            covers[i].setAttribute('aria-label', active
              ? t('Ampliar imagem: ' + projects[i].name)
              : t('Ver projeto') + ': ' + t(projects[i].name));
          });
          lastFocused = focused;
        }

        cards.forEach((card, i) => {
          const offset = i - travel;
          const zoom = i === index ? focus : 0;
          const thumbWidth = mobile ? 100 : Math.min(190, width * .145);
          const scale = thumbWidth / coverWidth;
          const spacing = mobile ? 118 : thumbWidth + 40;
          // Covers return to their place in the same depth-ordered film strip.
          const railX = width * .5 + offset * spacing - coverWidth / 2;
          const railY = height * (mobile && height < 700 ? .89 : .84) - coverHeight / 2 - Math.min(3, Math.abs(offset)) * 10;
          const x = railX + (coverLeft - railX) * zoom;
          const y = railY + (coverTop - railY) * zoom;
          gsap.set(covers[i], {
            x, y, scale: scale + (1 - scale) * zoom,
            rotationY: -Math.sign(offset) * Math.min(36, Math.abs(offset) * 16) * (1 - zoom),
            rotationZ: offset * -2 * (1 - zoom),
            opacity: Math.abs(offset) > 3.5 ? 0 : 1,
            zIndex: i === index ? 20 : 10 - Math.min(8, Math.round(Math.abs(offset))),
          });
          const visible = i === index ? read : 0;
          gsap.set(details[i], { opacity: visible, y: (1 - visible) * 24 });
          gsap.set(washes[i], { opacity: zoom * .16 });
        });
      }
      measure();
      const tween = gsap.to(playhead, {
        position: projects.length, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section, start: () => 'top ' + (inset - section.querySelector('h2').parentElement.offsetHeight) + 'px', end: () => '+=' + distance,
          scrub: .18, refreshPriority: -1, onRefreshInit: measure, onRefresh: render,
        },
      });
      function goTo(index) {
        const trigger = tween.scrollTrigger;
        window.scrollTo({
          top: trigger.start + (index + .49) / projects.length * (trigger.end - trigger.start),
          behavior: 'instant',
        });
      }
      seek.current = goTo;
      function fromHash() {
        const index = projects.findIndex(project => location.hash === '#projeto-' + project.id);
        if (index >= 0) goTo(index);
      }
      function anchor(event) {
        const link = event.target.closest('a[href^="#projeto-"]');
        if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        history.pushState(null, '', link.hash);
        fromHash();
      }
      function focus(event) {
        const index = covers.indexOf(event.target);
        if (index >= 0 && covers[index].dataset.featured !== 'true') goTo(index);
      }
      document.addEventListener('click', anchor);
      window.addEventListener('hashchange', fromHash);
      section.addEventListener('focusin', focus);
      render();
      let disposed = false, refresh = 0;
      document.fonts.ready.then(() => {
        if (disposed) return;
        refresh = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          fromHash();
        });
      });
      return () => {
        disposed = true;
        cancelAnimationFrame(refresh);
        seek.current = null;
        document.removeEventListener('click', anchor);
        window.removeEventListener('hashchange', fromHash);
        section.removeEventListener('focusin', focus);
        delete section.dataset.showcase;
        cards.forEach((card, i) => {
          delete card.dataset.active;
          details[i].inert = false;
          details[i].removeAttribute('aria-hidden');
          delete covers[i].dataset.featured;
        });
      };
    }, root);
    return () => media.revert();
  }, [reduced]);

  function show(project, index, event) {
    if (seek.current && event.currentTarget.dataset.featured !== 'true') {
      seek.current(index);
      return;
    }
    onOpen({ image: project.image, title: project.name, caption: project.imageType + ', ' + project.summary });
  }

  return localize(<section id="projetos" className={s.section} ref={root} aria-labelledby="projects-title">
    <div className={s.heading}>
      <h2 id="projects-title"><span data-project-heading-line>Minha bagagem</span><span data-project-heading-line>em projetos.</span></h2>
    </div>
    <div className={s.stage} ref={stage}>
      {projects.map((project, index) => <article key={project.id} id={'projeto-' + project.id}
        data-project={project.id} className={s.project} style={{ '--project-tint': themes[index] }}
        aria-labelledby={'project-title-' + project.id}>
        <div className={s.wash} data-project-wash aria-hidden="true" />
        <button type="button" data-cover className={s.cover}
          aria-label={'Ampliar imagem: ' + project.name} onClick={event => show(project, index, event)}>
          <img src={project.image} alt={project.imageType + ': ' + project.name}
            loading={index < 2 ? 'eager' : 'lazy'} width="1280" height="720" />
          <span className={s.expand}><ScanLine size={16} /><span>Ampliar</span></span>
        </button>
        <div className={s.information}>
          <div className={s.copy} data-project-detail>
            <p className={s.topic}>{project.topic}</p>
            <h3 id={'project-title-' + project.id}>{project.name}</h3>
            <p className={s.description}>{project.detail}</p>
            <dl className={s.specs}>{project.implementation.map(item =>
              <div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
            <div className={s.actions}>
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
