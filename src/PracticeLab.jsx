import { useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './i18n';
import { studies } from './studies';
import s from './PracticeLab.module.css';

gsap.registerPlugin(ScrollTrigger);

const introduction = {
  pt: { tab: 'Matéria', title: ['Matéria', 'de código.'], body: 'Acompanhe um sopro pelo circuito, uma instrução pela memória e um salário até a média.', nav: 'Percorrer os estudos', label: 'Estudos de engenharia' },
  en: { tab: 'Material', title: ['Code,', 'in material.'], body: 'Follow a breath through a circuit, an instruction through memory and a salary into an average.', nav: 'Explore the studies', label: 'Engineering studies' },
};

function Signature({ reduced, travel }) {
  const host = useRef(null);
  useEffect(() => {
    if (reduced) return;
    let released = false;
    let dispose;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      import('./studySculpture').then(({ mountSculpture }) => {
        if (!released) dispose = mountSculpture(host.current, travel);
      }).catch(() => { /* The material study remains visible when WebGL is unavailable. */ });
    }, { rootMargin: '350px' });
    observer.observe(host.current);
    return () => {
      released = true;
      observer.disconnect();
      dispose?.();
    };
  }, [reduced, travel]);

  return <div ref={host} className={s.signature} aria-hidden="true">
    <img src="/studies/signature.webp" width="800" height="800" alt="" loading="lazy" />
  </div>;
}

export default function PracticeLab({ reduced }) {
  const language = useLanguage();
  const intro = introduction[language];
  const root = useRef(null);
  const track = useRef(null);
  const travel = useRef(0);
  const jump = useRef(null);
  const tabs = [intro.tab, ...studies.map(study => study[language].tab)];

  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 510px), (min-width: 650px) and (min-height: 350px)', () => {
      const section = root.current;
      const panels = [...track.current.children];
      const controls = [...section.querySelectorAll('[data-study-nav]')];
      const header = document.querySelector('header nav')?.closest('header');
      const position = { value: 0 };
      const hold = 0.21;
      const length = panels.length - 1 + hold * 2;
      let width, distance, topInset, selected = -1;
      const setTrack = gsap.quickSetter(track.current, 'x', 'px');
      const drawings = panels.map(panel => panel.querySelector('[data-study-art]'));
      function measure() {
        topInset = header?.offsetHeight ?? 0;
        const available = Math.max(1, window.innerHeight - topInset);
        width = section.clientWidth;
        distance = length * Math.min(width, available * 0.96);
        section.style.setProperty('--nav-inset', topInset + 'px');
        section.style.setProperty('--view-height', available + 'px');
        section.style.setProperty('--travel-height', distance + 'px');
      }
      function render() {
        const slide = gsap.utils.clamp(0, panels.length - 1, position.value - hold);
        const active = Math.round(slide);
        setTrack(-slide * width);
        travel.current = Math.min(1, position.value * 1.2);
        drawings.forEach((drawing, i) => {
          if (!drawing) return;
          const offset = gsap.utils.clamp(-1, 1, slide - i);
          drawing.style.transform = 'translateX(' + offset * 13 + '%) rotate(' + offset * 7 + 'deg)';
        });
        if (selected === active) return;
        selected = active;
        panels.forEach((panel, i) => { panel.inert = i !== active; });
        controls.forEach((control, i) => {
          if (i === active) control.setAttribute('aria-current', 'step');
          else control.removeAttribute('aria-current');
        });
      }

      measure();
      section.dataset.horizontal = 'true';
      const animation = gsap.to(position, {
        value: length, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section,
          start: () => 'top ' + topInset + 'px',
          end: () => '+=' + distance,
          scrub: 0.35, refreshPriority: -1,
          onRefreshInit: measure, onRefresh: render,
        },
      });
      render();
      jump.current = index => {
        const trigger = animation.scrollTrigger;
        const progress = (index + hold) / length;
        window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: 'smooth' });
      };
      // Other page anchors depend on the space added by this sticky strip.
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        jump.current = null;
        travel.current = 0;
        delete section.dataset.horizontal;
        setTrack(0);
        drawings.forEach(drawing => drawing?.style.removeProperty('transform'));
        controls.forEach(control => control.removeAttribute('aria-current'));
        panels.forEach(panel => { panel.inert = false; });
      };
    }, root);
    return () => media.revert();
  }, [reduced]);

  return <section id="processo" className={s.section} ref={root} data-context="estudos" aria-labelledby="studies-title">
    <div className={s.viewport}>
      <div className={s.index}>
        <span className={s.imprint}><img src="/studies/moury-mark.svg" width="38" height="24" alt=""/>{intro.label}</span>
        <nav aria-label={intro.nav}>
          {tabs.map((tab, i) => <button type="button" key={i} data-study-nav onClick={() => jump.current?.(i)}>{tab}</button>)}
        </nav>
      </div>
      <div className={s.track} ref={track}>
        <div className={s.panel} data-study="signature">
          <div className={s.composition}>
            <div className={s.copy}>
              <h2 id="studies-title" className={s.title}>{intro.title[0]} <em>{intro.title[1]}</em></h2>
              <p>{intro.body}</p>
            </div>
            <Signature reduced={reduced} travel={travel}/>
          </div>
        </div>
        {studies.map(study => {
          const words = study[language];
          return <article key={study.id} className={s.panel} data-study={study.id} style={{ '--tint': study.tint }} aria-labelledby={'study-' + study.id}>
            <div className={s.composition}>
              <div className={s.copy}>
                <p className={s.projectName}>{words.name}</p>
                <h3 className={s.title} id={'study-' + study.id}>{words.title[0]} <em>{words.title[1]}</em></h3>
                <p>{words.copy}</p>
                <a className={s.source} href={study.source} target="_blank" rel="noopener noreferrer">{words.link}<ArrowUpRight size={17} aria-hidden="true"/></a>
              </div>
              <figure className={s.artwork}>
                <img data-study-art src={'/studies/' + study.image + '.webp'} alt="" width="1024" height="1024" loading="lazy"/>
                <figcaption><i aria-hidden="true"/><code>{study.detail}</code></figcaption>
              </figure>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
