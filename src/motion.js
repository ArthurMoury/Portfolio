import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useReducedMotion() {
  const forced = new URLSearchParams(window.location.search).get('motion') === 'reduce';
  const [reduced,setReduced] = useState(() => forced || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(forced || media.matches); media.addEventListener('change',update); return () => media.removeEventListener('change',update); },[forced]);
  return reduced;
}

export function usePageMotion(root, reduced, setNavigation, setChapter) {
  useEffect(() => {
    const hero = document.getElementById('inicio');
    const updateNavigation = () => setNavigation(hero.getBoundingClientRect().bottom <= 100);
    updateNavigation();
    window.addEventListener('scroll',updateNavigation,{passive:true});
    window.addEventListener('resize',updateNavigation);
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      // Chapter state stays useful even when motion is reduced.
      q('[data-chapter]').forEach((chapter,i) => ScrollTrigger.create({trigger:chapter,start:'top center',end:'bottom center',onEnter:()=>setChapter(i),onEnterBack:()=>setChapter(i)}));
      if(reduced) return;
      const path = q('[data-hero-stroke]')[0];
      const length = path.getTotalLength();
      const entry = gsap.timeline({defaults:{ease:'power3.out'}});
      entry.from(q('[data-badge]'),{y:-90,rotation:10,scale:0.94,opacity:0.85,duration:1.2,clearProps:'all'},0.08)
        .from(q('[data-hero-copy]'),{y:28,opacity:0.8,stagger:0.09,duration:0.75,clearProps:'all'},0.28)
        .fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.8,ease:'power2.inOut'},0.45)
        .from(q('picture img'),{scale:1.07,duration:1.7,clearProps:'all'},0);
      const journey = q('[data-journey-path]')[0];
      const journeyLength = journey.getTotalLength();
      gsap.fromTo(journey,{strokeDasharray:journeyLength,strokeDashoffset:journeyLength},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:journey,start:'top 92%',end:'bottom 40%',scrub:0.5}});
      gsap.to(q('[data-wave]'),{attr:{d:'M0 28C290 110 405 124 720 60S1170 22 1440 90V130H0Z'},ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:0.7}});
      media.add('(min-width: 900px)',() => {
        q('[data-chapter-visual]').forEach((visual,i) => {
          ScrollTrigger.create({trigger:q('[data-chapter]')[i],start:'top center',onEnter:()=>gsap.fromTo(visual,{y:24,scale:0.96,rotateY:-5},{y:0,scale:1,rotateY:0,duration:0.7,ease:'power3.out',overwrite:true}),onEnterBack:()=>gsap.fromTo(visual,{y:-18,scale:0.97},{y:0,scale:1,duration:0.6,ease:'power3.out',overwrite:true})});
        });
        gsap.fromTo(q('[data-device]'),{y:28,rotate:7},{y:-34,rotate:0,ease:'none',scrollTrigger:{trigger:'#proxima-ideia',start:'top bottom',end:'bottom top',scrub:0.8}});
        gsap.fromTo(q('[data-device-shape]'),{y:-25,rotate:-8},{y:35,rotate:8,ease:'none',scrollTrigger:{trigger:'#proxima-ideia',start:'top bottom',end:'bottom top',scrub:1.2}});
      });
      media.add('(max-width: 899px)',() => {
        q('[data-chapter] img').forEach(image => gsap.from(image,{y:18,scale:0.97,duration:0.6,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:image,start:'top 95%',once:true}}));
      });
    },root);
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load',refresh);
    return () => { window.removeEventListener('scroll',updateNavigation); window.removeEventListener('resize',updateNavigation); media.revert(); ctx.revert(); window.removeEventListener('load',refresh); };
  },[root,reduced,setNavigation,setChapter]);
}
