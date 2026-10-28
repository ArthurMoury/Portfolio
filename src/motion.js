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

export function usePageMotion(root,reduced,setNavigation,setChapter,setContext) {
  useEffect(()=>{
    let frame=0;
    let disposed=false;
    const hero=document.getElementById('inicio');
    const markers=[...root.current.querySelectorAll('[data-context]')];
    const progress=root.current.querySelector('[data-reading-progress]');
    const update=()=>{
      frame=0;
      setNavigation(hero.getBoundingClientRect().bottom<=132);
      let context='pessoa';
      for(const el of markers)if(el.getBoundingClientRect().top<=window.innerHeight*.45)context=el.dataset.context;
      setContext(context);
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(progress)progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,window.scrollY/max)):0})`;
    };
    const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);
    const media=gsap.matchMedia();
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root);
      q('[data-chapter]').forEach((chapter,i)=>ScrollTrigger.create({trigger:chapter,start:'top 55%',end:'bottom 55%',onEnter:()=>setChapter(i),onEnterBack:()=>setChapter(i)}));
      if(reduced)return;
      q('#sobre h2, #projetos h2, #trajetoria h2, #certificados h2').forEach(title => {
        gsap.from(title, { y: 38, clipPath: 'inset(0 0 18% 0)', duration: 1.1, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: title, start: 'top 92%', once: true } });
      });
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
        q('[data-chapter] img').forEach(image=>gsap.from(image,{y:14,scale:.98,duration:.6,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:image,start:'top 95%',once:true}}));
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
  },[root,reduced,setNavigation,setChapter,setContext]);
}
