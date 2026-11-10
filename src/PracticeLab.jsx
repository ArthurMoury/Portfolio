import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion as Motion, useScroll, useTransform } from 'motion/react';
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
  const { scrollYProgress: entry } = useScroll({ target: root, offset: ['start end', 'start start'] });
  const backgroundY = useTransform(entry, [0, 1], [-180, 100]);
  const foregroundY = useTransform(entry, [0, 1], [-80, 0]);
  const atmosphere = useTransform(entry, [0, .45, 1], [0, .85, 0]);
  const motion = useRef({ axis: null, slide: 0, invalidate: null });
  useStudyInstruments(viewport, motion, reduced);

  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add({ mobile: '(max-width: 899px)', desktop: '(min-width: 900px)' }, context => {
      const vertical = context.conditions.mobile;
      const section = root.current;
      const panels = [...track.current.children];
      const readingInterval = vertical ? .16 : .12;
      const playhead = { time: -readingInterval };
      const duration = panels.length - 1;
      const setTrack = gsap.quickSetter(track.current, vertical ? 'y' : 'x', 'px');
      const setPanels = panels.map(panel=>gsap.quickSetter(panel,'css'));
      const smooth=value=>{const x=gsap.utils.clamp(0,1,value);return x*x*(3-2*x);};
      const reveals = panels.map((panel, index) => {
        if (index === 0) return null; // The certificate particles reveal this heading.
        const words = panel.querySelectorAll('[data-study-word]');
        return gsap.timeline({ paused: true }).fromTo(words, {
          clipPath: index % 2 ? 'inset(-15% 0 -15% 100%)' : 'inset(-15% 100% -15% 0)',
          xPercent: vertical ? 0 : index % 2 ? -18 : 18, yPercent: vertical ? 28 : 0, skewX: vertical ? 0 : index % 2 ? 8 : -8,
        }, {
          clipPath: 'inset(-15% -8% -15% -8%)', xPercent: 0, yPercent: 0, skewX: 0, duration: 1, stagger: .19,
          ease: 'power2.inOut',
        });
      });
      let width, height, distance, inset;
      motion.current.axis = vertical ? 'vertical' : 'horizontal';

      function measure() {
        inset = document.querySelector('header nav')?.closest('header')?.offsetHeight ?? 0;
        section.style.setProperty('--nav-inset', inset + 'px');
        height = Math.max(1, vertical ? viewport.current.clientHeight : window.innerHeight - inset);
        width = section.clientWidth;
        distance = (duration + readingInterval) * (vertical ? height * .76 : Math.min(width * 1.22, height * 0.96));
        section.style.setProperty('--view-height', height + 'px');
        section.style.setProperty('--travel-height', distance + 'px');
      }
      function render() {
        const slide = Math.max(0, playhead.time);
        const entrance = Math.min(1, slide / (vertical ? .18 : .30));
        section.style.setProperty('--shape-entrance', entrance * entrance * (3 - 2 * entrance));
        if(vertical){
          setTrack(0);
          setPanels.forEach((set,index)=>{
            const offset=slide-index;
            const opacity=offset>=0?1-smooth((offset-.12)/.34):smooth((.48+offset)/.34);
            set({opacity,y:gsap.utils.clamp(-70,100,-offset*height*.16)});
          });
        }else setTrack(-width * slide);
        for (let index = 1; index < reveals.length; index++) {
          reveals[index].progress(gsap.utils.clamp(0, 1, (slide - index + (vertical ? .48 : .68)) / (vertical ? .34 : .58)));
        }
        motion.current.slide = slide;
        motion.current.invalidate?.();
      }
      section.dataset.flow = vertical ? 'vertical' : 'horizontal';
      if (!vertical) section.dataset.horizontal = 'true';
      measure();
      gsap.to(playhead, {
        time: duration, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section, start: () => 'top ' + inset + 'px', end: () => '+=' + distance,
          scrub: vertical ? .12 : .22, refreshPriority: -1, onRefreshInit: measure, onRefresh: render,
        },
      });
      render();
      const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refresh);
        delete section.dataset.horizontal;
        delete section.dataset.flow;
        section.style.removeProperty('--shape-entrance');
        motion.current.axis = null;
        setTrack(0);
        gsap.set(panels,{clearProps:'opacity,transform'});
        motion.current.invalidate?.();
      };
    }, root);
    return () => media.revert();
  }, [reduced, language]);

  return <section id="processo" className={s.section} ref={root} data-context="estudos" aria-labelledby="studies-title">
    <div className={s.viewport} ref={viewport}>
      {!reduced && <div className={s.entryBackground} aria-hidden="true"><Motion.div className={s.entryAtmosphere} data-learning-parallax style={{ y: backgroundY, opacity: atmosphere }}/></div>}
      <KineticGlyphs motion={motion} reduced={reduced} />
      <div className={s.track} ref={track}>
        <div className={s.panel} data-study="signature">
          <div className={s.composition}>
            <Motion.div className={s.copy} data-learning-foreground style={reduced ? undefined : { y: foregroundY }}>
              <StudyTitle as="h2" id="studies-title" lines={intro} />
            </Motion.div>
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
