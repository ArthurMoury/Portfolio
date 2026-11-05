import { Fragment } from 'react';
import s from './TextReveal.module.css';

export default function TextReveal({ text }) {
  return <span className={s.text} data-text-reveal>{text.split(/(\s+)/).map((part,i)=>/\s/.test(part)?<Fragment key={i}>{part}</Fragment>:<span className={s.word} data-reveal-word key={i}>{part}</span>)}</span>;
}
