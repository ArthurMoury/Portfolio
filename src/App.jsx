import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, BriefcaseBusiness, GraduationCap, Sparkles, Code2, GitBranch, Check, X, Menu, Pause, Play, RotateCcw, Mail, Copy, MapPin, CheckCheck, Layers3, ScanLine } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { categories, projects, chapters, forks, faqs, profile } from './data/portfolio';
import { usePageMotion, useReducedMotion } from './motion';
import s from './App.module.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const icons = { work: BriefcaseBusiness, study: GraduationCap, spark: Sparkles };
const repoUrl = p => `https://github.com/${p.repo}`;
const external = { target: '_blank', rel: 'noreferrer noopener' };

function Logo({ className = '' }) {
  return <a className={`${s.logo} ${className}`} href="#inicio" aria-label="Arthur Moury, início"><span className={s.monogram} aria-hidden="true">a<span>m</span><i /></span><span>arthur<br />moury.</span></a>;
}

function LinkButton({ href, children, light = false, secondary = false, ...props }) {
  return <a href={href} className={`${s.button} ${light ? s.buttonLight : ''} ${secondary ? s.buttonSecondary : ''}`} {...props}>{children}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}

function Badge({ reduced }) {
  const tilt = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const follow = e => {
    if (reduced || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(tilt.current, { rotateY: (e.clientX - r.left - r.width / 2) / 20, rotateX: -(e.clientY - r.top - r.height / 2) / 30, duration: 0.55, ease: 'power3.out' });
  };
  return <div className={s.badgeScene}>
    <div className={s.badgeSuspension} data-badge>
      <div className={s.lanyard} aria-hidden="true"><span>ARTHUR MOURY · IDEIAS EM MOVIMENTO · </span></div>
      <div className={s.clip} aria-hidden="true" />
      <div ref={tilt} className={s.badgeTilt}>
        <button className={`${s.badge} ${flipped ? s.badgeFlipped : ''}`} onClick={() => setFlipped(!flipped)} onPointerMove={follow} onPointerLeave={() => gsap.to(tilt.current, { rotateX: 0, rotateY: 0, duration: 0.7 })} aria-label={flipped ? 'Ver frente do crachá de Arthur' : 'Virar crachá para conhecer as habilidades de Arthur'} aria-pressed={flipped}>
          <span className={s.badgeFront} aria-hidden={flipped}>
            <span className={s.badgeTop}><span>Prazer, Arthur.</span><ScanLine size={18} /></span>
            <span className={s.badgePhoto}><img src="/images/arthur-moury.webp" width="700" height="915" alt="Retrato de Arthur Moury" fetchPriority="high" /></span>
            <span className={s.badgeName}>Arthur<br />Moury<span className={s.badgeDot}>.</span></span>
            <span className={s.badgeRole}>Desenvolvimento · Dados · IA</span>
            <span className={s.badgeBottom}><span>CESAR School<br />Recife, PE</span><span className={s.barcode} aria-hidden="true" /></span>
          </span>
          <span className={s.badgeBack} aria-hidden={!flipped}>
            <Code2 size={46} strokeWidth={1.2} /><strong>Movido por<br />curiosidade.</strong>
            <span>Ciência da Computação<br />CESAR School</span>
            <span>IA Ops · Roomi</span>
            <span className={s.badgeSkills}>Python · Java · C<br />React · Node.js · Django<br />Dados · Automação · QA</span>
            <span>Inglês fluente · Recife, PE</span>
          </span>
        </button>
      </div>
    </div>
    <p className={s.badgeHint}><RotateCcw size={13} /> Toque para virar o crachá</p>
  </div>;
}

function Hero({ reduced }) {
  return <section id="inicio" className={s.hero} aria-labelledby="hero-title" data-section="abertura">
    <picture className={s.heroPhoto}><source media="(max-width: 640px)" srcSet="/images/recife-mobile.webp" /><img src="/images/recife.webp" width="1920" height="1280" alt="Recife ao entardecer, com a cidade refletida na água" fetchPriority="high" /></picture>
    <div className={s.heroShade} />
    <div className={`${s.heroTop} ${s.container}`}><Logo /><span className={s.heroLocation}><span /> Recife, Brasil</span></div>
    <div className={`${s.heroContent} ${s.container}`}>
      <div className={s.heroText}>
        <p className={s.introLabel} data-hero-copy>Bom te ver por aqui.</p>
        <h1 id="hero-title"><span data-hero-copy>Olá, sou</span><span className={s.heroName} data-hero-copy>Arthur Moury<span>.</span></span></h1>
        <p className={s.heroDescription} data-hero-copy>Entre código, dados e <br />novas possibilidades.</p>
        <p className={s.heroBio} data-hero-copy>Estudante de Ciência da Computação na CESAR School e estagiário em IA Ops na Roomi. Gosto de entender problemas e construir o que vem depois.</p>
        <div data-hero-copy><LinkButton href="#projetos">Conheça meus projetos</LinkButton></div>
        <div className={s.heroMeta} data-hero-copy><span><GraduationCap size={16} /> CESAR School</span><span><BriefcaseBusiness size={16} /> IA Ops · Roomi</span></div>
      </div>
      <Badge reduced={reduced} />
    </div>
    <svg className={s.heroScribble} viewBox="0 0 1440 650" fill="none" aria-hidden="true"><path data-hero-stroke d="M-70 480C180 370 300 610 565 484S1040 90 1117 277 919 478 972 305 1276 92 1507 173" /></svg>
    <div className={`${s.heroBottom} ${s.container}`}><span>Portfólio pessoal · 2026</span><a href="#projetos" aria-label="Rolar para projetos"><ArrowDown size={19} /> Continue explorando</a></div>
    <svg className={s.heroWave} viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden="true"><path data-wave d="M0 74C290 120 405 10 720 64S1170 140 1440 40V130H0Z" /></svg>
  </section>;
}

function Navigation({ visible }) {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  useEffect(() => { if (!visible) setOpen(false); }, [visible]);
  const close = () => setOpen(false);
  const escape = e => { if (e.key === 'Escape') { setOpen(false); menu.current?.focus(); } };
  return <header className={`${s.navigation} ${visible ? s.navigationVisible : ''}`} inert={!visible ? true : undefined} aria-label="Navegação persistente" onKeyDown={escape}>
    <div className={s.navInner}><Logo /><nav id="site-menu" className={`${s.navLinks} ${open ? s.navOpen : ''}`} aria-label="Navegação principal"><a href="#projetos" onClick={close}>Projetos</a><a href="#trajetoria" onClick={close}>Trajetória</a><a href="#processo" onClick={close}>Como penso</a><a href="#perguntas" onClick={close}>Mais sobre mim</a></nav><div className={s.navActions}><LinkButton href="#contato">Vamos conversar</LinkButton><button ref={menu} className={s.menuButton} aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>
  </header>;
}

function ProjectImage({ project, onOpen, className = '' }) {
  return <button className={`${s.projectImage} ${className}`} onClick={() => onOpen({ image: project.image, title: project.name, caption: `${project.imageType} · ${project.summary}` })} aria-label={`Ampliar imagem: ${project.name}`}><img src={project.image} alt={`${project.imageType}: ${project.name}`} loading="lazy" width="1260" height="710" /><span className={s.imageExpand}><ScanLine size={17} /><span>Ampliar</span></span></button>;
}

function Projects({ onOpen, reduced }) {
  const [category, setCategory] = useState('trabalho');
  const [filter, setFilter] = useState('todos');
  const panel = useRef(null);
  const activeCategory = categories.find(c => c.id === category);
  const featured = projects.find(p => p.category === category && p.feature);
  const filtered = filter === 'todos' ? projects : projects.filter(p => p.category === filter);
  const select = id => { setCategory(id); setFilter(id); };
  useEffect(() => { if (!reduced) { const ctx = gsap.context(() => gsap.fromTo(panel.current, { opacity: 0.8, y: 12 }, { opacity: 1, y: 0, duration: 0.4, clearProps: 'all' })); return () => ctx.revert(); } }, [category,reduced]);
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(frame); }, [category,filter]);
  const keyboard = (e, i) => { const direction = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (direction) { e.preventDefault(); const next = (i + direction + 3) % 3; select(categories[next].id); document.getElementById(`path-tab-${categories[next].id}`)?.focus(); } };
  return <section id="projetos" className={s.projects} data-section="percurso" aria-labelledby="projects-title">
    <div className={s.container}>
      <div className={s.sectionIntro}><p className={s.sectionKicker}><span className={s.smallStar} aria-hidden="true">✳</span> O que me move</p><h2 id="projects-title">Vários caminhos.<br /><span className={s.mutedTitle}>A mesma curiosidade.</span></h2><p>Projetos que conectam o que eu estudo,<br className={s.desktopBreak} /> o que eu faço e o que quero descobrir.</p></div>
      <div className={s.pathway} role="tablist" aria-label="Contexto dos projetos">
        <svg viewBox="0 0 1000 190" preserveAspectRatio="none" aria-hidden="true"><path className={s.pathTrack} d="M-20 125C140-15 228 10 335 94S490 210 615 111 853-12 1020 75" /><path className={s.pathDraw} data-journey-path d="M-20 125C140-15 228 10 335 94S490 210 615 111 853-12 1020 75" /></svg>
        {categories.map((c, i) => { const Icon = icons[c.icon]; return <button key={c.id} id={`path-tab-${c.id}`} role="tab" aria-selected={category === c.id} aria-controls="path-panel" tabIndex={category === c.id ? 0 : -1} className={`${s.pathPoint} ${s[`point${i}`]} ${category === c.id ? s.pathPointActive : ''}`} onClick={() => select(c.id)} onKeyDown={e => keyboard(e, i)}><span className={s.pathIcon}><Icon size={24} strokeWidth={1.5} /></span><span>{c.label}</span></button>; })}
      </div>
      <div ref={panel} id="path-panel" role="tabpanel" aria-labelledby={`path-tab-${category}`} className={s.pathDetails}>
        <div className={`${s.featureVisual} ${s[featured.color]}`}><ProjectImage project={featured} onOpen={onOpen} /><span className={s.figureCaption}>{featured.imageType} · {featured.name}</span></div>
        <div className={s.featureCopy}><span className={s.contextLabel}>{activeCategory.word} / {activeCategory.label}</span><h3>{activeCategory.title}</h3><p>{activeCategory.description}</p><div className={s.featureName}>{featured.name}<span>{featured.summary}</span></div><a className={s.textLink} href={repoUrl(featured)} {...external}>Explorar o projeto <ArrowUpRight size={18} /></a></div>
      </div>
      <div className={s.archive}>
        <div className={s.archiveHeader}><h3>O acervo completo<span>({projects.length})</span></h3><div className={s.filters} role="group" aria-label="Filtrar o acervo">{[{id:'todos', label:'Todos'}, ...categories].map(c => <button key={c.id} onClick={() => { setFilter(c.id); if(c.id !== 'todos') setCategory(c.id); }} aria-pressed={filter === c.id}>{c.id === 'independente' ? 'Independentes' : c.label}</button>)}</div></div>
        <p className={s.archiveNote} role="status">{filtered.length} {filtered.length === 1 ? 'projeto público' : 'projetos públicos'} · clique na imagem para ampliar ou no nome para abrir o código.</p>
        <div className={s.projectList}>{filtered.map(p => <article className={s.projectRow} key={p.id}>
          <ProjectImage project={p} onOpen={onOpen} className={s.rowImage} />
          <div className={s.rowMain}><a href={repoUrl(p)} {...external}><h4>{p.name}<ArrowUpRight size={18} /></h4></a><p>{p.summary}</p><div className={s.techTags}>{p.tech.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div></div>
          <div className={s.rowContext}><span>{categories.find(c => c.id === p.category).label}</span><span>{p.year}</span>{p.live && <a href={p.live} {...external}>Visitar site <ArrowUpRight size={14} /></a>}</div>
        </article>)}</div>
        <details className={s.forks}><summary><GitBranch size={16} /> Explorações em código aberto <span>3 forks</span></summary><p>Repositórios de terceiros que explorei. A autoria original pertence aos projetos indicados.</p>{forks.map(f => <div key={f.repo}><a href={`https://github.com/${f.repo}`} {...external}>{f.repo}<ArrowUpRight size={14} /></a><span>Fork de <a href={`https://github.com/${f.source}`} {...external}>{f.source}</a></span></div>)}</details>
      </div>
    </div>
  </section>;
}

function Career({ onOpen, activeChapter, setActiveChapter }) {
  return <section id="trajetoria" className={s.career} data-section="capitulos" aria-labelledby="career-title">
    <div className={s.container}>
      <div className={s.careerIntro}><p className={s.sectionKicker}>Uma trajetória em construção</p><h2 id="career-title">Experiência é<br />conectar os pontos<span>.</span></h2><p>Da sala de aula ao primeiro estágio.<br />Do problema cotidiano ao projeto que ganha vida.</p></div>
      <div className={s.careerGrid}><div className={s.chapterList}>{chapters.map((c,i) => <article id={`capitulo-${c.id}`} key={c.id} className={`${s.chapter} ${i === activeChapter ? s.chapterActive : ''}`} data-chapter={i}>
        <span className={s.chapterMarker}><span>{String(i+1).padStart(2,'0')}</span>{c.marker}</span><p className={s.organization}>{c.organization}</p><h3>{c.title}</h3><p className={s.chapterRole}>{c.role}</p><p className={s.chapterText}>{c.text}</p><a className={s.textLink} href={c.link} {...(c.link.startsWith('http') ? external : {target:'_blank'})}>{c.linkText}<ArrowUpRight size={18} /></a>
        <div className={s.chapterMobile}><button onClick={() => onOpen({image:c.image,title:c.organization,caption:`${c.imageType} · ${c.caption}`})} aria-label={`Ampliar imagem de ${c.organization}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy" /><ScanLine size={20} /></button><span>{c.imageType}</span></div>
      </article>)}</div>
      <aside className={s.careerStage} aria-label="Visuais da trajetória"><div className={s.chapterImages}>{chapters.map((c,i) => <button key={c.id} data-chapter-visual={i} data-active={activeChapter === i} className={s.chapterVisual} onClick={() => onOpen({ image:c.image,title:c.organization,caption:`${c.imageType} · ${c.caption}` })} tabIndex={activeChapter === i ? 0 : -1} aria-hidden={activeChapter !== i} aria-label={`Ampliar imagem: ${c.caption}`}><img src={c.image} alt={c.caption} width="1260" height="710" loading="lazy" /><span className={s.stageCaption}>{c.imageType}<ScanLine size={18} /></span></button>)}</div><div className={s.stageFooter}><span>{chapters[activeChapter].caption}</span><span>{String(activeChapter+1).padStart(2,'0')} / 04</span></div><nav className={s.chapterNav} aria-label="Ir para um capítulo">{chapters.map((c,i) => <a key={c.id} href={`#capitulo-${c.id}`} aria-label={`Capítulo ${i+1}: ${c.organization}`} aria-current={i === activeChapter ? 'step' : undefined} onClick={() => setActiveChapter(i)}><span /></a>)}</nav></aside></div>
    </div>
  </section>;
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
  return <section id="processo" className={s.process} ref={root} data-section="demonstracao" aria-labelledby="process-title">
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

function Start() {
  const steps = [{icon:ScanLine,title:'Encontre uma ideia.',text:'Explore os projetos por trabalho, faculdade ou iniciativa própria. Amplie os visuais e veja o contexto.'},{icon:Code2,title:'Olhe por dentro.',text:'Abra o repositório, leia a documentação e conheça as tecnologias e decisões de cada projeto.'},{icon:Mail,title:'Vamos conversar.',text:'Conte o que chamou sua atenção, apresente uma oportunidade ou compartilhe uma pergunta.'}];
  return <section id="explorar" className={s.start} data-section="como-comecar" aria-labelledby="start-title"><div className={s.container}><div className={s.startTop}><h2 id="start-title">Um jeito de<br />me conhecer melhor.</h2><LinkButton href="/Arthur-Moury-CV.pdf" target="_blank" secondary>Consultar currículo</LinkButton></div><ol className={s.startSteps}>{steps.map((v,i) => <li key={v.title}><div className={s.stepSymbol}><v.icon size={31} strokeWidth={1.4} /><span>{String(i+1).padStart(2,'0')}</span></div><h3>{v.title}</h3><p>{v.text}</p></li>)}</ol></div></section>;
}

function Highlight() {
  return <section className={s.highlight} data-section="destaque" aria-labelledby="highlight-title"><div className={`${s.container} ${s.highlightInner}`}><span className={s.largeSymbol} aria-hidden="true">✳</span><div><h2 id="highlight-title">Criar é só uma parte.<br />Testar também é construir.</h2><p>Tenho interesse em qualidade de software, testes automatizados e CI/CD. A experiência só faz sentido quando o que foi pensado funciona para quem usa.</p></div><a className={s.textLink} href="/Arthur-Moury-CV.pdf" target="_blank">Ver minhas competências<ArrowUpRight size={20} /></a></div></section>;
}

function Closing() {
  return <section id="proxima-ideia" className={s.closing} data-section="encerramento" aria-labelledby="closing-title"><div className={`${s.container} ${s.closingGrid}`}><div><p className={s.sectionKicker}>Continuo em movimento</p><h2 id="closing-title">A próxima ideia<br />pode começar<br /><span>numa conversa.</span></h2><p>Curiosidade para aprender. Cuidado para construir.<br />Se existe um problema interessante, quero conhecer.</p><LinkButton href="#contato">Vamos conversar</LinkButton></div><div className={s.deviceScene}><svg className={s.deviceShape} data-device-shape viewBox="0 0 600 620" aria-hidden="true"><path d="M481 90c98 97 78 189 48 288s-93 191-205 187S72 458 61 320 138 73 251 44s159-24 230 46Z" /></svg><figure className={s.device} data-device><div className={s.deviceSpeaker} /><img src="/projects/betterway-mobile.webp" width="420" height="760" alt="Visual mobile da Better Way, projeto de inteligência financeira" loading="lazy" /><figcaption>Better Way · visual do projeto</figcaption></figure><span className={s.deviceLabel}>Do aprendizado<br />à experiência.</span></div></div></section>;
}

function FAQ() {
  const [open,setOpen] = useState(null);
  const canHover = e => e.pointerType === 'mouse' && window.matchMedia('(min-width: 900px) and (hover: hover)').matches;
  const hover = (i,e) => { if (canHover(e)) setOpen(i); };
  return <section id="perguntas" className={s.faq} data-section="perguntas" aria-labelledby="faq-title"><div className={`${s.container} ${s.faqIntro}`}><p className={s.sectionKicker}>Além do código</p><h2 id="faq-title">Talvez você<br />esteja se perguntando.</h2></div>{faqs.map((f,i) => <article key={f.question} className={`${s.faqRow} ${s[`faq${f.tone}`]}`} onPointerEnter={e => hover(i,e)} onPointerLeave={e => { if(canHover(e)) setOpen(null); }}><div className={s.container}><div className={s.faqContent}><button aria-expanded={open === i} aria-controls={`faq-gallery-${i}`} onClick={() => setOpen(open === i ? null : i)} className={s.faqQuestion}><h3>{f.question}</h3><span>{open === i ? 'Recolher galeria' : 'Explorar galeria'}</span></button><div className={s.faqAnswer}><p>{f.answer}</p><div className={s.faqTags}><span>{f.topic}</span>{f.tags.map(t => <span key={t}>{t}</span>)}</div></div></div><div id={`faq-gallery-${i}`} className={`${s.faqGallery} ${open === i ? s.faqGalleryOpen : ''}`} inert={open !== i ? true : undefined}><div className={s.faqGalleryClip}><div className={s.faqGalleryTrack}><figure><img src={f.image} alt={`Visual de apoio sobre ${f.topic.toLowerCase()}`} loading="lazy" width="1260" height="710" /></figure><div className={s.galleryType}><span>Arthur Moury</span><strong>{f.support[0]}</strong><span>{f.topic}</span></div><div className={s.galleryDiagram}><div aria-hidden="true"><span /><span /><span /></div><strong>{f.support[1]}</strong></div></div></div></div></div></article>)}</section>;
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
  return <section id="contato" className={s.contact} data-section="contato" aria-labelledby="contact-title"><div className={`${s.container} ${s.contactGrid}`}><div className={s.contactCopy}><p className={s.sectionKicker}>Aberto a boas conversas</p><h2 id="contact-title">Sua ideia.<br />Nossa próxima<br /><span>conversa.</span></h2><p>Um projeto, uma oportunidade<br />ou uma troca sobre tecnologia.</p><a className={s.contactEmail} href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={20} /></a><div className={s.contactLinks}><a href={profile.linkedin} {...external}>LinkedIn<ArrowUpRight size={15} /></a><a href={profile.github} {...external}>GitHub<ArrowUpRight size={15} /></a><a href="/Arthur-Moury-CV.pdf" target="_blank">Currículo<ArrowUpRight size={15} /></a></div><p className={s.address}><MapPin size={15} /> Poço da Panela · Recife, PE, Brasil</p></div><form ref={form} className={s.contactForm} noValidate onSubmit={submit}>
      <p>Comece por aqui.<span>O formulário prepara a mensagem no seu aplicativo de e-mail.</span></p>
      <div className={s.formField}><label htmlFor="contact-name">Seu nome <span>(obrigatório)</span></label><input {...props('name')} autoComplete="name" maxLength={100} required placeholder="Como posso te chamar?" />{errors.name && <span className={s.fieldError} id="error-name">{errors.name}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-email">Seu e-mail <span>(obrigatório)</span></label><input {...props('email')} type="email" autoComplete="email" maxLength={150} required placeholder="voce@exemplo.com" />{errors.email && <span className={s.fieldError} id="error-email">{errors.email}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-subject">Sobre o que vamos conversar?</label><div className={s.selectWrap}><select {...props('subject')} required defaultValue=""><option value="" disabled>Escolha um assunto</option><option>Uma oportunidade profissional</option><option>Uma ideia de projeto</option><option>Uma colaboração</option><option>Uma conversa sobre tecnologia</option></select><ArrowDown size={17} aria-hidden="true" /></div>{errors.subject && <span className={s.fieldError} id="error-subject">{errors.subject}</span>}</div>
      <div className={s.formField}><label htmlFor="contact-message">Conte um pouco <span>(obrigatório)</span></label><textarea {...props('message')} required rows={3} maxLength={1800} placeholder="O que você tem em mente?" />{errors.message && <span className={s.fieldError} id="error-message">{errors.message}</span>}</div>
      <button className={s.button} type="submit">Preparar e-mail<ArrowUpRight size={19} /></button>
      <div className={s.formStatus} aria-live="polite">{Object.values(errors).some(Boolean) && <p>Confira os campos indicados para continuar.</p>}{draft && <div className={s.draft}><strong><Check size={17} /> Mensagem pronta para revisar.</strong><p>Abra seu aplicativo e envie quando estiver tudo certo.</p><div><a href={`mailto:${profile.email}?subject=${encodeURIComponent(`[Portfólio] ${draft.subject}`)}&body=${encodeURIComponent(draft.body)}`} className={s.textLink}>Abrir meu e-mail<ArrowUpRight size={16} /></a><button type="button" onClick={copy}><Copy size={15} /> Copiar mensagem</button></div></div>}{copyStatus && <p>{copyStatus}</p>}</div>
    </form></div>
    <footer className={`${s.container} ${s.footer}`}><div className={s.footerTop}><Logo /><p>Curiosidade em movimento.<br />Ideias que viram experiências.</p><nav aria-label="Navegação do rodapé"><a href="#projetos">Projetos</a><a href="#trajetoria">Trajetória</a><a href="#perguntas">Mais sobre mim</a><a href="#inicio">Voltar ao início <ArrowUpRight size={14} /></a><a href={reduced ? '/' : '/?motion=reduce'}>{reduced ? 'Versão com animações' : 'Reduzir animações'}</a></nav></div><div className={s.footerBottom}><span>© 2026 Arthur Moury</span><span>Feito com código, cuidado e vontade de aprender.</span><a href="https://unsplash.com/photos/FYBV47iO8Ok" {...external}>Fotografia de Recife: Mia Silva / Unsplash</a></div></footer>
  </section>;
}

function ImageDialog({ value, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if(!value) return;
    const previous = document.activeElement;
    const d = dialog.current;
    d.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { d.close(); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [value]);
  return <dialog ref={dialog} className={s.dialog} aria-labelledby="image-dialog-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>{value && <div className={s.dialogContent}><div className={s.dialogHeader}><h2 id="image-dialog-title">{value.title}</h2><button autoFocus onClick={onClose} aria-label="Fechar ampliação"><X size={24} /></button></div><img src={value.image} alt={value.caption} /><p>{value.caption}</p></div>}</dialog>;
}

export default function App() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const [navigationVisible,setNavigationVisible] = useState(false);
  const [activeChapter,setActiveChapter] = useState(0);
  const [image,setImage] = useState(null);
  usePageMotion(root,reduced,setNavigationVisible,setActiveChapter);
  return <div ref={root} className={s.app} data-reduced-motion={reduced}><a className={s.skipLink} href="#projetos">Pular para projetos</a><Navigation visible={navigationVisible} /><main><Hero reduced={reduced} /><Projects onOpen={setImage} reduced={reduced} /><Career onOpen={setImage} activeChapter={activeChapter} setActiveChapter={setActiveChapter} /><ProcessDemo reduced={reduced} /><Start /><Highlight /><Closing /><FAQ /><Contact reduced={reduced} /></main><ImageDialog value={image} onClose={() => setImage(null)} /></div>;
}
