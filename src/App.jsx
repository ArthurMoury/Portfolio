import { localize, t } from './i18n';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Check, X, Menu, Mail, Copy, MapPin, ScanLine, FileDown } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, chapters, contexts, profile } from './data/portfolio';
import { usePageMotion, useReducedMotion } from './motion';
import s from './App.module.css';
import KineticHero from './KineticHero';
import Certificates from './Certificates';
import PracticeLab from './PracticeLab';
import FooterSignature from './FooterSignature';
import SubjectSelect from './SubjectSelect';
import TextReveal from './TextReveal';
import ProjectNarrative from './ProjectNarrative';

const external = { target: '_blank', rel: 'noreferrer noopener' };

function Github({size=18}) { return localize(<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function Linkedin({size=18}) { return localize(<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="2"/><path fill="var(--deepest)" d="M6 10h3v9H6zm1.5-5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2M11 10h3v1.3c.6-1 1.4-1.5 2.7-1.5 2.2 0 3.3 1.4 3.3 4V19h-3v-4.7c0-1.4-.5-2-1.5-2S14 13 14 14.3V19h-3z"/></svg>); }

function LinkButton({ href, children, secondary = false, ...props }) {
  return localize(<a href={href} className={`${s.button} ${secondary ? s.buttonSecondary : ''}`} {...props}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>);
}

function Navigation({ visible, context, activeSection }) {
  const [open,setOpen] = useState(false);
  const menu = useRef(null);
  useEffect(()=>{if(!visible)setOpen(false);},[visible]);
  const close=()=>setOpen(false);
  useEffect(()=>{
    if(!open)return;
    const main=document.querySelector('main'), oldOverflow=document.body.style.overflow;
    main.inert=true;document.body.style.overflow='hidden';
    const resize=()=>{if(innerWidth>=900)setOpen(false);};
    window.addEventListener('resize',resize);
    return()=>{main.inert=false;document.body.style.overflow=oldOverflow;window.removeEventListener('resize',resize);};
  },[open]);
  const keys=e=>{
    if(e.key==='Escape'){close();menu.current?.focus();}
    if(e.key==='Tab'&&open){
      const controls=[...e.currentTarget.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
  };
  return localize(<header className={`${s.navigation} ${visible?s.navigationVisible:''}`} inert={!visible?true:undefined} onKeyDown={keys}>
    <div className={`${s.container} ${s.navInner}`}>
      <a className={s.navHome} href="#inicio" aria-label="Voltar ao início"><img src="/images/arthur-profile.webp" alt="" width="32" height="32"/>Arthur Moury</a>
      <nav id="site-menu" className={`${s.navLinks} ${open?s.navOpen:''}`} aria-label="Navegação principal">{[['sobre','Quem sou'],['projetos','Projetos'],['trajetoria','Trajetória'],['certificados','Certificados'],['processo','Na prática']].map(([id,label])=>localize(<a key={id} href={`#${id}`} onClick={close} aria-current={activeSection===id?'location':undefined}>{label}</a>))}</nav>
      <div className={s.navActions}><a href="#contato" onClick={close} className={s.navContact} aria-label="Vamos conversar" aria-current={activeSection==='contato'?'location':undefined}><span>Vamos conversar</span><ArrowUpRight size={16} /></a><button ref={menu} className={s.menuButton} aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="site-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
    </div>
    <div className={s.contextTrack} data-context-current={context}><div className={s.container}><span className={s.contextShape} aria-hidden="true"/><span key={context} className={s.contextText}>{contexts[context].verb}<span>{contexts[context].label}</span></span><div className={s.readingTrack} aria-hidden="true"><i data-reading-progress /></div></div></div>
  </header>);
}

function About() {
  return localize(<section id="sobre" className={s.about} aria-labelledby="about-title" data-context="pessoa"><div className={`${s.container} ${s.aboutGrid}`}>
    <h2 id="about-title" data-about-piece>Antes dos <br />projetos, <br />a pessoa.</h2>
    <figure className={s.aboutPortrait} data-about-photo><img src="/images/arthur-profile.webp" width="960" height="960" alt="Arthur Moury" loading="lazy"/></figure>
    <div className={s.aboutCopy}><p className={s.aboutLead} data-about-piece>Sou Arthur, estudante de Ciência da Computação na CESAR School e estagiário em IA Ops na Roomi.</p><p className={s.aboutText} data-about-piece>Gosto de entender como as coisas funcionam e transformar esse entendimento em algo que as pessoas possam usar. Desenvolvimento, dados e automação são algumas das formas que encontrei de fazer isso.</p><div className={s.aboutLinks}><a data-about-piece href={`mailto:${profile.email}`}><Mail size={18}/>{profile.email}</a><a data-about-piece href={profile.linkedin} {...external}><Linkedin size={17}/>LinkedIn</a><a data-about-piece href={profile.github} {...external}><Github size={17}/>GitHub</a></div></div>
    <div className={s.aboutDetails}><dl><div data-about-piece data-context="faculdade"><dt><GraduationCap size={20}/>Formação</dt><dd>Ciência da Computação<span>CESAR School, 4º período</span></dd></div><div data-about-piece data-context="trabalho"><dt><BriefcaseBusiness size={19}/>Hoje</dt><dd>IA Ops na Roomi<span>Desenvolvimento, automação e qualidade</span></dd></div><div data-about-piece data-context="pessoa"><dt><MapPin size={19}/>De onde eu venho</dt><dd>Recife, Pernambuco<span>Inglês fluente</span></dd></div></dl><a data-about-piece className={s.cvLink} href="/Arthur-Moury-CV.pdf" {...external}><FileDown size={21}/><span>Meu currículo<small>Formação e experiência em um PDF</small></span><ArrowUpRight size={19}/></a></div>
  </div></section>);
}

function ProjectImage({ project, onOpen, reduced }) {
  function tilt(event) {
    if (reduced || event.pointerType === 'touch') return;
    const node = event.currentTarget;
    const bounds = node.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    node.style.setProperty('--pitch', ((0.5 - y) * 5) + 'deg');
    node.style.setProperty('--yaw', ((x - 0.5) * 6) + 'deg');
    node.style.setProperty('--light-x', (x * 100) + '%');
    node.style.setProperty('--light-y', (y * 100) + '%');
  }

  return localize(<button className={s.projectImage} onPointerMove={tilt}
    onClick={() => onOpen({ image: project.image, title: project.name, caption: `${project.imageType}, ${project.summary}` })}
    aria-label={`Ampliar imagem: ${project.name}`}>
    <img src={project.image} alt={`${project.imageType}: ${project.name}`} loading="lazy" width="1280" height="720"/>
    <span className={s.imageExpand}><ScanLine size={17}/><span>Ampliar</span></span>
  </button>);
}

function Career({ onOpen, activeChapter, reduced }) {
  const stage=useRef(null), previous=useRef(activeChapter);
  useEffect(()=>{
    if(reduced){previous.current=activeChapter;return;}
    const images=[...stage.current.querySelectorAll('[data-chapter-visual]')];
    const old=previous.current, direction=activeChapter>=old?1:-1;
    previous.current=activeChapter;
    const ctx=gsap.context(()=>{
      if(old!==activeChapter)gsap.to(images[old],{y:-direction*24,scale:.94,rotateY:-direction*5,duration:.65,ease:'power3.out',overwrite:true});
      gsap.fromTo(images[activeChapter],{y:direction*32,scale:1.045,rotateY:direction*7,clipPath:direction>0?'inset(0 0 100% 0)':'inset(100% 0 0 0)'},{y:0,scale:1,rotateY:0,clipPath:'inset(0 0 0% 0)',duration:.95,ease:'power3.inOut',overwrite:true});
    },stage);
    return()=>ctx.revert();
  },[activeChapter,reduced]);
  return localize(<section id="trajetoria" data-career-story className={s.career} aria-labelledby="career-title"><div className={s.container}>
    <div className={s.careerIntro}><h2 id="career-title"><TextReveal text="O que me trouxe"/><TextReveal text="até aqui."/></h2></div>
    <div className={s.careerGrid}><div className={s.chapterList}>{chapters.map((c,i)=>localize(<article id={`capitulo-${c.id}`} key={c.id} className={`${s.chapter} ${i===activeChapter?s.chapterActive:''}`} data-chapter={i} data-context={c.context}>
      <span className={s.chapterMarker} data-career-date>{c.marker}</span><p className={s.organization} data-career-org><TextReveal text={c.organization}/></p><h3 data-career-title><TextReveal text={c.title}/></h3><p className={s.chapterRole} data-career-role>{c.role}</p><p className={s.chapterText} data-career-copy><TextReveal text={`${c.text} ${c.proof}`}/></p>{c.client&&<div className={s.chapterClient} data-career-client><span>Cliente</span><img src={c.clientLogo} alt={`Logo de ${c.client}`} width="100" height="50" loading="lazy"/></div>}{c.stack&&<p className={s.chapterStack} data-career-stack><span>Tecnologias</span><TextReveal text={c.stack}/></p>}{c.site&&<a className={s.textLink} data-career-link href={c.site} {...external}>Documentação no Google Sites<ArrowUpRight size={16}/></a>}
      <div className={s.chapterMobile} data-chapter-mobile data-image-fit={c.fit} style={{'--chapter-bg':c.background}}><button onClick={()=>onOpen({image:c.image,title:c.organization,caption:''})} aria-label={`Ampliar imagem de ${c.organization}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy"/>{c.brandImage&&<img className={s.chapterBrand} src={c.brandImage} alt="CESAR School" width="70" height="70"/>}<ScanLine size={20}/></button></div>
    </article>))}</div><aside ref={stage} className={s.careerStage} aria-label="Visuais da trajetória"><div className={s.chapterImages}>{chapters.map((c,i)=>localize(<button key={c.id} className={s.chapterVisual} data-image-fit={c.fit} style={{'--chapter-bg':c.background}} data-chapter-visual={i} data-active={activeChapter===i} onClick={()=>onOpen({image:c.image,title:c.organization,caption:''})} tabIndex={activeChapter===i?0:-1} aria-hidden={activeChapter!==i} aria-label={`Ampliar imagem: ${c.caption}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy"/>{c.brandImage&&<img className={s.chapterBrand} src={c.brandImage} alt="CESAR School" width="70" height="70"/>}</button>))}</div></aside></div>
  </div></section>);
}

function ProjectGallery({ onOpen, reduced }) {
  const initial=projects.findIndex(p=>window.location.hash===`#projeto-${p.id}`);
  const [open,setOpen]=useState(initial<0?null:initial);
  const current=useRef(initial<0?null:initial), section=useRef(null), changing=useRef(false), anchorLock=useRef(!!window.location.hash);
  const transition=useRef(null), scrolling=useRef(false);
  const switchTo=(index,preserve=true,instant=false)=>{
    if(index===current.current)return;
    const panels=[...section.current.querySelectorAll('[data-project-panel]')];
    const row=section.current.querySelector(`[data-project-trigger="${index??current.current}"]`);
    const before=row?.getBoundingClientRect().top;
    transition.current?.kill();
    const heights=panels.map(panel=>panel.getBoundingClientRect().height);
    const target=index??current.current;
    const compensate=preserve&&row&&before>0&&before<innerHeight;
    let centered=0;
    const contentHeight=index===null?0:panels[index].firstElementChild.firstElementChild.getBoundingClientRect().height;
    const bandHeight=(row?.offsetHeight||0)+contentHeight;
    const navHeight=document.querySelector('header')?.offsetHeight||108;
    const desiredTop=Math.max(navHeight+16,navHeight+(innerHeight-navHeight-bandHeight)/2);
    const centerDistance=compensate&&index!==null?before-desiredTop:0;
    let prefix=heights.slice(0,target).reduce((a,b)=>a+b,0);
    current.current=index;changing.current=true;
    flushSync(()=>setOpen(index));
    if(reduced||instant){
      gsap.set(panels,{clearProps:'height,gridTemplateRows,overflow'});
      panels.forEach(p=>gsap.set(p.firstElementChild,{clearProps:'opacity,transform'}));
      if(compensate)window.scrollBy({top:row.getBoundingClientRect().top-before+centerDistance,behavior:'instant'});
      changing.current=false;ScrollTrigger.refresh(true);return;
    }
    // Align the opening band while compensating outgoing height. Wheel/touch deltas remain native.
    gsap.set(panels,{height:i=>heights[i],gridTemplateRows:'1fr',overflow:'hidden'});
    const timeline=gsap.timeline({onUpdate:()=>{
      if(!compensate)return;
      const next=panels.slice(0,target).reduce((sum,p)=>sum+p.getBoundingClientRect().height,0);
      const centerNow=centerDistance*gsap.parseEase('power2.inOut')(timeline.progress());
      const delta=next-prefix+centerNow-centered;prefix=next;centered=centerNow;
      if(Math.abs(delta)>.01)window.scrollBy({top:delta,behavior:'instant'});
    },onComplete:()=>{
      gsap.set(panels,{clearProps:'height,gridTemplateRows,overflow'});
      panels.forEach(p=>gsap.set(p.firstElementChild,{clearProps:'opacity,transform'}));
      changing.current=false;ScrollTrigger.refresh(true);
    }});
    transition.current=timeline;

    panels.forEach((panel,i)=>{
      const content=panel.firstElementChild;
      const height=i===index?content.firstElementChild.getBoundingClientRect().height:0;
      if(!heights[i]&&!height)return;
      timeline.to(panel,{height,duration:i===index?.56:.44,ease:'power2.inOut'},0);
      if(i===index){
        if(!heights[i])gsap.set(content,{opacity:0,y:12});
        timeline.to(content,{opacity:1,y:0,duration:.4,ease:'power3.out'},.1);
      }else timeline.to(content,{opacity:0,y:-8,duration:.28,ease:'power2.in'},0);
    });
  };
  useEffect(()=>{
    let frame=0,settle,scrollEnd;
    const update=()=>{
      frame=0;
      if(changing.current||anchorLock.current||document.querySelector('dialog[open]'))return;
      const bounds=section.current.getBoundingClientRect();
      if(bounds.top>innerHeight*.6||bounds.bottom<innerHeight*.3)return;
      const rows=[...section.current.querySelectorAll('[data-project-trigger]')];
      let index=null;
      rows.forEach((row,i)=>{if(row.getBoundingClientRect().top<=innerHeight*.6)index=i;});
      if(index!==null)switchTo(index);
    };
    const queue=()=>{
      scrolling.current=true;clearTimeout(scrollEnd);scrollEnd=setTimeout(()=>{scrolling.current=false;},180);
      if(anchorLock.current){clearTimeout(settle);settle=setTimeout(()=>{anchorLock.current=false;},220);return;}
      if(!frame)frame=requestAnimationFrame(update);
    };
    const anchor=e=>{
      const link=e.target.closest('a[href^="#"]');
      if(!link||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      anchorLock.current=true;
      const target=projects.findIndex(p=>link.hash===`#projeto-${p.id}`);
      if(target>=0)switchTo(target,false,true);
      clearTimeout(settle);settle=setTimeout(()=>{anchorLock.current=false;},1400);
    };
    const hashChange=()=>{
      anchorLock.current=true;
      const target=projects.findIndex(p=>window.location.hash===`#projeto-${p.id}`);
      if(target>=0)switchTo(target,false,true);
      clearTimeout(settle);settle=setTimeout(()=>{anchorLock.current=false;},1400);
    };
    if(anchorLock.current)settle=setTimeout(()=>{anchorLock.current=false;},1400);
    window.addEventListener('hashchange',hashChange);
    document.addEventListener('click',anchor,true);
    window.addEventListener('scroll',queue,{passive:true});
    window.addEventListener('resize',queue);
    return()=>{cancelAnimationFrame(frame);transition.current?.kill();changing.current=false;scrolling.current=false;section.current?.querySelectorAll('[data-project-panel]').forEach(p=>{gsap.set(p,{clearProps:'height,gridTemplateRows,overflow'});gsap.set(p.firstElementChild,{clearProps:'opacity,transform'});});clearTimeout(settle);clearTimeout(scrollEnd);document.removeEventListener('click',anchor,true);window.removeEventListener('hashchange',hashChange);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);};
  },[reduced]);
  return localize(<section id="projetos" ref={section} className={s.projects} aria-labelledby="projects-title">
    <div className={s.projectsHeading} data-context="iniciativa"><div className={`${s.container} ${s.projectsIntro}`}><h2 id="projects-title"><span data-project-heading-line>Cada ideia,</span><span data-project-heading-line>um mundo para explorar.</span></h2></div></div>
    {projects.map((p,i)=>localize(<article id={`projeto-${p.id}`} key={p.id} className={s.projectBand} data-project={p.id} data-context={p.context} data-expanded={open===i}
      onPointerEnter={e=>{if(e.pointerType==='mouse'&&!anchorLock.current&&!changing.current&&!scrolling.current)switchTo(i);}}
      onKeyDown={e=>{if(e.key==='Escape'){switchTo(null);document.getElementById(`project-toggle-${p.id}`)?.focus({preventScroll:true});}}}>
      <div className={s.container}>
        <div className={s.projectBandTop} data-project-trigger={i}>
          <div className={s.projectIdentity}><span className={s.projectTopic}>{p.topic}</span><h3><button id={`project-toggle-${p.id}`} aria-expanded={open===i} aria-controls={`project-gallery-${p.id}`} onClick={()=>switchTo(open===i?null:i)}>{p.name}</button></h3><span className={s.galleryHint}>{open===i?'Recolher projeto':'Explorar projeto'}</span></div>
          <div className={s.projectActions}>
            {p.repo?<a href={`https://github.com/${p.repo}`} {...external} aria-label={`GitHub de ${p.name}${p.private?' (repositório privado)':''}`}><Github size={18}/><span>GitHub{p.private&&<small>privado</small>}</span></a>:<span className={s.unavailable}><Github size={18}/><span>Código não publicado</span></span>}
            {p.id==='cortech'?null:p.live?<a href={p.live} {...external} aria-label={`Acessar ${p.name}`}>Acessar<ArrowUpRight size={19}/></a>:<span className={s.unavailable}>Acesso em atualização</span>}
          </div>
        </div>
        <div id={`project-gallery-${p.id}`} data-project-panel className={`${s.projectGallery} ${open===i?s.projectGalleryOpen:''}`} inert={open!==i?true:undefined} aria-hidden={open!==i}>
          <div className={s.galleryClip}><div className={s.projectContent}>
            <figure className={s.galleryScreenshot}><ProjectImage project={p} onOpen={onOpen} reduced={reduced}/><figcaption>{p.imageType}</figcaption></figure>
            <ProjectNarrative project={p} open={open===i} reduced={reduced}/>
          </div></div>
        </div>
      </div>
    </article>))}
  </section>);
}

function Curriculum() {
  return localize(<section id="curriculo" className={s.curriculum} data-context="pessoa"><div className={`${s.container} ${s.curriculumInner}`}><FileDown size={46} strokeWidth={1.2}/><div><h2>O percurso completo,<br/>para levar com você.</h2><p>Formação, experiências e competências reunidas no meu currículo.</p></div><LinkButton href="/Arthur-Moury-CV.pdf" {...external}>Abrir currículo</LinkButton></div></section>);
}

function Contact({ reduced }) {
  const form = useRef(null);
  const [errors,setErrors] = useState({});
  const [draft,setDraft] = useState(null);
  const [subject,setSubject] = useState('');
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
    if(Object.keys(next).length) { setDraft(null); document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus(); return; }
    setDraft({ ...values, subject:t(values.subject), body:`${t('Olá, Arthur!')}\n\n${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}` });
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`${t('Para')}: ${profile.email}\n${t('Assunto')}: ${draft.subject}\n\n${draft.body}`); setCopyStatus('Mensagem copiada. Cole no seu e-mail para enviar.'); } catch { setCopyStatus('Não foi possível copiar. Use o link para abrir seu e-mail.'); } };
  const props = id => ({ id:`contact-${id}`,name:id,'aria-invalid':!!errors[id],'aria-describedby':errors[id] ? `error-${id}` : undefined,onChange:() => { setDraft(null); if(errors[id]) setErrors(prev=>({...prev,[id]:undefined})); } });
  return localize(<section id="contato" className={s.contact} data-section="contato" data-context="pessoa" aria-labelledby="contact-title"><div className={`${s.container} ${s.contactGrid}`}><div className={s.contactCopy}><p className={s.sectionKicker}>Contato</p><h2 id="contact-title">Sempre há espaço<br />para uma<br /><span>boa conversa.</span></h2><p>Uma oportunidade, uma dúvida ou só uma troca de ideias. Pode chegar, vou gostar de ouvir você.</p><a className={s.contactEmail} href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} /></a><div className={s.contactLinks}><a href={profile.linkedin} {...external}>LinkedIn<ArrowUpRight size={15} /></a><a href={profile.github} {...external}>GitHub<ArrowUpRight size={15} /></a><a href="/Arthur-Moury-CV.pdf" target="_blank">Currículo<ArrowUpRight size={15} /></a></div><p className={s.address}><MapPin size={15} /> Recife, Pernambuco</p></div><form ref={form} className={s.contactForm} noValidate onSubmit={submit}>
      <p>Comece por aqui.<span>O formulário prepara a mensagem no seu aplicativo de e-mail.</span></p>
      <div className={s.formField}><label htmlFor="contact-name">Seu nome <span>(obrigatório)</span></label><input {...props('name')} autoComplete="name" maxLength={100} required placeholder="Como posso te chamar?" />{errors.name && <span className={s.fieldError} id="error-name">{errors.name}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-email">Seu e-mail <span>(obrigatório)</span></label><input {...props('email')} type="email" autoComplete="email" maxLength={150} required placeholder="voce@exemplo.com" />{errors.email && <span className={s.fieldError} id="error-email">{errors.email}</span>}</div>
      <div className={s.formField}><label id="subject-label" htmlFor="contact-subject">Sobre o que vamos conversar?</label><SubjectSelect value={subject} onChange={value=>{setSubject(value);setDraft(null);setErrors(previous=>({...previous,subject:undefined}));}} invalid={!!errors.subject} describedBy={errors.subject?'error-subject':undefined}/>{errors.subject && <span className={s.fieldError} id="error-subject">{errors.subject}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-message">Conte um pouco <span>(obrigatório)</span></label><textarea {...props('message')} required rows={3} maxLength={1800} placeholder="O que você tem em mente?" />{errors.message && <span className={s.fieldError} id="error-message">{errors.message}</span>}</div>
      <button className={s.button} type="submit">Preparar e-mail<ArrowUpRight size={19} /></button>
      <div className={s.formStatus} aria-live="polite">{Object.values(errors).some(Boolean) && <p>Confira os campos indicados para continuar.</p>}{draft && <div className={s.draft}><strong><Check size={17} /> Mensagem pronta para revisar.</strong><p>Abra seu aplicativo e envie quando estiver tudo certo.</p><div><a href={`mailto:${profile.email}?subject=${encodeURIComponent(`[${t('Portfólio')}] ${draft.subject}`)}&body=${encodeURIComponent(draft.body)}`} className={s.textLink}>Abrir meu e-mail<ArrowUpRight size={16} /></a><button type="button" onClick={copy}><Copy size={15} /> Copiar mensagem</button></div></div>}{copyStatus && <p>{copyStatus}</p>}</div>
    </form></div>
    <footer className={`${s.container} ${s.footer}`}><div className={s.footerTop}><FooterSignature reduced={reduced}/><nav aria-label="Navegação do rodapé"><a href="#sobre">Quem sou</a><a href="#trajetoria">Trajetória</a><a href="#projetos">Projetos</a><a href={reduced?'/?motion=full':'/?motion=reduce'}>{reduced?'Versão com animações':'Reduzir animações'}</a></nav></div><div className={s.footerBottom}><span>© 2026 Arthur Moury</span><a href="#inicio">Voltar ao início <ArrowUpRight size={14}/></a></div></footer>
  </section>);
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
  return localize(<dialog ref={dialog} className={s.dialog} aria-labelledby="image-dialog-title" onKeyDown={containFocus} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>{value && <div className={s.dialogContent}><div className={s.dialogHeader}><h2 id="image-dialog-title">{value.title}</h2><button autoFocus onClick={onClose} aria-label="Fechar ampliação"><X size={24} /></button></div><img src={value.image} alt={value.caption || value.title} /><p>{value.caption}</p>{value.url && <a className={s.textLink} href={value.url} {...external}>Ver original no Drive<ArrowUpRight size={16}/></a>}</div>}</dialog>);
}


export default function App() {
  const root=useRef(null);
  const reduced=useReducedMotion();
  const [navigationVisible,setNavigationVisible]=useState(false);
  const [activeChapter,setActiveChapter]=useState(0);
  const [context,setContext]=useState('pessoa');
  const [activeSection,setActiveSection]=useState('inicio');
  const [image,setImage]=useState(null);
  usePageMotion(root,reduced,setNavigationVisible,setActiveChapter,setContext,setActiveSection);
  return localize(<div ref={root} className={s.app} data-reduced-motion={reduced}><a className={s.skipLink} href="#sobre">Pular para informações pessoais</a><Navigation visible={navigationVisible} context={context} activeSection={activeSection}/><main><div className={s.opening} data-opening><KineticHero reduced={reduced}/><About/></div><div className={s.sectionTransition} data-section-transition aria-hidden="true"><svg viewBox="0 0 1440 200" preserveAspectRatio="none"><path data-transition-surface d="M0 160Q720 -100 1440 160V200H0Z"/></svg></div><ProjectGallery onOpen={setImage} reduced={reduced}/><Career reduced={reduced} onOpen={setImage} activeChapter={activeChapter}/><Certificates reduced={reduced} onOpen={setImage} modalOpen={!!image}/><PracticeLab reduced={reduced}/><Curriculum/><Contact reduced={reduced}/></main><ImageDialog value={image} onClose={()=>setImage(null)}/></div>);
}
