import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './i18n';
import { studies } from './studies';
import { unit } from './studyMechanics';
import { useStudyInstruments } from './useStudyInstruments';
import s from './PracticeLab.module.css';

gsap.registerPlugin(ScrollTrigger);

const introduction = {
  pt: ['Automação', 'de processos'],
  en: ['Process', 'automation'],
};

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
      const duration = panels.length - 1;
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
        const slide = playhead.time;
        setTrack(-width * slide);
        panels.forEach((_, i) => {
          const start = Math.max(0, i - 1);
          const end = Math.min(duration, i + 1);
          motion.current.progress[i] = unit((slide - start) / (end - start));
        });
        motion.current.invalidate?.();
      }
      measure();
      section.dataset.horizontal = 'true';
      gsap.to(playhead, {
        time: duration, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section, start: () => 'top ' + inset + 'px', end: () => '+=' + distance,
          scrub: 0.22, refreshPriority: -1, onRefreshInit: measure, onRefresh: render,
        },
      });
      render();
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
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
              <h2 id="studies-title" className={s.title}>{intro[0]} <em>{intro[1]}</em></h2>
            </div>
            <div className={s.instrument} data-instrument="signature" aria-hidden="true"/>
          </div>
        </div>
        {studies.map(study => {
          const words = study[language];
          return <article key={study.id} className={s.panel} data-study={study.id} aria-labelledby={'study-' + study.id}>
            <div className={s.composition}>
              <div className={s.copy}>
                <h3 className={s.title} id={'study-' + study.id}>{words.title[0]} <em>{words.title[1]}</em></h3>
              </div>
              <div className={s.instrument} data-instrument={study.id} aria-hidden="true"/>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
