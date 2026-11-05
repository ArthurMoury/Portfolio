import { localize, t } from './i18n';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import s from './SubjectSelect.module.css';

const options = ['Uma oportunidade profissional', 'Uma ideia de projeto', 'Uma colaboração', 'Uma conversa sobre tecnologia', 'Outro motivo'];

export default function SubjectSelect({ value, onChange, invalid, describedBy }) {
  const trigger = useRef(null), list = useRef(null), search = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false), [active, setActive] = useState(0), [position, setPosition] = useState({});
  const close = () => setOpen(false);
  const show = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true); };
  const choose = index => { onChange(options[index]); close(); trigger.current.focus({ preventScroll: true }); };
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const box = trigger.current.getBoundingClientRect(), height = Math.min(272, innerHeight - 32);
      const above = innerHeight - box.bottom < height + 12 && box.top > height;
      setPosition({ left: box.left, width: box.width, maxHeight: height, ...(above ? { bottom: innerHeight - box.top + 8 } : { top: box.bottom + 8 }) });
    };
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!trigger.current.contains(event.target) && !list.current?.contains(event.target)) close(); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => { if (open) list.current?.children[active]?.scrollIntoView({ block: 'nearest' }); }, [active, open]);
  const keys = event => {
    const key = event.key;
    if (key === 'Tab') { close(); return; }
    if (key === 'Escape') { event.preventDefault(); close(); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      if (!open) { show(); if (key === 'End') setActive(options.length - 1); return; }
      setActive(i => key === 'Home' ? 0 : key === 'End' ? options.length - 1 : (i + (key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault(); if (open) choose(active); else show();
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); const now = Date.now();
      search.current.text = (now - search.current.time < 650 ? search.current.text : '') + key.toLocaleLowerCase('pt-BR'); search.current.time = now;
      const match = options.findIndex(option => t(option).toLocaleLowerCase().startsWith(search.current.text));
      if (!open) setOpen(true); if (match >= 0) setActive(match);
    }
  };
  return localize(<>
    <input type="hidden" name="subject" value={value}/>
    <button ref={trigger} type="button" id="contact-subject" className={s.trigger} role="combobox" aria-labelledby="subject-label" aria-expanded={open} aria-haspopup="listbox" aria-controls="subject-options" aria-activedescendant={open ? `subject-option-${active}` : undefined} aria-required="true" aria-invalid={invalid} aria-describedby={describedBy} data-placeholder={!value} onKeyDown={keys} onBlur={close} onClick={() => open ? close() : show()}><span>{value || 'Escolha um assunto'}</span><ChevronDown size={18}/></button>
    {open && createPortal(<div ref={list} id="subject-options" role="listbox" aria-labelledby="subject-label" className={s.options} style={position} onPointerDown={e => e.preventDefault()}>{options.map((option, i) => localize(<div key={option} id={`subject-option-${i}`} role="option" aria-selected={value === option} data-active={i === active} className={s.option} onPointerMove={() => setActive(i)} onClick={() => choose(i)}><span>{option}</span>{value === option && <Check size={17}/>}</div>))}</div>, document.body)}
  </>);
}
