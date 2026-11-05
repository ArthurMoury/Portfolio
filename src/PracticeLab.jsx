import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './i18n';
import { studies } from './studies';
import { unit, blend } from './studyMechanics';
import { useStudyInstruments } from './useStudyInstruments';
import s from './PracticeLab.module.css';

gsap.registerPlugin(ScrollTrigger);

const introduction = {
  pt: { title: ['Matéria', 'de código.'], body: 'Acompanhe um sopro pelo circuito, uma instrução pela memória e um salário até a média.' },
  en: { title: ['Code,', 'in material.'], body: 'Follow a breath through a circuit, an instruction through memory and a salary into an average.' },
};

// Give each mechanism time to operate in place before moving to the next.
const work = 0.78, crossing = 0.58, stride = work + crossing;

export default function PracticeLab({ reduced }) {
  const language = useLanguage();
  const intro = introduction[language];
  const root = useRef(null), viewport = useRef(null), track = useRef(null);
  const motion = useRef({ horizontal: false, progress: new Array(studies.length + 1).fill(0), invalidate: null });
  useStudyInstruments(viewport, motion, reduced);

  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add('(min-height: 510px), (min-width: 650px) and (min-height: 350px)', () => {
      const section = root.current;
      const panels = [...track.current.children];
      const playhead = { time: 0 };
      const duration = stride * (panels.length - 1) + work;
      const setTrack = gsap.quickSetter(track.current, 'x', 'px');
      let width, distance, inset;
      motion.current.horizontal = true;

      function measure() {
        inset = document.querySelector('header nav')?.closest('header')?.offsetHeight ?? 0;
        const height = Math.max(1, window.innerHeight - inset);
        width = section.clientWidth;
        distance = duration * Math.min(width * 1.22, height * 0.96);
        section.style.setProperty('--nav-inset', inset + 'px');
        section.style.setProperty('--view-height', height + 'px');
        section.style.setProperty('--travel-height', distance + 'px');
      }
      function render() {
        const station = Math.min(panels.length - 1, Math.floor(playhead.time / stride));
        const local = playhead.time - station * stride;
        const slide = Math.min(panels.length - 1, station + blend((local - work) / crossing));
        setTrack(-width * slide);
        for (let i = 0; i < panels.length; i++) {
          motion.current.progress[i] = unit((playhead.time - i * stride) / work);
        }
        motion.current.invalidate?.();
      }
      measure();
      section.dataset.horizontal = 'true';
      const animation = gsap.to(playhead, {
        time: duration, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section, start: () => 'top ' + inset + 'px', end: () => '+=' + distance,
          scrub: 0.22, refreshPriority: -1, onRefreshInit: measure, onRefresh: render,
        },
      });
      // Tab can reach each real source link, including links beyond the visible panel.
      function followFocus(event) {
        const panel = event.target.closest('[data-study]');
        if (!panel || !event.target.matches(':focus-visible')) return;
        if (Math.abs(panel.getBoundingClientRect().left) < 2) return;
        const time = stride * panels.indexOf(panel) + work / 2;
        const trigger = animation.scrollTrigger;
        window.scrollTo({ top: trigger.start + distance * time / duration, behavior: 'instant' });
        trigger.update();
        trigger.getTween()?.progress(1);
      }
      track.current.addEventListener('focusin', followFocus);
      const rail = track.current;
      render();
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        rail.removeEventListener('focusin', followFocus);
        delete section.dataset.horizontal;
        motion.current.horizontal = false;
        setTrack(0);
        motion.current.invalidate?.();
      };
    }, root);
    return () => media.revert();
  }, [reduced]);

  return <section id="processo" className={s.section} ref={root} data-context="estudos" aria-labelledby="studies-title">
    <div className={s.viewport} ref={viewport}>
      <div className={s.track} ref={track}>
        <div className={s.panel} data-study="signature">
          <div className={s.composition}>
            <div className={s.copy}>
              <h2 id="studies-title" className={s.title}>{intro.title[0]} <em>{intro.title[1]}</em></h2>
              <p>{intro.body}</p>
            </div>
            <div className={s.instrument} data-instrument="signature" aria-hidden="true"/>
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
              <div className={s.instrument} data-instrument={study.id} aria-hidden="true"/>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
