import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { careerPosition } from './careerFlow';
gsap.registerPlugin(ScrollTrigger);

export function useReducedMotion() {
  const forced=new URLSearchParams(window.location.search).get('motion')==='reduce';
  const [reduced,setReduced]=useState(()=>forced||window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(forced||media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[forced]);
  return reduced;
}

export function usePageMotion(root,reduced,setNavigation,setChapter,setActiveSection) {
  useEffect(()=>{
    let frame=0;
    let disposed=false;
    const hero=document.getElementById('inicio');
    const chapterElements=[...root.current.querySelectorAll('[data-chapter]')];
    const stage=root.current.querySelector('[data-career-story] aside');
    const lastChapter=chapterElements.at(-1);
    let stageShift=0;
    const sections=[...root.current.querySelectorAll('main section[id]')];
    const update=()=>{
      frame=0;
      const openingFlight=ScrollTrigger.getById('opening-flight');
      setNavigation(openingFlight ? window.scrollY > openingFlight.end + 20 : hero.getBoundingClientRect().bottom<=132);
      let activeSection='inicio';
      for(const section of sections)if(section.getBoundingClientRect().top<=180)activeSection=section.id;
      setActiveSection(activeSection);
      if(stage.closest('[data-career-alternating=true]')){stage.style.removeProperty('translate');stageShift=0;return;}
      let chapterIndex=0;
      const stageBox=stage.getBoundingClientRect();
      const stageBottom=stageBox.bottom-stageShift;
      const lastBox=lastChapter.getBoundingClientRect();
      const stacked=innerWidth<900 && !(innerWidth>innerHeight && innerHeight<=540);
      // Release the sticky visual beside the final paragraph (above it on phones).
      const stop=stacked
        ? lastChapter.firstElementChild.getBoundingClientRect().top-20
        : lastBox.top+(lastBox.height+stageBox.height)/2;
      stageShift=Math.min(0,stop-stageBottom);
      stage.style.translate='0 '+stageShift+'px';
      const chapterLine=innerWidth<900?Math.min(innerHeight-50,stageBottom+(innerHeight-stageBottom)*.3):innerHeight*.55;
      if(innerWidth>=900 && !reduced) {
        const centers=chapterElements.map(chapter=>{const rect=chapter.getBoundingClientRect();return rect.top+rect.height/2;});
        chapterIndex=Math.round(careerPosition(centers,chapterLine));
      } else chapterElements.forEach((chapter,i)=>{if(chapter.getBoundingClientRect().top<=chapterLine)chapterIndex=i;});
      setChapter(chapterIndex);
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
      // The résumé lies between the ribbon and contact. Let the same fold
      // rise and settle at both boundaries as they pass through the viewport.
      q('#curriculo, #contato').forEach(section => {
        const sequence = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 33%', scrub: .3 },
        });
        sequence.fromTo(section, { '--fold-height': 0 }, { '--fold-height': 1, duration: .42, ease: 'sine.out' })
          .to(section, { '--fold-height': 0, duration: .58, ease: 'sine.inOut' })
          .fromTo(section.querySelector('h2'), { y: 22, opacity: .35 }, {
            y: 0, opacity: 1, duration: .65, ease: 'power2.out',
          }, .22);
      });
      const formIntro = q('#contato form > p')[0];
      gsap.from(formIntro, {
        y: 14, duration: .6, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: formIntro, start: 'top 94%', once: true },
      });
      q('#certificados h2').forEach(title => {
        gsap.from(title, { y: 38, clipPath: 'inset(0 0 18% 0)', duration: 1.1, ease: 'power4.out', clearProps: 'all', scrollTrigger: { trigger: title, start: 'top 92%', once: true } });
      });
      const handoff=q('[data-career-cert-handoff]')[0];
      const certificates=q('#certificados')[0];
      const passage=gsap.timeline({scrollTrigger:{trigger:certificates,start:'top bottom',end:'top 15%',scrub:.5}});
      passage.fromTo(handoff,{opacity:0},{opacity:1,duration:.4,ease:'sine.out'})
        .to(handoff,{opacity:0,duration:.6,ease:'sine.in'})
        .fromTo(handoff.querySelector('[data-career-cert-mist]'),{xPercent:-10,yPercent:12,scale:.94},{xPercent:10,yPercent:-12,scale:1.08,duration:1,ease:'sine.inOut'},0)
        .fromTo(handoff.querySelector('[data-career-cert-glow]'),{xPercent:8,yPercent:6},{xPercent:-12,yPercent:-8,duration:1,ease:'sine.inOut'},0);
      media.add('(min-width: 900px) and (min-height: 700px)',()=>{
        gsap.to(q('[data-career-scene]')[0],{opacity:0,ease:'sine.inOut',scrollTrigger:{trigger:certificates,start:'top 92%',end:'top 32%',scrub:.35}});
      });
      const transition=q('[data-section-transition]')[0];
      if(transition)gsap.fromTo(q('[data-transition-surface]'),{attr:{d:'M0 160Q720 -100 1440 160V200H0Z'}},{attr:{d:'M0 0Q720 0 1440 0V200H0Z'},ease:'none',scrollTrigger:{trigger:transition,start:'top bottom',end:'bottom 35%',scrub:.7}});
      gsap.fromTo(q('[data-project-heading-line]'),{x:i=>i?55:-55,opacity:.15},{x:0,opacity:1,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:q('#projects-title')[0],start:'top 90%',end:'top 45%',scrub:.6}});
      const careerTitle=q('#career-title')[0];
      gsap.fromTo(careerTitle.querySelectorAll('[data-reveal-word]'),{opacity:.12,filter:'blur(8px)',scale:1.12},{opacity:1,filter:'blur(0px)',scale:1,stagger:{each:.08,from:'center'},ease:'none',scrollTrigger:{trigger:careerTitle,start:'top 90%',end:'top 38%',scrub:.6}});
      media.add('(max-width: 899px), (max-height: 699px)', ()=>{q('[data-chapter]').forEach(chapter=>{
        const find=selector=>chapter.querySelector(selector);
        const enter=(trigger,start='top 90%')=>({trigger,start,toggleActions:'play none none reverse'});
        gsap.fromTo(find('[data-career-date]'),{opacity:0,x:18},{opacity:1,x:0,duration:.55,ease:'power3.out',scrollTrigger:enter(find('[data-career-date]'))});
        gsap.fromTo(find('[data-career-org]'),{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration:.65,scrollTrigger:enter(find('[data-career-org]'))});
        const title=find('[data-career-title]');
        gsap.fromTo(title.querySelectorAll('[data-reveal-word]'),{rotationX:-65,y:10,opacity:0},{rotationX:0,y:0,opacity:1,duration:.8,stagger:.045,ease:'power3.out',scrollTrigger:enter(title,'top 87%')});
        const role=find('[data-career-role]');
        gsap.fromTo(role,{opacity:.3,x:-10},{opacity:1,x:0,duration:.5,ease:'power3.out',scrollTrigger:enter(role)});
        const copy=find('[data-career-copy]');
        gsap.fromTo(copy.querySelectorAll('[data-reveal-word]'),{opacity:.22},{opacity:1,stagger:.03,ease:'none',scrollTrigger:{trigger:copy,start:'top 88%',end:'bottom 72%',scrub:.4}});
        const client=find('[data-career-client]');
        if(client)gsap.fromTo(client,{opacity:0,scale:.92},{opacity:1,scale:1,transformOrigin:'left center',duration:.65,ease:'power3.out',scrollTrigger:enter(client)});
        const stack=find('[data-career-stack]');
        if(stack)gsap.fromTo(stack.querySelectorAll('[data-reveal-word]'),{x:12,opacity:0},{x:0,opacity:1,duration:.45,stagger:.025,ease:'power3.out',scrollTrigger:enter(stack)});
        const link=find('[data-career-link]');
        if(link)gsap.fromTo(link,{y:8,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out',scrollTrigger:enter(link)});
      });});
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
    return()=>{disposed=true;stage.style.removeProperty('translate');document.removeEventListener('click',jumpToAbout);cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);window.removeEventListener('load',refresh);media.revert();ctx.revert();};
  },[root,reduced,setNavigation,setChapter,setActiveSection]);
}
