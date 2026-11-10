import { ArrowUpRight } from 'lucide-react';
import s from './LanguageSwitch.module.css';
export default function LanguageIntro({ onChoose }) {
  return <main className={s.intro} data-language-intro data-reduced-motion={new URLSearchParams(location.search).get('motion')==='reduce'} aria-labelledby="language-title">
    <div className={s.orbit} aria-hidden="true"><i/><i/><i/></div>
    <div className={s.introContent}>
      <span className={s.signature}>Arthur Moury</span>
      <h1 id="language-title" lang="pt-BR">Escolha seu<br/>idioma.<em lang="en">Choose your language.</em></h1>
      <div className={s.choices}>
        <button type="button" lang="pt-BR" onClick={()=>onChoose('pt')}><small>PT</small><span>Português</span><ArrowUpRight size={22}/></button>
        <button type="button" lang="en" onClick={()=>onChoose('en')}><small>EN</small><span>English</span><ArrowUpRight size={22}/></button>
      </div>
    </div>
  </main>;
}
