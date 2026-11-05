import { Children, cloneElement, isValidElement, useSyncExternalStore } from 'react';
import { messages } from './locales/en';
import { dataMessages } from './locales/en-data';
import { extraMessages } from './locales/en-extra';
import { projects, chapters } from './data/portfolio';
import { certificates } from './data/certificates';

const dictionary={...messages,...dataMessages,...extraMessages};
const english=text=>dictionary[text]??text;
for(const c of chapters){
 dictionary[`${c.text} ${c.proof}`]=`${english(c.text)} ${english(c.proof)}`;
 dictionary[`Ampliar imagem de ${c.organization}`]=`Enlarge image of ${english(c.organization)}`;
 dictionary[`Ampliar imagem: ${c.caption}`]=`Enlarge image: ${english(c.caption)}`;
 if(c.client)dictionary[`Logo de ${c.client}`]=`${c.client} logo`;
}
for(const p of projects){
 dictionary[`${p.imageType}, ${p.summary}`]=`${english(p.imageType)}, ${english(p.summary)}`;
 dictionary[`${p.imageType}: ${p.name}`]=`${english(p.imageType)}: ${english(p.name)}`;
 dictionary[`Ampliar imagem: ${p.name}`]=`Enlarge image: ${english(p.name)}`;
 dictionary[`GitHub de ${p.name}${p.private?' (repositório privado)':''}`]=`${english(p.name)} on GitHub${p.private?' (private repository)':''}`;
 dictionary[`Acessar ${p.name}`]=`Visit ${english(p.name)}`;
}
for(const c of certificates){
 dictionary[`Ampliar certificado: ${c.title}`]=`Enlarge certificate: ${english(c.title)}`;
 dictionary[`Certificado de Arthur Moury: ${c.title}`]=`Arthur Moury’s certificate: ${english(c.title)}`;
}
for(const label of ['IA, nuvem e experiências','Programação e dados']){
 dictionary[`Certificados: ${label}`]=`Certificates: ${english(label)}`;
 dictionary[`Certificados: ${english(label)}`]=`Certificates: ${english(label)}`;
}
const normalized=Object.fromEntries(Object.entries(dictionary).map(([key,value])=>[key.replace(/\s+/g,' ').trim(),value]));
let language='pt';
try{
 const requested=new URLSearchParams(window.location.search).get('lang');
 language=requested==='en'||(requested!=='pt'&&localStorage.getItem('portfolio-language')==='en')?'en':'pt';
 if(requested==='pt'||requested==='en')localStorage.setItem('portfolio-language',requested);
}catch{}
const listeners=new Set();
function updateDocument(){
 document.documentElement.lang=language==='en'?'en':'pt-BR';
 document.title=language==='en'?'Arthur Moury | Portfolio':'Arthur Moury | Portfólio';
 const description=language==='en'?'Arthur Moury’s portfolio. Software development, AI, automation and the projects behind my journey.':'Portfólio de Arthur Moury. Desenvolvimento, IA, automação e os projetos da minha trajetória.';
 for(const selector of ['meta[name="description"]','meta[property="og:description"]'])document.querySelector(selector)?.setAttribute('content',description);
 document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
}
updateDocument();
export function setLanguage(next){
 if(next!== 'pt'&&next!=='en'||next===language)return;
 language=next;
 try{localStorage.setItem('portfolio-language',next);}catch{}
 const url=new URL(location.href);url.searchParams.set('lang',next);url.hash='';history.replaceState(null,'',url);
 updateDocument();listeners.forEach(fn=>fn());
 requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.getElementById(`language-${next}`)?.focus({preventScroll:true});}));
}
export function useLanguage(){return useSyncExternalStore(callback=>{listeners.add(callback);return()=>listeners.delete(callback);},()=>language,()=> 'pt');}
export function t(value){
 if(language!=='en'||typeof value!=='string'||!value.trim())return value;
 const key=value.replace(/\s+/g,' ').trim();
 if(!(key in normalized))return value;
 return value.slice(0,value.length-value.trimStart().length)+normalized[key]+value.slice(value.trimEnd().length);
}
const textProps=['aria-label','aria-roledescription','alt','title','placeholder','text','label'];
// Translate React text and accessible labels before rendering, without mutating the DOM,
// user input, links, identifiers or the data used by application logic.
export function localize(node){
 if(typeof node==='string')return t(node);
 if(Array.isArray(node))return Children.map(node,localize);
 if(!isValidElement(node))return node;
 const props={};
 for(const key of textProps)if(typeof node.props[key]==='string')props[key]=t(node.props[key]);
 if(node.props.children!==undefined)props.children=localize(node.props.children);
 return cloneElement(node,props);
}
