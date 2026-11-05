import { Globe2 } from 'lucide-react';
import { useLanguage, setLanguage } from './i18n';
import s from './LanguageSwitch.module.css';
export default function LanguageSwitch(){
 const language=useLanguage();
 return <div className={s.switcher} role="group" aria-label={language==='en'?'Site language':'Idioma do site'}><Globe2 size={16} aria-hidden="true"/>{[['pt','PT','Português'],['en','EN','English']].map(([code,label,name])=><button id={`language-${code}`} key={code} type="button" lang={code==='pt'?'pt-BR':'en'} aria-label={name} aria-pressed={language===code} onClick={()=>setLanguage(code)}>{label}</button>)}</div>;
}
