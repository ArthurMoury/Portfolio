import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, X, FileText, Database, FolderOpen, Calculator, RefreshCw, Layers, MessageSquare, SlidersHorizontal, GitCommitHorizontal } from 'lucide-react';
import { examplePrompt } from './data/practice';
import s from './PracticeLab.module.css';

gsap.registerPlugin(ScrollTrigger);
const operations = [
  {icon:FileText, name:'Extração de dados', result:'Informação estruturada'},
  {icon:FolderOpen, name:'Manuseio de arquivos', result:'Arquivos organizados'},
  {icon:Calculator, name:'Cálculos matemáticos', result:'Valores processados'},
  {icon:RefreshCw, name:'Atualização de status', result:'Sistemas sincronizados'},
];
const releases = [
  ['Definir','Um problema claro.'],
  ['Testar','Uma mudança verificável.'],
  ['Publicar','Uma solução em uso.'],
  ['Evoluir','O próximo ajuste.'],
];

function PromptDocument(){return <dl className={s.promptText}>{examplePrompt.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>;}

export default function PracticeLab({ reduced }) {
  const root=useRef(null), dialog=useRef(null);
  const [expanded,setExpanded]=useState(false),[copied,setCopied]=useState(false);
  useEffect(()=>{
    if(reduced)return;
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root);
      q('[data-work-reveal]').forEach(el=>gsap.from(el,{y:32,opacity:.25,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'transform,opacity'}));
      const entrance=gsap.timeline({scrollTrigger:{trigger:root.current,start:'top 95%',end:'top 22%',scrub:.7}});
      entrance.fromTo(q('[data-work-shutter]'),{x:0,xPercent:0},{xPercent:i=>i%2?105:-105,stagger:.07,ease:'power2.inOut'},0)
        .fromTo(q('[data-work-title]'),{y:45,clipPath:'inset(0 0 100% 0)'},{y:0,clipPath:'inset(0 0 0% 0)',ease:'power3.out'},.2);
      const flow=q('[data-operation-flow]')[0];
      gsap.fromTo(q('[data-operation]'),{'--fill':0},{'--fill':1,stagger:.22,ease:'none',scrollTrigger:{trigger:flow,start:'top 85%',end:'bottom 50%',scrub:.6}});
      const context=q('[data-shared-context]')[0];
      gsap.fromTo(q('[data-connection]'),{strokeDashoffset:1},{strokeDashoffset:0,stagger:.25,ease:'none',scrollTrigger:{trigger:context,start:'top 85%',end:'bottom 50%',scrub:.6}});
      gsap.fromTo(q('[data-context-tag]'),{y:14,opacity:.7},{y:0,opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:context,start:'top 80%',end:'bottom 55%',scrub:.6}});
      const release=q('[data-release]')[0];
      gsap.fromTo(q('[data-release-line]'),{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:release,start:'top 75%',end:'bottom 65%',scrub:.6}});
      gsap.from(q('[data-release-step]'),{x:18,opacity:.7,stagger:.18,ease:'none',scrollTrigger:{trigger:release,start:'top 80%',end:'bottom 65%',scrub:.6}});
    },root);
    return()=>ctx.revert();
  },[reduced]);
  useEffect(()=>{
    if(!expanded)return;
    const previous=document.activeElement, old=document.body.style.overflow,node=dialog.current;
    document.body.style.overflow='hidden';node.showModal();
    return()=>{node.close();document.body.style.overflow=old;previous?.focus({preventScroll:true});};
  },[expanded]);
  const copy=async()=>{try{await navigator.clipboard.writeText(examplePrompt.map(([label,text])=>`${label}\n${text}`).join('\n\n'));setCopied(true);}catch{setCopied('error');}};
  const focus=e=>{
    if(e.key!=='Tab')return;
    const items=[...dialog.current.querySelectorAll('button')],first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  return <section ref={root} id="processo" className={s.lab} data-context="trabalho" data-reduced={reduced} aria-labelledby="practice-title">
    <div className={s.workEntrance} aria-hidden="true">{Array.from({length:5},(_,i)=><i key={i} data-work-shutter/>)}</div>
    <div className={s.container}>
      <header className={s.intro}><h2 id="practice-title" data-work-title>O trabalho<br/><em>por dentro.</em></h2></header>

      <article className={`${s.chapter} ${s.promptChapter}`} aria-labelledby="prompt-title">
        <div className={s.story} data-work-reveal><h3 id="prompt-title">A pergunta<br/><em>muda tudo.</em></h3><p>Contexto antes do comando. Evidência antes da resposta.</p><button className={s.textButton} onClick={()=>setExpanded(true)}>Ler o prompt completo<ArrowUpRight size={18}/></button></div>
        <div className={s.promptComposition} data-work-reveal>
          <div className={s.document}><div className={s.documentHeader}><span><FileText size={17}/>Uma decisão de produto</span><button onClick={copy} aria-label="Copiar prompt de exemplo">{copied===true?<Check size={17}/>:<Copy size={17}/>}<span>{copied===true?'Copiado':'Copiar'}</span></button></div><blockquote className={s.promptExcerpt}><span data-work-reveal>Me ajude a escolher a próxima melhoria de um produto.</span><span data-work-reveal>Quero uma recomendação pequena, bem justificada e que dê para testar.</span><span data-work-reveal>Separe o que foi observado do que ainda é hipótese. Se faltar evidência, diga o que precisa ser validado.</span></blockquote><div className={s.documentFooter} aria-live="polite">{copied==='error'?'Selecione o texto no prompt completo para copiar.':'Contexto / Evidências / Critérios / Entrega'}</div></div>
        </div>
      </article>

      <article className={`${s.chapter} ${s.automationChapter}`} aria-labelledby="automation-title">
        <div className={s.operationVisual} data-operation-flow data-work-reveal>
          <div className={s.operationTop}><span>ENTRADA</span><span>TRATAMENTO</span><span>DESTINO</span></div>
          <div className={s.operations}>{operations.map(({icon:Icon,name,result})=><div className={s.operation} data-operation key={name}><div className={s.source}><Icon size={20}/><span>{name}</span></div><span className={s.transfer} aria-hidden="true"><i/><b/></span><div className={s.destination}><Check size={16}/><span>{result}</span></div></div>)}</div>
          <div className={s.operationBottom}><span>Processos manuais conectados</span><Layers size={20}/><span>Uma rotina que continua</span></div>
        </div>
        <div className={s.story} data-work-reveal><h3 id="automation-title">Repetir menos.<br/><em>Criar mais.</em></h3><p>Dados, arquivos, cálculos e status conectados. Da rotina manual ao fluxo que funciona.</p><div className={s.tools}><span>n8n</span><span>Make</span><span>Zapier</span><span>APIs</span></div></div>
      </article>

      <article className={`${s.chapter} ${s.toolsChapter}`} aria-labelledby="tools-title">
        <div className={s.story} data-work-reveal><h3 id="tools-title">O dado é um só.<br/><em>A conversa<br/>vai além.</em></h3><p>Na Roomi, painel e copiloto consultam o mesmo recorte. Uma pergunta, com o contexto certo.</p><div className={s.fact}><strong>7</strong><span>verificações de regressão</span></div></div>
        <div className={s.contextVisual} data-shared-context data-work-reveal>
          <div className={s.contextSource}><Database size={22}/><div><span>CONTEXTO COMPARTILHADO</span><strong>Dados do filtro ativo</strong></div><SlidersHorizontal size={19}/></div>
          <svg className={s.connections} viewBox="0 0 600 110" preserveAspectRatio="none" aria-hidden="true"><path d="M300 0V40Q300 60 280 60H170Q150 60 150 80V110"/><path d="M300 0V40Q300 60 320 60H430Q450 60 450 80V110"/><path data-connection pathLength="1" d="M300 0V40Q300 60 280 60H170Q150 60 150 80V110"/><path data-connection pathLength="1" d="M300 0V40Q300 60 320 60H430Q450 60 450 80V110"/></svg>
          <div className={s.contextOutputs}><div><Layers size={21}/><h4>No painel</h4><p>Indicadores e comparações.</p><span data-context-tag>Mesmo período</span></div><div><MessageSquare size={21}/><h4>Na conversa</h4><p>Perguntas sobre os dados.</p><span data-context-tag>Mesmo recorte</span></div></div>
        </div>
      </article>

      <article className={`${s.chapter} ${s.releaseChapter}`} aria-labelledby="release-title">
        <div className={s.story} data-work-reveal><h3 id="release-title">No ar.<br/><em>Em evolução.</em></h3><p>Na Roomi, ampliei a previsão diária para 90 dias, com intervalos de confiança e validações.</p><div className={s.forecast}><strong>90</strong><span>dias de horizonte</span><svg viewBox="0 0 300 50" aria-hidden="true"><path d="M0 45C50 42 60 18 110 28S190 2 230 15S270 5 300 2"/></svg></div></div>
        <div className={s.releaseVisual} data-release data-work-reveal><div className={s.releaseHeader}><GitCommitHorizontal size={22}/><span>O que acompanha uma entrega</span></div><div className={s.releaseSteps}><i className={s.releaseLine} data-release-line aria-hidden="true"/>{releases.map(([title,text],i)=><div key={title} className={s.releaseStep} data-release-step><span className={s.releaseDot} aria-hidden="true"/><span className={s.releaseIndex}>{String(i+1).padStart(2,'0')}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}</div></div>
      </article>
    </div>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="prompt-dialog-title" onKeyDown={focus} onCancel={e=>{e.preventDefault();setExpanded(false);}} onClick={e=>{if(e.target===e.currentTarget)setExpanded(false);}}><div className={s.dialogHeader}><div><span>EXEMPLO DE PROMPT</span><h2 id="prompt-dialog-title">Uma decisão de produto</h2></div><button autoFocus aria-label="Fechar prompt" onClick={()=>setExpanded(false)}><X/></button></div><div className={s.dialogContent}><p className={s.dialogIntro}>Cenário fictício. Você pode copiar a instrução completa e experimentar em um LLM.</p><PromptDocument/><button className={s.copyButton} onClick={copy}>{copied===true?<Check size={18}/>:<Copy size={18}/>} {copied===true?'Prompt copiado':'Copiar prompt completo'}</button><span className={s.copyStatus} aria-live="polite">{copied==='error'?'Não foi possível copiar. Selecione o texto acima.':''}</span></div></dialog>
  </section>;
}
