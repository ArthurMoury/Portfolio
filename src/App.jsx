import { localize, t } from './i18n';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Check, X, Menu, Mail, Copy, MapPin, ScanLine, FileDown } from 'lucide-react';
import { chapters, profile } from './data/portfolio';
import { usePageMotion, useReducedMotion } from './motion';
import s from './App.module.css';
import KineticHero from './KineticHero';
import Certificates from './Certificates';
import PracticeLab from './PracticeLab';
import FooterSignature from './FooterSignature';
import SubjectSelect from './SubjectSelect';
import TextReveal from './TextReveal';
import ProjectGallery from './ProjectGallery';
import Github from './GithubIcon';

const external = { target: '_blank', rel: 'noreferrer noopener' };

function Linkedin({size=18}) { return localize(<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="2"/><path fill="var(--deepest)" d="M6 10h3v9H6zm1.5-5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2M11 10h3v1.3c.6-1 1.4-1.5 2.7-1.5 2.2 0 3.3 1.4 3.3 4V19h-3v-4.7c0-1.4-.5-2-1.5-2S14 13 14 14.3V19h-3z"/></svg>); }

function LinkButton({ href, children, secondary = false, ...props }) {
  return localize(<a href={href} className={`${s.button} ${secondary ? s.buttonSecondary : ''}`} {...props}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>);
}

function Navigation({ visible, activeSection }) {
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

function Career({ onOpen, activeChapter, reduced }) {
  const stage=useRef(null), previous=useRef(activeChapter);
  useEffect(()=>{
    if(reduced || !stage.current.offsetHeight){previous.current=activeChapter;return;}
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
  const [activeSection,setActiveSection]=useState('inicio');
  const [image,setImage]=useState(null);
  usePageMotion(root,reduced,setNavigationVisible,setActiveChapter,setActiveSection);
  return localize(<div ref={root} className={s.app} data-reduced-motion={reduced}><a className={s.skipLink} href="#sobre">Pular para informações pessoais</a><Navigation visible={navigationVisible} activeSection={activeSection}/><main><div className={s.opening} data-opening><KineticHero reduced={reduced}/><About/></div><div className={s.sectionTransition} data-section-transition aria-hidden="true"><svg viewBox="0 0 1440 200" preserveAspectRatio="none"><path data-transition-surface d="M0 160Q720 -100 1440 160V200H0Z"/></svg></div><ProjectGallery onOpen={setImage} reduced={reduced}/><Career reduced={reduced} onOpen={setImage} activeChapter={activeChapter}/><Certificates reduced={reduced} onOpen={setImage} modalOpen={!!image}/><PracticeLab reduced={reduced}/><Curriculum/><Contact reduced={reduced}/></main><ImageDialog value={image} onClose={()=>setImage(null)}/></div>);
}
