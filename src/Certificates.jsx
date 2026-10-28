import { useEffect, useRef, useState } from 'react';
import { LazyMotion, domAnimation, m, useAnimationFrame, useMotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play, ScanLine } from 'lucide-react';
import { certificates } from './data/certificates';
import s from './Certificates.module.css';

export default function Certificates({ reduced, onOpen, modalOpen }) {
  const root = useRef(null), viewport = useRef(null), group = useRef(null);
  const length = useRef(0), visible = useRef(false), activeTab = useRef(!document.hidden);
  const drag = useRef(null), dragged = useRef(false);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrap = value => length.current ? -(((-value % length.current) + length.current) % length.current) : value;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: .08 });
    observer.observe(root.current);
    const resize = new ResizeObserver(() => { length.current = group.current.offsetWidth + 24; x.set(reduced ? 0 : wrap(x.get())); });
    resize.observe(group.current);
    const visibility = () => { activeTab.current = !document.hidden; };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [reduced, x]);
  useAnimationFrame((_, delta) => {
    if (!reduced && visible.current && activeTab.current && !paused && !focused && !modalOpen && !drag.current) x.set(wrap(x.get() - Math.min(delta, 48) * .035));
  });
  const advance = direction => {
    const step = group.current.firstElementChild.offsetWidth + 24;
    if (reduced) viewport.current.scrollBy({ left: direction * step, behavior: 'auto' });
    else x.set(wrap(x.get() - direction * step));
  };
  const focus = (event, index) => {
    if (!event.target.matches(':focus-visible')) return;
    setFocused(true);
    if (!reduced) {
      const card = group.current.children[index];
      const offset = card.offsetLeft;
      x.set(-Math.max(0, offset - (viewport.current.clientWidth - card.offsetWidth) / 2));
    }
  };
  const open = certificate => onOpen({ image: certificate.image, title: certificate.title, caption: certificate.issuer, url: certificate.redacted ? undefined : certificate.url });
  const pointerDown = event => {
    if (reduced) return;
    dragged.current = false;
    drag.current = { pointer: event.pointerId, start: event.clientX, initial: x.get() };
  };
  const pointerMove = event => {
    if (!drag.current || event.pointerId !== drag.current.pointer) return;
    const delta = event.clientX - drag.current.start;
    if (Math.abs(delta) > 7) { dragged.current = true; x.set(wrap(drag.current.initial + delta)); }
  };
  const endDrag = () => { drag.current = null; };
  const card = (certificate, index, duplicate = false) => <m.button key={certificate.id} type="button" className={s.card} tabIndex={duplicate ? -1 : 0}
    aria-label={`Ampliar certificado: ${certificate.title}`} onFocus={e => focus(e, index)} onClick={() => open(certificate)}
    whileHover={reduced ? undefined : { scale: 1.09, y: -12, rotate: index % 2 ? 1 : -1 }} whileFocus={reduced ? undefined : { scale: 1.07, y: -10 }}
    transition={{ duration: .38, ease: [.22, 1, .36, 1] }}>
    <span className={s.document}><img src={certificate.thumbnail} alt={`Certificado de Arthur Moury: ${certificate.title}`} width={certificate.width} height={certificate.height} loading="lazy" draggable="false"/><span className={s.expand}><ScanLine size={17}/></span></span>
    <span className={s.caption}><strong>{certificate.title}</strong><span>{certificate.issuer}</span></span>
  </m.button>;
  return <LazyMotion features={domAnimation}><section ref={root} id="certificados" className={s.section} aria-labelledby="certificates-title" data-context="faculdade">
    <div className={s.heading}><h2 id="certificates-title">O aprendizado<br/><span>não para.</span></h2><div className={s.tools}><span className={s.count}>{certificates.length} certificados & experiências</span><div className={s.controls}>
      <button onClick={() => advance(-1)} aria-label="Ver certificados anteriores"><ArrowLeft size={18}/></button>
      {!reduced && <button onClick={() => setPaused(v => !v)} aria-label={paused ? 'Retomar carrossel de certificados' : 'Pausar carrossel de certificados'} aria-pressed={paused}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>}
      <button onClick={() => advance(1)} aria-label="Ver próximos certificados"><ArrowRight size={18}/></button>
    </div></div></div>
    <div ref={viewport} className={`${s.viewport} ${reduced ? s.static : ''}`} aria-roledescription="carrossel" aria-label="Certificados de Arthur Moury" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}
      onClickCapture={e => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <m.div className={s.track} style={reduced ? undefined : { x }} data-certificate-track>
        <div ref={group} className={s.group}>{certificates.map((certificate, index) => card(certificate, index))}</div>
        {!reduced && <div className={s.group} aria-hidden="true">{certificates.map((certificate, index) => card(certificate, index, true))}</div>}
      </m.div>
    </div>
    <div className={s.bottom}><span>Pequenas conquistas. Novas possibilidades.</span><a href="https://drive.google.com/drive/folders/1XRFKKlfDYoGV3jMZjAE0DvzvVM1JhHvk" target="_blank" rel="noreferrer noopener">Ver pasta no Drive ↗</a></div>
  </section></LazyMotion>;
}
