import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './global.css';
import { useLanguage, setLanguage } from './i18n';
import LanguageIntro from './LanguageIntro';

const mobileQuery=window.matchMedia('(max-width: 899px)');
const subscribeMobile=callback=>{mobileQuery.addEventListener('change',callback);return()=>mobileQuery.removeEventListener('change',callback);};
function LocalizedApp(){
 const language=useLanguage();
 const mobile=useSyncExternalStore(subscribeMobile,()=>mobileQuery.matches,()=>false);
 const [chosen,setChosen]=useState(()=>{try{return !!sessionStorage.getItem('portfolio-language-chosen');}catch{return false;}});
 useEffect(()=>{const reopen=()=>{const url=new URL(location.href);url.hash='';history.replaceState(null,'',url);setChosen(false);window.scrollTo({top:0,behavior:'instant'});};window.addEventListener('portfolio:language',reopen);return()=>window.removeEventListener('portfolio:language',reopen);},[]);
 const choose=code=>{try{sessionStorage.setItem('portfolio-language-chosen',code);localStorage.setItem('portfolio-language',code);}catch{}setLanguage(code,{restart:false});const url=new URL(location.href);url.searchParams.set('lang',code);history.replaceState(null,'',url);setChosen(true);};
 return mobile&&!chosen?<LanguageIntro onChoose={choose}/>:<App key={language}/>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><LocalizedApp /></React.StrictMode>);
