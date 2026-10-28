import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ArrowUpRight, ArrowDown, BriefcaseBusiness, GraduationCap, Code2, Check, X, Menu, Pause, Play, RotateCcw, Mail, Copy, MapPin, CheckCheck, Layers3, ScanLine, FileDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { projects, chapters, contexts, profile } from './data/portfolio';
import { usePageMotion, useReducedMotion } from './motion';
import s from './App.module.css';
import KineticHero from './KineticHero';
import Certificates from './Certificates';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const external = { target: '_blank', rel: 'noreferrer noopener' };

function Github({size=18}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>; }
function Linkedin({size=18}) { return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="2"/><path fill="var(--deepest)" d="M6 10h3v9H6zm1.5-5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2M11 10h3v1.3c.6-1 1.4-1.5 2.7-1.5 2.2 0 3.3 1.4 3.3 4V19h-3v-4.7c0-1.4-.5-2-1.5-2S14 13 14 14.3V19h-3z"/></svg>; }

function LinkButton({ href, children, secondary = false, ...props }) {
  return <a href={href} className={`${s.button} ${secondary ? s.buttonSecondary : ''}`} {...props}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}

function Navigation({ visible, context }) {
  const [open,setOpen] = useState(false);
  const menu = useRef(null);
  useEffect(()=>{if(!visible)setOpen(false);},[visible]);
  const close=()=>setOpen(false);
  return <header className={`${s.navigation} ${visible?s.navigationVisible:''}`} inert={!visible?true:undefined} onKeyDown={e=>{if(e.key==='Escape'){close();menu.current?.focus();}}}>
    <div className={`${s.container} ${s.navInner}`}>
      <a className={s.navHome} href="#inicio" aria-label="Voltar ao início">Arthur Moury</a>
      <nav id="site-menu" className={`${s.navLinks} ${open?s.navOpen:''}`} aria-label="Navegação principal"><a href="#sobre" onClick={close}>Quem sou</a><a href="#projetos" onClick={close}>Projetos</a><a href="#trajetoria" onClick={close}>Trajetória</a><a href="#certificados" onClick={close}>Certificados</a></nav>
      <div className={s.navActions}><a href="#contato" onClick={close} className={s.navContact}>Vamos conversar<ArrowUpRight size={16} /></a><button ref={menu} className={s.menuButton} aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="site-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
    </div>
    <div className={s.contextTrack} data-context-current={context}><div className={s.container}><span className={s.contextShape} aria-hidden="true"/><span key={context} className={s.contextText}>{contexts[context].verb}<span>{contexts[context].label}</span></span><div className={s.readingTrack} aria-hidden="true"><i data-reading-progress /></div></div></div>
  </header>;
}

function About() {
  return <section id="sobre" className={s.about} aria-labelledby="about-title" data-context="pessoa"><div className={`${s.container} ${s.aboutGrid}`}>
    <h2 id="about-title">Antes dos <br />projetos, <br />a pessoa.</h2>
    <figure className={s.aboutPortrait} data-about-photo><img src="/images/arthur-moury.jpg" width="460" height="460" alt="Arthur Moury" loading="lazy"/><figcaption>Arthur Moury<span>Desenvolvimento · IA · Automação</span></figcaption></figure>
    <div className={s.aboutCopy}><p className={s.aboutLead}>Sou Arthur, estudante de Ciência da Computação na CESAR School e estagiário em IA Ops na Roomi.</p><p className={s.aboutText}>Gosto de entender como as coisas funcionam e transformar esse entendimento em algo que as pessoas possam usar. Desenvolvimento, dados e automação são algumas das formas que encontrei de fazer isso.</p><div className={s.aboutLinks}><a href={`mailto:${profile.email}`}><Mail size={18}/>{profile.email}</a><a href={profile.linkedin} {...external}><Linkedin size={17}/>LinkedIn</a><a href={profile.github} {...external}><Github size={17}/>GitHub</a></div></div>
    <div className={s.aboutDetails}><dl><div data-context="faculdade"><dt><GraduationCap size={20}/>Formação</dt><dd>Ciência da Computação<span>CESAR School · 4º período</span></dd></div><div data-context="trabalho"><dt><BriefcaseBusiness size={19}/>Hoje</dt><dd>IA Ops na Roomi<span>Desenvolvimento, automação e qualidade</span></dd></div><div data-context="pessoa"><dt><MapPin size={19}/>De onde eu venho</dt><dd>Recife, Pernambuco<span>Inglês fluente</span></dd></div></dl><a className={s.cvLink} href="/Arthur-Moury-CV.pdf" {...external}><FileDown size={21}/><span>Meu currículo<small>Formação e experiência em um PDF</small></span><ArrowUpRight size={19}/></a></div>
  </div></section>;
}

function ProjectImage({ project, onOpen, className='' }) {
  return <button className={`${s.projectImage} ${className}`} onClick={()=>onOpen({image:project.image,title:project.name,caption:`${project.imageType} · ${project.summary}`})} aria-label={`Ampliar imagem: ${project.name}`}><img src={project.image} alt={`${project.imageType}: ${project.name}`} loading="lazy" width="1280" height="720"/><span className={s.imageExpand}><ScanLine size={17}/><span>Ampliar</span></span></button>;
}

function Career({ onOpen, activeChapter, setActiveChapter }) {
  return <section id="trajetoria" className={s.career} aria-labelledby="career-title"><div className={s.container}>
    <div className={s.careerIntro}><h2 id="career-title">O que me trouxe<br />até aqui.</h2></div>
    <div className={s.careerGrid}><div className={s.chapterList}>{chapters.map((c,i)=><article id={`capitulo-${c.id}`} key={c.id} className={`${s.chapter} ${i===activeChapter?s.chapterActive:''}`} data-chapter={i} data-context={c.context}>
      <span className={s.chapterMarker}>{c.marker}</span><p className={s.organization}>{c.organization}</p><h3>{c.title}</h3><p className={s.chapterRole}>{c.role}</p><p className={s.chapterText}>{c.text}</p><p className={s.chapterProof}>{c.proof}</p><a className={s.textLink} href={c.link} {...(c.link.startsWith('#')?{}:external)}>{c.linkText}<ArrowUpRight size={17}/></a>
      <div className={s.chapterMobile}><button onClick={()=>onOpen({image:c.image,title:c.organization,caption:`${c.imageType} · ${c.caption}`})} aria-label={`Ampliar imagem de ${c.organization}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy"/><ScanLine size={20}/></button><span>{c.imageType}</span></div>
    </article>)}</div><aside className={s.careerStage} aria-label="Visuais da trajetória"><div className={s.chapterImages}>{chapters.map((c,i)=><button key={c.id} className={s.chapterVisual} data-chapter-visual={i} data-active={activeChapter===i} onClick={()=>onOpen({image:c.image,title:c.organization,caption:`${c.imageType} · ${c.caption}`})} tabIndex={activeChapter===i?0:-1} aria-hidden={activeChapter!==i} aria-label={`Ampliar imagem: ${c.caption}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy"/><span className={s.stageCaption}>{c.imageType}<ScanLine size={18}/></span></button>)}</div><div className={s.stageFooter}><span>{chapters[activeChapter].caption}</span><nav className={s.chapterNav} aria-label="Capítulos da trajetória">{chapters.map((c,i)=><a key={c.id} href={`#capitulo-${c.id}`} aria-label={c.organization} aria-current={i===activeChapter?'step':undefined} onClick={()=>setActiveChapter(i)}><span/></a>)}</nav></div></aside></div>
  </div></section>;
}

function ProjectMotif({ type }) {
  const paths={care:'M32 100H62L78 54L102 146L124 78L139 100H168',board:'M30 36H88V88H30ZM112 112H170V164H112ZM88 62H141V112',finance:'M28 160H172M38 135L79 105L114 119L160 48M125 48H160V83',travel:'M39 146C145 166 160 20 70 48S46 160 156 148M40 146L55 128M40 146L64 151',builder:'M100 25L170 65V140L100 180L30 140V65ZM30 65L100 105L170 65M100 105V180M65 45L135 85V160',field:'M24 45C65 15 135 75 176 45M24 80C65 50 135 110 176 80M24 115C65 85 135 145 176 115M24 150C65 120 135 180 176 150'};
  return <svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d={paths[type]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function projectsBeforeAnchor(hash) {
  const index=projects.findIndex(p=>hash===`#projeto-${p.id}`);
  if(index>=0)return projects.slice(0,index+1).map((_,i)=>i);
  if(['#trajetoria','#certificados','#processo','#curriculo','#contato'].includes(hash)||hash.startsWith('#capitulo-'))return projects.map((_,i)=>i);
  return [];
}

function ProjectGallery({ onOpen }) {
  const [openedByScroll,setOpenedByScroll]=useState(()=>new Set(projectsBeforeAnchor(window.location.hash)));
  const [instant,setInstant]=useState(false);
  const [overrides,setOverrides]=useState({});
  const [hovered,setHovered]=useState(null);
  const section=useRef(null);
  const isOpen=i=>overrides[i]??(openedByScroll.has(i)||hovered===i);
  const canHover=e=>e.pointerType==='mouse'&&window.matchMedia('(min-width:900px) and (hover:hover)').matches;
  useEffect(()=>{
    let frame, timer, observer, anchorFrame;
    const seen=new Set(projectsBeforeAnchor(window.location.hash));
    // Settle earlier rows before the browser calculates a native anchor destination.
    const prepareAnchor=e=>{
      if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const anchor=e.target.closest('a[href^="#"]');
      if(!anchor)return;
      const indices=projectsBeforeAnchor(anchor.getAttribute('href'));
      if(!indices.length)return;
      indices.forEach(i=>seen.add(i));
      flushSync(()=>{setInstant(true);setOpenedByScroll(previous=>new Set([...previous,...indices]));});
      void section.current.offsetHeight;
      ScrollTrigger.refresh();
      cancelAnimationFrame(anchorFrame);
      anchorFrame=requestAnimationFrame(()=>{anchorFrame=requestAnimationFrame(()=>setInstant(false));});
    };
    document.addEventListener('click',prepareAnchor,true);
    const observe=()=>{
      observer?.disconnect();
      observer=new IntersectionObserver(entries=>{
        const entering=entries.filter(entry=>entry.isIntersecting);
        if(!entering.length)return;
        entering.forEach(({target})=>{seen.add(Number(target.dataset.projectTrigger));observer.unobserve(target);});
        setOpenedByScroll(previous=>{
          const next=new Set(previous);
          entering.forEach(({target})=>next.add(Number(target.dataset.projectTrigger)));
          return next;
        });
      },{rootMargin:`-110px 0px -${Math.round(innerHeight*.28)}px 0px`,threshold:0});
      section.current.querySelectorAll('[data-project-trigger]').forEach(target=>{if(!seen.has(Number(target.dataset.projectTrigger)))observer.observe(target);});
    };
    observe();
    window.addEventListener('resize',observe);
    // Refresh after expansion settles; don't refresh every animation frame.
    const resize=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{frame=requestAnimationFrame(()=>ScrollTrigger.refresh(true));},120);});
    resize.observe(section.current);
    return()=>{observer.disconnect();window.removeEventListener('resize',observe);document.removeEventListener('click',prepareAnchor,true);resize.disconnect();clearTimeout(timer);cancelAnimationFrame(frame);cancelAnimationFrame(anchorFrame);};
  },[]);
  return <section id="projetos" ref={section} className={s.projects} data-instant={instant} aria-labelledby="projects-title">
    <div className={`${s.container} ${s.projectsIntro}`} data-context="iniciativa"><div><h2 id="projects-title">Cada ideia,<br />um mundo para explorar.</h2></div></div>
    {projects.map((p,i)=><article id={`projeto-${p.id}`} key={p.id} className={s.projectBand} data-project={p.id} data-context={p.context} data-expanded={isOpen(i)} onPointerEnter={e=>{if(canHover(e)){setHovered(i);setOverrides(previous=>{if(previous[i]!==false)return previous;const next={...previous};delete next[i];return next;});}}} onPointerLeave={e=>{if(canHover(e)&&!e.currentTarget.contains(document.activeElement))setHovered(null);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHovered(null);}} onKeyDown={e=>{if(e.key==='Escape'){setOverrides(previous=>({...previous,[i]:false}));setHovered(null);document.getElementById(`project-toggle-${p.id}`)?.focus();}}}>
      <div className={s.container}><div className={s.projectBandTop} data-project-trigger={i}><div className={s.projectIdentity}><span className={s.projectTopic}>{p.topic}</span><h3><button id={`project-toggle-${p.id}`} aria-expanded={isOpen(i)} aria-controls={`project-gallery-${p.id}`} onClick={()=>setOverrides(previous=>({...previous,[i]:!isOpen(i)}))}>{p.name}</button></h3><span className={s.galleryHint}>{isOpen(i)?'Recolher projeto':'Explorar projeto'}</span></div><div className={s.projectSummary}><p>{p.summary}</p><div className={s.projectActions}><a href={`https://github.com/${p.repo}`} {...external} aria-label={`GitHub de ${p.name}${p.private?' (repositório privado)':''}`}><Github size={18}/><span>GitHub{p.private&&<small>privado</small>}</span></a><a href={p.live} {...external} aria-label={`Acessar ${p.name}`}>Acessar<ArrowUpRight size={19}/></a></div></div></div>
      <div id={`project-gallery-${p.id}`} className={`${s.projectGallery} ${isOpen(i)?s.projectGalleryOpen:''}`} inert={!isOpen(i)?true:undefined} aria-hidden={!isOpen(i)}><div className={s.galleryClip}><p className={s.projectDetail}>{p.detail}</p><div className={s.galleryTrack}><figure className={s.galleryScreenshot}><ProjectImage project={p} onOpen={onOpen}/><figcaption>{p.imageType}</figcaption></figure><div className={s.galleryStatement}><ProjectMotif type={p.motif}/><strong>{p.statement}</strong></div><div className={s.galleryFeatures}><span>Por dentro do projeto</span><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul><div className={s.techTags}>{p.tech.map(t=><span key={t}>{t}</span>)}</div></div></div></div></div>
      </div></article>)}
  </section>;
}

function Curriculum() {
  return <section id="curriculo" className={s.curriculum} data-context="pessoa"><div className={`${s.container} ${s.curriculumInner}`}><FileDown size={46} strokeWidth={1.2}/><div><h2>O percurso completo,<br/>para levar com você.</h2><p>Formação, experiências e competências reunidas no meu currículo.</p></div><LinkButton href="/Arthur-Moury-CV.pdf" {...external}>Abrir currículo</LinkButton></div></section>;
}

function ProcessDemo({ reduced }) {
  const root = useRef(null);
  const timeline = useRef(null);
  const visible = useRef(false);
  const isPaused = useRef(false);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(2);
  useEffect(() => {
    if (reduced) { setStep(2); return; }
    let observer;
    let syncVisibility;
    let lastStep = -1;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ paused:true, repeat:-1, repeatDelay:0.6, onUpdate: () => { const next = tl.time() < 1.3 ? 0 : tl.time() < 3.2 ? 1 : 2; if(next !== lastStep) { setStep(next); lastStep = next; } } });
      timeline.current = tl;
      tl.fromTo(q('[data-confirm]'), { opacity:0.3, scale:0.9 }, { opacity:1, scale:1, duration:0.55, ease:'power3.out' }, 0.25)
        .fromTo(q('[data-source-check]'), { opacity:0, scale:0 }, { opacity:1, scale:1, duration:0.3 }, 0.75)
        .fromTo(q('[data-demo-path]'), { strokeDasharray:1, strokeDashoffset:1 }, { strokeDashoffset:0, duration:1.9, ease:'power1.inOut' }, 1.15)
        .fromTo(q('[data-capsule]'), { opacity:0 }, { opacity:1,duration:0.2 }, 1.1)
        .to(q('[data-capsule]'), { motionPath:{path:q('[data-demo-path]')[0],align:q('[data-demo-path]')[0],alignOrigin:[0.5,0.5],autoRotate:true}, duration:1.9, ease:'power1.inOut' }, 1.15)
        .to(q('[data-capsule]'), { opacity:0,duration:0.2 }, 3.05)
        .fromTo(q('[data-result]'), { opacity:0,y:16 }, { opacity:1,y:0,duration:0.5,ease:'power3.out' }, 3.15)
        .fromTo(q('[data-result-check]'), { scale:0,opacity:0 }, { scale:1,opacity:1,duration:0.4 }, 3.5)
        .fromTo(q('[data-step-progress]')[0], { scaleX:0 }, { scaleX:1,duration:1.3,ease:'none' }, 0)
        .fromTo(q('[data-step-progress]')[1], { scaleX:0 }, { scaleX:1,duration:1.9,ease:'none' }, 1.3)
        .fromTo(q('[data-step-progress]')[2], { scaleX:0 }, { scaleX:1,duration:1.2,ease:'none' }, 3.2);
      const sync = () => { if(visible.current && !document.hidden && !isPaused.current) tl.play(); else tl.pause(); };
      observer = new IntersectionObserver(entries => { visible.current = entries[0].isIntersecting; sync(); }, { threshold:0.25 });
      observer.observe(root.current);
      document.addEventListener('visibilitychange', sync);
      syncVisibility = sync;
    }, root);
    return () => { observer?.disconnect(); if(syncVisibility) document.removeEventListener('visibilitychange',syncVisibility); ctx.revert(); timeline.current = null; };
  }, [reduced]);
  const toggle = () => { const next = !paused; setPaused(next); isPaused.current = next; if(next) timeline.current?.pause(); else if(visible.current && !document.hidden) timeline.current?.play(); };
  const replay = () => { timeline.current?.pause(0); if(visible.current && !document.hidden && !isPaused.current) timeline.current?.play(); };
  return <section id="processo" className={s.process} ref={root} data-section="demonstracao" data-context="trabalho" aria-labelledby="process-title">
    <div className={s.processRibbon}><div className={s.container}><span>Meu jeito de pensar</span><h2 id="process-title">Da intenção à entrega<span>↗</span></h2></div></div>
    <div className={`${s.processBody} ${s.container}`}>
      <div className={s.processTop}><p>Entender. Conectar. Validar.</p><span>Demonstração ilustrativa de um fluxo de automação</span></div>
      <div className={s.demoStage}>
        <div className={s.sourcePanel}><span className={s.panelLabel}>O ponto de partida</span><BriefcaseBusiness size={30} strokeWidth={1.3} /><h3>Uma rotina <br />pode ser melhor.</h3><p>Informação chega. <br />Alguém precisa agir.</p><div data-confirm className={s.sourceAction}><span>Contexto entendido</span><span data-source-check><Check size={18} /></span></div></div>
        <div className={s.flow}><svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path className={s.flowTrack} d="M15 130C110 130 90 35 200 75S290 190 385 115" /><path pathLength="1" data-demo-path className={s.flowProgress} d="M15 130C110 130 90 35 200 75S290 190 385 115" /><g data-capsule className={s.capsule}><rect x="-24" y="-13" width="48" height="26" rx="13" /><path d="m-6-4 5 4-5 4M3-4l5 4-5 4" /></g></svg><span className={s.flowCaption}>Automação com propósito</span></div>
        <div className={s.resultPanel}><div className={s.resultTop}><span className={s.panelLabel}>O que muda</span><Layers3 size={19} /></div><h3>Espaço para<br />o que importa.</h3><div className={s.resultRows}><span><CheckCheck size={16} /> Etapas conectadas</span><span><CheckCheck size={16} /> Informação organizada</span><span data-result className={s.resultNew}><span data-result-check><Check size={16} /></span> Fluxo validado</span></div><span className={s.resultFoot}>Problema real. Solução verificável.</span></div>
      </div>
      <div className={s.demoBottom}><ol className={s.demoSteps} aria-label="Etapas da demonstração">{['Entender o problema','Conectar o processo','Validar a entrega'].map((v,i) => <li key={v} data-current={i === step} data-complete={i < step || reduced}><span>{String(i+1).padStart(2,'0')}</span>{v}<i><b data-step-progress /></i></li>)}</ol><div className={s.demoControls}>{reduced ? <span className={s.staticMotion}>Resultado completo · movimento reduzido</span> : <><button onClick={toggle} aria-label={paused ? 'Retomar demonstração' : 'Pausar demonstração'}>{paused ? <Play size={17} /> : <Pause size={17} />}<span>{paused ? 'Retomar' : 'Pausar'}</span></button><button onClick={replay} aria-label="Repetir demonstração"><RotateCcw size={17} /><span>Repetir</span></button></>}</div></div>
    </div>
  </section>;
}


function Contact({ reduced }) {
  const form = useRef(null);
  const [errors,setErrors] = useState({});
  const [draft,setDraft] = useState(null);
  const [copyStatus,setCopyStatus] = useState('');
  const submit = e => {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const next = {};
    if(values.name.trim().length < 2) next.name = 'Informe seu nome com pelo menos 2 caracteres.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Informe um e-mail válido.';
    if(!values.subject) next.subject = 'Escolha o assunto da conversa.';
    if(values.message.trim().length < 10) next.message = 'Conte um pouco mais: use pelo menos 10 caracteres.';
    setErrors(next); setCopyStatus('');
    if(Object.keys(next).length) { setDraft(null); form.current.elements[Object.keys(next)[0]]?.focus(); return; }
    setDraft({ ...values, body:`Olá, Arthur!\n\n${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}` });
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`Para: ${profile.email}\nAssunto: ${draft.subject}\n\n${draft.body}`); setCopyStatus('Mensagem copiada. Cole no seu e-mail para enviar.'); } catch { setCopyStatus('Não foi possível copiar. Use o link para abrir seu e-mail.'); } };
  const props = id => ({ id:`contact-${id}`,name:id,'aria-invalid':!!errors[id],'aria-describedby':errors[id] ? `error-${id}` : undefined,onChange:() => { setDraft(null); if(errors[id]) setErrors(prev=>({...prev,[id]:undefined})); } });
  return <section id="contato" className={s.contact} data-section="contato" data-context="pessoa" aria-labelledby="contact-title"><div className={`${s.container} ${s.contactGrid}`}><div className={s.contactCopy}><p className={s.sectionKicker}>Contato</p><h2 id="contact-title">Sempre há espaço<br />para uma<br /><span>boa conversa.</span></h2><p>Uma oportunidade, uma dúvida ou só uma troca de ideias. Pode chegar — vou gostar de ouvir você.</p><a className={s.contactEmail} href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} /></a><div className={s.contactLinks}><a href={profile.linkedin} {...external}>LinkedIn<ArrowUpRight size={15} /></a><a href={profile.github} {...external}>GitHub<ArrowUpRight size={15} /></a><a href="/Arthur-Moury-CV.pdf" target="_blank">Currículo<ArrowUpRight size={15} /></a></div><p className={s.address}><MapPin size={15} /> Recife, Pernambuco</p></div><form ref={form} className={s.contactForm} noValidate onSubmit={submit}>
      <p>Comece por aqui.<span>O formulário prepara a mensagem no seu aplicativo de e-mail.</span></p>
      <div className={s.formField}><label htmlFor="contact-name">Seu nome <span>(obrigatório)</span></label><input {...props('name')} autoComplete="name" maxLength={100} required placeholder="Como posso te chamar?" />{errors.name && <span className={s.fieldError} id="error-name">{errors.name}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-email">Seu e-mail <span>(obrigatório)</span></label><input {...props('email')} type="email" autoComplete="email" maxLength={150} required placeholder="voce@exemplo.com" />{errors.email && <span className={s.fieldError} id="error-email">{errors.email}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-subject">Sobre o que vamos conversar?</label><div className={s.selectWrap}><select {...props('subject')} required defaultValue=""><option value="" disabled>Escolha um assunto</option><option>Uma oportunidade profissional</option><option>Uma ideia de projeto</option><option>Uma colaboração</option><option>Uma conversa sobre tecnologia</option><option>Outro motivo</option></select><ArrowDown size={17} aria-hidden="true" /></div>{errors.subject && <span className={s.fieldError} id="error-subject">{errors.subject}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-message">Conte um pouco <span>(obrigatório)</span></label><textarea {...props('message')} required rows={3} maxLength={1800} placeholder="O que você tem em mente?" />{errors.message && <span className={s.fieldError} id="error-message">{errors.message}</span>}</div>
      <button className={s.button} type="submit">Preparar e-mail<ArrowUpRight size={19} /></button>
      <div className={s.formStatus} aria-live="polite">{Object.values(errors).some(Boolean) && <p>Confira os campos indicados para continuar.</p>}{draft && <div className={s.draft}><strong><Check size={17} /> Mensagem pronta para revisar.</strong><p>Abra seu aplicativo e envie quando estiver tudo certo.</p><div><a href={`mailto:${profile.email}?subject=${encodeURIComponent(`[Portfólio] ${draft.subject}`)}&body=${encodeURIComponent(draft.body)}`} className={s.textLink}>Abrir meu e-mail<ArrowUpRight size={16} /></a><button type="button" onClick={copy}><Copy size={15} /> Copiar mensagem</button></div></div>}{copyStatus && <p>{copyStatus}</p>}</div>
    </form></div>
    <footer className={`${s.container} ${s.footer}`}><div className={s.footerTop}><a href="#inicio" className={s.footerName}>Arthur Moury</a><nav aria-label="Navegação do rodapé"><a href="#sobre">Quem sou</a><a href="#trajetoria">Trajetória</a><a href="#projetos">Projetos</a><a href={reduced?'/?motion=full':'/?motion=reduce'}>{reduced?'Versão com animações':'Reduzir animações'}</a></nav></div><div className={s.footerBottom}><span>© 2026 Arthur Moury</span><a href="#inicio">Voltar ao início <ArrowUpRight size={14}/></a></div></footer>
  </section>;
}

function ImageDialog({ value, onClose }) {
  const dialog = useRef(null);
  const containFocus = e => {
    if(e.key !== 'Tab') return;
    const focusable = [...dialog.current.querySelectorAll('button, a[href], [tabindex="0"]')];
    const first = focusable[0], last = focusable.at(-1);
    if(!first) { e.preventDefault(); return; }
    if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  useEffect(() => {
    if(!value) return;
    const previous = document.activeElement;
    const d = dialog.current;
    d.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { d.close(); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [value]);
  return <dialog ref={dialog} className={s.dialog} aria-labelledby="image-dialog-title" onKeyDown={containFocus} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>{value && <div className={s.dialogContent}><div className={s.dialogHeader}><h2 id="image-dialog-title">{value.title}</h2><button autoFocus onClick={onClose} aria-label="Fechar ampliação"><X size={24} /></button></div><img src={value.image} alt={value.caption} /><p>{value.caption}</p>{value.url && <a className={s.textLink} href={value.url} {...external}>Ver original no Drive<ArrowUpRight size={16}/></a>}</div>}</dialog>;
}


export default function App() {
  const root=useRef(null);
  const reduced=useReducedMotion();
  const [navigationVisible,setNavigationVisible]=useState(false);
  const [activeChapter,setActiveChapter]=useState(0);
  const [context,setContext]=useState('pessoa');
  const [image,setImage]=useState(null);
  usePageMotion(root,reduced,setNavigationVisible,setActiveChapter,setContext);
  return <div ref={root} className={s.app} data-reduced-motion={reduced}><a className={s.skipLink} href="#sobre">Pular para informações pessoais</a><Navigation visible={navigationVisible} context={context}/><main><KineticHero reduced={reduced}/><About/><ProjectGallery onOpen={setImage}/><Career onOpen={setImage} activeChapter={activeChapter} setActiveChapter={setActiveChapter}/><Certificates reduced={reduced} onOpen={setImage} modalOpen={!!image}/><ProcessDemo reduced={reduced}/><Curriculum/><Contact reduced={reduced}/></main><ImageDialog value={image} onClose={()=>setImage(null)}/></div>;
}
