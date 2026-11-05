import { Fragment } from 'react';
import s from './TextReveal.module.css';

// Words keep their natural wrapping; the masks don't alter the reading order.
export default function TextReveal({ text, curtain = false }) {
  return <span className={s.text} data-text-reveal>
    {text.split(/(\s+)/).map((part, i) => /\s/.test(part)
      ? <Fragment key={i}>{part}</Fragment>
      : <span className={s.mask} key={i}><span data-reveal-word>{part}</span></span>)}
    {curtain && <span className={s.curtain} aria-hidden="true">{[0, 1, 2].map(i => <i data-text-shutter key={i}/>)}</span>}
  </span>;
}
