import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useReducedMotion() {
  const forced=new URLSearchParams(window.location.search).get('motion')==='reduce';
  const [reduced,setReduced]=useState(()=>forced||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(forced||media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[forced]);
  return reduced;
}

export function usePageMotion(root,reduced,setNavigation,setChapter,setContext,setActiveSection) {
  useEffect(()=>{
    let frame=0;
    let disposed=false;
    const hero=document.getElementById('inicio');
    const markers=[...root.current.querySelectorAll('[data-context]')];
    const chapterElements=[...root.current.querySelectorAll('[data-chapter]')];
    const sections=[...root.current.querySelectorAll('main section[id]')];
    const progress=root.current.querySelector('[data-reading-progress]');
    const update=()=>{
      frame=0;
      const openingFlight=ScrollTrigger.getById('opening-flight');
      setNavigation(openingFlight ? window.scrollY > openingFlight.end + 20 : hero.getBoundingClientRect().bottom<=132);
      let context='pessoa';
      for(const el of markers)if(el.getBoundingClientRect().top<=window.innerHeight*.45)context=el.dataset.context;
      setContext(context);
      let activeSection='inicio';
      for(const section of sections)if(section.getBoundingClientRect().top<=180)activeSection=section.id;
      setActiveSection(activeSection);
      let chapterIndex=0;
      const stage=root.current.querySelector('[data-career-story] aside');
      const stageBottom=stage?.getBoundingClientRect().bottom||0;
      const chapterLine=innerWidth<900?Math.min(innerHeight-50,stageBottom+(innerHeight-stageBottom)*.3):innerHeight*.55;
      chapterElements.forEach((chapter,i)=>{if(chapter.getBoundingClientRect().top<=chapterLine)chapterIndex=i;});
      setChapter(chapterIndex);
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(progress)progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const jumpToAbout=e=>{
      if(e.target.closest('a[href="#sobre"]')&&!reduced){
        e.preventDefault();
        const flight=ScrollTrigger.getById('opening-flight');
        if(flight)window.scrollTo({top:flight.end,behavior:'smooth'});
      }
    };
    document.addEventListener('click',jumpToAbout);
    update();
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
    const media=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root);
      if(reduced)return;
      q('#projetos h2, #trajetoria h2, #certificados h2').forEach(title => {
        gsap.from(title, { y: 38, clipPath: 'inset(0 0 18% 0)', duration: 1.1, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: title, start: 'top 92%', once: true } });
      });
      const transition=q('[data-section-transition]')[0];
      if(transition)gsap.fromTo(q('[data-transition-surface]'),{attr:{d:'M0 160Q720 -100 1440 160V200H0Z'}},{attr:{d:'M0 0Q720 0 1440 0V200H0Z'},ease:'none',scrollTrigger:{trigger:transition,start:'top bottom',end:'bottom 35%',scrub:.7}});
      q('[data-project]').forEach(band => {
        gsap.from(band.querySelector('h3'), { x: -30, duration: .85, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: band, start: 'top 90%', once: true } });
      });
      q('[data-chapter-visual]').forEach((visual,i)=>{
        const show=direction=>gsap.fromTo(visual,{y:direction*18,scale:.96,clipPath:direction>0?'inset(0 0 12% 0)':'inset(12% 0 0 0)'},{y:0,scale:1,clipPath:'inset(0 0 0% 0)',duration:.7,ease:'power3.out',overwrite:true});
        ScrollTrigger.create({trigger:q('[data-chapter]')[i],start:()=>`top ${innerWidth<900?'58%':'55%'}`,onEnter:()=>show(1),onEnterBack:()=>show(-1)});
      });
    },root);
    const refresh=()=>{if(!disposed){ScrollTrigger.refresh();queue();}};
    document.fonts.ready.then(()=>{
      if(disposed) return;
      refresh();
      // React mounts after the browser's first anchor lookup on a direct URL.
      const id=window.location.hash.slice(1);
      if(id && window.scrollY===0){
        const flight=ScrollTrigger.getById('opening-flight');
        if(id==='sobre'&&flight)window.scrollTo({top:flight.end,behavior:'instant'});
        else document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});
      }
      queue();
    });
    window.addEventListener('load',refresh);
    return()=>{disposed=true;document.removeEventListener('click',jumpToAbout);cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);window.removeEventListener('load',refresh);media.revert();ctx.revert();};
  },[root,reduced,setNavigation,setChapter,setContext,setActiveSection]);
}
