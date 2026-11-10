import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import Github from './GithubIcon';
import { projects } from './data/portfolio';
import { localize, t, useLanguage } from './i18n';
import s from './MobileProjectGallery.module.css';
const external={target:'_blank',rel:'noreferrer noopener'};
const wrap=index=>(index+projects.length)%projects.length;
export default function MobileProjectGallery({reduced}){
 const language=useLanguage(),en=language==='en';
 const root=useRef(null),rail=useRef(null),covers=useRef([]),dialog=useRef(null),pane=useRef(null),last=useRef(0);
 const [active,setActive]=useState(0),[selected,setSelected]=useState(null);
 const open=selected!==null,project=projects[selected??active];
 function move(index,animated=true){const card=covers.current[wrap(index)];if(card)rail.current.scrollTo({left:card.offsetLeft-(rail.current.clientWidth-card.offsetWidth)/2,behavior:animated&&!reduced?'smooth':'instant'});}
 useEffect(()=>{
  let frame=0,wave=0,target=0,lastFrame=0,lastScroll=rail.current.scrollLeft,lastTime=performance.now();
  function update(now){frame=0;const dt=Math.min(40,now-(lastFrame||now-16));lastFrame=now;target*=Math.exp(-dt/95);wave+=(target-wave)*(1-Math.exp(-dt/65));const node=rail.current,center=node.scrollLeft+node.clientWidth/2;let nearest=0,distance=Infinity;covers.current.forEach((cover,i)=>{const delta=(cover.offsetLeft+cover.offsetWidth/2-center)/cover.offsetWidth;const d=Math.max(-1,Math.min(1,delta));if(Math.abs(delta)<distance){nearest=i;distance=Math.abs(delta);}const ripple=reduced?0:Math.sin(d*1.5+i*.5)*wave;cover.style.transform=reduced?'none':`perspective(1100px) translateY(${ripple*8}px) rotateY(${-d*10+ripple*4}deg) scale(${1-Math.abs(d)*.045})`;cover.style.opacity=String(1-Math.abs(d)*.12);});setActive(nearest);if(!reduced&&(Math.abs(wave)>.002||Math.abs(target)>.002))schedule();}
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  const scroll=()=>{const now=performance.now(),left=rail.current.scrollLeft;if(!reduced)target=Math.max(-1,Math.min(1,(left-lastScroll)/Math.max(8,now-lastTime)/2));lastScroll=left;lastTime=now;schedule();};
  const resize=new ResizeObserver(schedule);resize.observe(rail.current);rail.current.addEventListener('scroll',scroll,{passive:true});schedule();
  const node=rail.current;return()=>{cancelAnimationFrame(frame);resize.disconnect();node.removeEventListener('scroll',scroll);};
 },[reduced]);
 useEffect(()=>{const fromHash=()=>{const index=projects.findIndex(p=>location.hash==='#projeto-'+p.id);if(index>=0){setSelected(index);move(index,false);}};const anchor=e=>{const a=e.target.closest('a[href^="#projeto-"]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const index=projects.findIndex(p=>a.hash==='#projeto-'+p.id);if(index>=0){e.preventDefault();setSelected(index);move(index,false);}};fromHash();window.addEventListener('hashchange',fromHash);document.addEventListener('click',anchor);return()=>{window.removeEventListener('hashchange',fromHash);document.removeEventListener('click',anchor);};},[]);
 useEffect(()=>{if(!open)return;const d=dialog.current,overflow=document.body.style.overflow;document.body.style.overflow='hidden';d.showModal();return()=>{d.close();document.body.style.overflow=overflow;covers.current[last.current]?.focus({preventScroll:true});};},[open]);
 useEffect(()=>{if(selected===null)return;last.current=selected;pane.current?.scrollTo({top:0,behavior:'instant'});move(selected,false);},[selected]);
 const keys=e=>{if(e.key!=='Tab')return;const controls=[...dialog.current.querySelectorAll('a[href],button')].filter(n=>n.getClientRects().length);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
 return localize(<section ref={root} id="projetos" className={s.section} data-mobile-gallery aria-labelledby="projects-title">
  <div className={s.heading}><h2 id="projects-title"><span data-project-heading-line>Minha bagagem</span><span data-project-heading-line>em projetos.</span></h2></div>
  <div ref={rail} className={s.rail} role="region" aria-roledescription={en?'carousel':'carrossel'} aria-label={en?'Project gallery':'Galeria de projetos'}>
   {projects.map((p,i)=><button ref={node=>{covers.current[i]=node;}} key={p.id} id={'projeto-'+p.id} className={s.card} data-mobile-project={p.id} aria-label={(en?'Open project: ':'Abrir projeto: ')+t(p.name)} onClick={()=>setSelected(i)}>
    <span className={s.image}><img src={p.image} alt={p.imageType+': '+p.name} width="1280" height="800" loading={i<2?'eager':'lazy'} draggable={false}/><span className={s.openIcon} aria-hidden="true"><ArrowUpRight size={20}/></span></span>
    <span className={s.identity}><span><small>{p.topic}</small><strong>{p.name}</strong></span><span className={s.number}>{String(i+1).padStart(2,'0')}</span></span>
   </button>)}
  </div>
  <div className={s.controls}><p aria-live="polite"><span>{String(active+1).padStart(2,'0')}</span> / {String(projects.length).padStart(2,'0')}</p><div><button aria-label={en?'Previous project':'Projeto anterior'} onClick={()=>move(active-1)}><ArrowLeft size={20}/></button><button aria-label={en?'Next project':'Próximo projeto'} onClick={()=>move(active+1)}><ArrowRight size={20}/></button></div></div>
  <dialog ref={dialog} className={s.sheet} aria-labelledby="mobile-project-title" onKeyDown={keys} onCancel={e=>{e.preventDefault();setSelected(null);}}>
   {open&&<div className={s.sheetLayout}>
    <header className={s.sheetHeader}><h2 id="mobile-project-title" aria-live="polite">{project.name}</h2><button autoFocus onClick={()=>setSelected(null)} aria-label={en?'Close project':'Fechar projeto'}><X size={23}/></button></header>
    <div ref={pane} className={s.sheetScroll}><AnimatePresence initial={false} mode="wait"><motion.div key={project.id} className={s.sheetBody} initial={reduced?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-10}} transition={{duration:.18,ease:'easeOut'}}>
     <img className={s.sheetImage} src={project.image} alt={project.imageType+': '+project.name} width="1280" height="800" draggable={false}/>
     <p className={s.topic}>{project.topic}</p><p className={s.description}>{project.detail}</p>
     <ul className={s.stack} aria-label="Tecnologias">{project.tech.map(tech=><li key={tech}>{tech}</li>)}</ul>
     <div className={s.actions}>{project.repo?<a href={'https://github.com/'+project.repo} {...external}><Github size={18}/><span>GitHub{project.private&&<small>privado</small>}</span></a>:<span className={s.unavailable}>Código não publicado</span>}{project.id!=='cortech'&&(project.live?<a href={project.live} {...external}>Acessar<ArrowUpRight size={18}/></a>:<span className={s.unavailable}>Acesso em atualização</span>)}</div>
     <dl className={s.specs}>{project.implementation.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.text}</dd></div>)}</dl>
    </motion.div></AnimatePresence></div>
    <footer className={s.sheetFooter}><button onClick={()=>setSelected(wrap(selected-1))} aria-label={en?'Previous project':'Projeto anterior'}><ArrowLeft size={18}/><span>{en?'Previous':'Anterior'}</span></button><span>{String(selected+1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span><button onClick={()=>setSelected(wrap(selected+1))} aria-label={en?'Next project':'Próximo projeto'}><span>{en?'Next':'Próximo'}</span><ArrowRight size={18}/></button></footer>
   </div>}
  </dialog>
 </section>);
}
