import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from './i18n';
import { studies } from './studies';
import { useStudyInstruments } from './useStudyInstruments';
import KineticGlyphs from './KineticGlyphs';
import s from './PracticeLab.module.css';

gsap.registerPlugin(ScrollTrigger);

const introduction = {
  pt: ['Automação', 'de processos'],
  en: ['Process', 'automation'],
};

function StudyTitle({ as: Heading, id, lines }) {
  function words(line) {
    return line.split(' ').map((word, index) => (
      <span key={index}>{index > 0 && ' '}<span className={s.word} data-study-word>{word}</span></span>
    ));
  }
  return <Heading id={id} className={s.title} aria-label={lines.join(' ')}>
    <span aria-hidden="true">{words(lines[0])}</span>{' '}
    <em aria-hidden="true">{words(lines[1])}</em>
  </Heading>;
}

export default function PracticeLab({ reduced }) {
  const language = useLanguage();
  const intro = introduction[language];
  const root = useRef(null), viewport = useRef(null), track = useRef(null);
  const motion = useRef({ horizontal: false, slide: 0, invalidate: null });
  useStudyInstruments(viewport, motion, reduced);

  useLayoutEffect(() => {
    if (reduced) return;
    const animation = gsap.context(() => {
      const section = root.current;
      const panels = [...track.current.children];
      const playhead = { time: 0 };
      const duration = panels.length - 1;
      const setTrack = gsap.quickSetter(track.current, 'x', 'px');
      const reveals = panels.map((panel, index) => {
        const words = panel.querySelectorAll('[data-study-word]');
        return gsap.timeline({ paused: true }).fromTo(words, {
          clipPath: index % 2 ? 'inset(-15% 0 -15% 100%)' : 'inset(-15% 100% -15% 0)',
          xPercent: index % 2 ? -18 : 18, skewX: index % 2 ? 8 : -8,
        }, {
          clipPath: 'inset(-15% -8% -15% -8%)', xPercent: 0, skewX: 0, duration: 1, stagger: .19,
          ease: 'power2.inOut',
        });
      });
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
        for (let index = 1; index < reveals.length; index++) {
          reveals[index].progress(gsap.utils.clamp(0, 1, (slide - index + .68) / .58));
        }
        motion.current.slide = slide;
        motion.current.invalidate?.();
      }
      measure();
      section.dataset.horizontal = 'true';
      gsap.fromTo(section.querySelectorAll('[data-certificate-shutter]'), {
        scaleX: 1,
      }, {
        scaleX: 0, stagger: .12, ease: 'sine.inOut',
        scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 28%', scrub: .25 },
      });
      ScrollTrigger.create({
        trigger: section, start: () => 'top ' + (inset + (innerHeight - inset) * .36) + 'px',
        end: () => 'top ' + inset + 'px', animation: reveals[0], scrub: .2,
      });
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
    return () => animation.revert();
  }, [reduced, language]);

  return <section id="processo" className={s.section} ref={root} data-context="estudos" aria-labelledby="studies-title">
    <div className={s.viewport} ref={viewport}>
      <KineticGlyphs motion={motion} reduced={reduced} />
      <div className={s.shutters} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <i key={index} data-certificate-shutter />)}
      </div>
      <div className={s.track} ref={track}>
        <div className={s.panel} data-study="signature">
          <div className={s.composition}>
            <div className={s.copy}>
              <StudyTitle as="h2" id="studies-title" lines={intro} />
            </div>
            <div className={s.instrument} data-instrument="signature" aria-hidden="true">
            </div>
          </div>
        </div>
        {studies.map(study => {
          const words = study[language];
          return <article key={study.id} className={s.panel} data-study={study.id} aria-labelledby={'study-' + study.id}>
            <div className={s.composition}>
              <div className={s.copy}>
                <StudyTitle as="h3" id={'study-' + study.id} lines={words.title} />
              </div>
              <div className={s.instrument} data-instrument={study.id} aria-hidden="true"/>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
