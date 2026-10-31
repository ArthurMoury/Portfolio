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
    const sections=[...root.current.querySelectorAll('main > section[id]')];
    const progress=root.current.querySelector('[data-reading-progress]');
    const update=()=>{
      frame=0;
      setNavigation(hero.getBoundingClientRect().bottom<=132);
      let context='pessoa';
      for(const el of markers)if(el.getBoundingClientRect().top<=window.innerHeight*.45)context=el.dataset.context;
      setContext(context);
      let activeSection='inicio';
      for(const section of sections)if(section.getBoundingClientRect().top<=180)activeSection=section.id;
      setActiveSection(activeSection);
      let chapterIndex=0;
      chapterElements.forEach((chapter,i)=>{if(chapter.getBoundingClientRect().top<=window.innerHeight*.55)chapterIndex=i;});
      setChapter(chapterIndex);
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(progress)progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
    const media=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root);
      if(reduced)return;
      q('#projetos h2, #trajetoria h2, #certificados h2').forEach(title => {
        gsap.from(title, { y: 38, clipPath: 'inset(0 0 18% 0)', duration: 1.1, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: title, start: 'top 92%', once: true } });
      });
      q('[data-about-piece]').forEach((piece,i)=>gsap.from(piece,{opacity:0,y:30,duration:.9,delay:(i%3)*.07,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:piece,start:'top 93%',once:true}}));
      const portrait=q('[data-about-photo]')[0];
      if(portrait){
        const image=portrait.querySelector('img');
        gsap.timeline({scrollTrigger:{trigger:portrait,start:'top 92%',end:'bottom 8%',scrub:.55}})
          .fromTo(portrait,{clipPath:'inset(0 100% 0 0)',x:22},{clipPath:'inset(0 0% 0 0)',x:0,duration:.25,ease:'power3.out'})
          .fromTo(image,{scale:1.16,xPercent:-8},{scale:1,xPercent:0,duration:.3,ease:'power3.out'},0)
          .to(portrait,{clipPath:'inset(0 0% 0 0)',duration:.45})
          .to(portrait,{clipPath:'inset(0 0 0 100%)',x:-18,duration:.25,ease:'power2.in'})
          .to(image,{scale:1.08,xPercent:6,duration:.25},.75);
      }
      const transition=q('[data-section-transition]')[0];
      if(transition)gsap.fromTo(q('[data-transition-surface]'),{attr:{d:'M0 160Q720 -100 1440 160V200H0Z'}},{attr:{d:'M0 0Q720 0 1440 0V200H0Z'},ease:'none',scrollTrigger:{trigger:transition,start:'top bottom',end:'bottom 35%',scrub:.7}});
      q('[data-project]').forEach(band => {
        gsap.from(band.querySelector('h3'), { x: -30, duration: .85, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: band, start: 'top 90%', once: true } });
      });
      media.add('(min-width:900px)',()=>{
        q('[data-chapter-visual]').forEach((visual,i)=>{
          const show=direction=>gsap.fromTo(visual,{y:direction*18,scale:.97},{y:0,scale:1,duration:.65,ease:'power3.out',overwrite:true});
          ScrollTrigger.create({trigger:q('[data-chapter]')[i],start:'top 55%',onEnter:()=>show(1),onEnterBack:()=>show(-1)});
        });
      });
      media.add('(max-width:899px)',()=>{
        q('[data-chapter-mobile]').forEach(visual=>{
          gsap.from(visual,{y:24,scale:.96,rotateX:4,opacity:.3,duration:.85,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:visual,start:'top 94%',once:true}});
          gsap.fromTo(visual.querySelector('img'),{scale:1.04,yPercent:2},{scale:1,yPercent:-2,ease:'none',scrollTrigger:{trigger:visual,start:'top bottom',end:'bottom top',scrub:.55}});
        });
      });
    },root);
    const refresh=()=>{if(!disposed){ScrollTrigger.refresh();queue();}};
    document.fonts.ready.then(()=>{
      if(disposed) return;
      refresh();
      // React mounts after the browser's first anchor lookup on a direct URL.
      const id=window.location.hash.slice(1);
      if(id && window.scrollY===0) document.getElementById(id)?.scrollIntoView({behavior:'instant',block:'start'});
      queue();
    });
    window.addEventListener('load',refresh);
    return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);window.removeEventListener('load',refresh);media.revert();ctx.revert();};
  },[root,reduced,setNavigation,setChapter,setContext,setActiveSection]);
}
