import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, X, FileText, Database, FolderOpen, Calculator, RefreshCw, Layers, MessageSquare, SlidersHorizontal, GitCommitHorizontal, ScanLine } from 'lucide-react';
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
  ['Definir o comportamento','Entender a necessidade e os limites da mudança.'],
  ['Verificar a consistência','Conferir cálculos, agregações e comparações.'],
  ['Publicar a evolução','Integrar a mudança à ferramenta em uso.'],
  ['Acompanhar a operação','Observar o uso e orientar os próximos ajustes.'],
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
    <div className={s.container}>
      <header className={s.intro} data-work-reveal><span className={s.kicker}>IDEIAS, SISTEMAS, PESSOAS</span><h2 id="practice-title">O trabalho<br/><em>por dentro.</em></h2><p>Como uso IA, desenvolvimento e automação para transformar uma necessidade em algo que funciona.</p></header>

      <article className={`${s.chapter} ${s.promptChapter}`} aria-labelledby="prompt-title">
        <div className={s.story} data-work-reveal><span className={s.category}>Prompts & LLMs</span><h3 id="prompt-title">Dar contexto.<br/>Pedir evidências.<br/><em>Questionar a resposta.</em></h3><p>Uma boa instrução define o problema e também os limites da resposta. Neste exemplo, a IA recebe relatos de usuários e precisa recomendar uma melhoria sem inventar números.</p><div className={s.principles}><span>Contexto delimitado</span><span>Fontes identificadas</span><span>Critério de validação</span></div><button className={s.textButton} onClick={()=>setExpanded(true)}>Ler o prompt completo<ArrowUpRight size={18}/></button><small>Exemplo fictício criado para este portfólio.</small></div>
        <div className={s.promptComposition} data-work-reveal>
          <div className={s.document}><div className={s.documentHeader}><span><FileText size={17}/>Uma decisão de produto</span><button onClick={copy} aria-label="Copiar prompt de exemplo">{copied===true?<Check size={17}/>:<Copy size={17}/>}<span>{copied===true?'Copiado':'Copiar'}</span></button></div><div className={s.documentBody} role="region" aria-label="Prompt completo de exemplo" tabIndex={0}><PromptDocument/></div><div className={s.documentFooter} aria-live="polite">{copied==='error'?'Selecione o texto para copiar.':'Cinco blocos para uma decisão verificável.'}</div></div>
          <aside className={s.evidence}><span className={s.evidenceMark} aria-hidden="true">↳</span><div><span>O que observar na resposta</span><p>A recomendação cita os relatos? Expõe o que falta saber? Propõe um teste que alguém consegue executar?</p></div></aside>
        </div>
      </article>

      <article className={`${s.chapter} ${s.automationChapter}`} aria-labelledby="automation-title">
        <div className={s.operationVisual} data-operation-flow data-work-reveal>
          <div className={s.operationTop}><span>ENTRADA</span><span>TRATAMENTO</span><span>DESTINO</span></div>
          <div className={s.operations}>{operations.map(({icon:Icon,name,result})=><div className={s.operation} data-operation key={name}><div className={s.source}><Icon size={20}/><span>{name}</span></div><span className={s.transfer} aria-hidden="true"><i/><b/></span><div className={s.destination}><Check size={16}/><span>{result}</span></div></div>)}</div>
          <div className={s.operationBottom}><span>Processos manuais conectados</span><Layers size={20}/><span>Uma rotina que continua</span></div>
        </div>
        <div className={s.story} data-work-reveal><span className={s.category}>Automações</span><h3 id="automation-title">Menos etapas<br/>para fazer<br/><em>à mão.</em></h3><p>Extraio dados, organizo arquivos, automatizo atualizações de status e conecto cálculos a outros processos. O objetivo é fazer a informação circular entre as ferramentas da operação.</p><p className={s.footnote}>Na Boop, trabalhei com n8n, Make, Zapier e dados no CRM Go High Level. Hoje, continuo explorando automações e integrações na Roomi.</p><div className={s.tools}><span>n8n</span><span>Make</span><span>Zapier</span><span>APIs</span></div></div>
      </article>

      <article className={`${s.chapter} ${s.toolsChapter}`} aria-labelledby="tools-title">
        <div className={s.story} data-work-reveal><span className={s.category}>Ferramentas internas</span><h3 id="tools-title">Um contexto.<br/><em>Duas formas<br/>de consultar.</em></h3><p>Na evolução do dashboard da Roomi, indicadores e copiloto precisam trabalhar com o mesmo recorte de dados. A pergunta feita à IA deve respeitar os filtros que estão no painel.</p><div className={s.fact}><ScanLine size={22}/><p><strong>7 verificações de regressão</strong><span>Agregação, comparação e limites de acesso.</span></p></div></div>
        <div className={s.contextVisual} data-shared-context data-work-reveal>
          <div className={s.contextSource}><Database size={22}/><div><span>CONTEXTO COMPARTILHADO</span><strong>Dados do filtro ativo</strong></div><SlidersHorizontal size={19}/></div>
          <svg className={s.connections} viewBox="0 0 600 110" preserveAspectRatio="none" aria-hidden="true"><path d="M300 0V40Q300 60 280 60H170Q150 60 150 80V110"/><path d="M300 0V40Q300 60 320 60H430Q450 60 450 80V110"/><path data-connection pathLength="1" d="M300 0V40Q300 60 280 60H170Q150 60 150 80V110"/><path data-connection pathLength="1" d="M300 0V40Q300 60 320 60H430Q450 60 450 80V110"/></svg>
          <div className={s.contextOutputs}><div><Layers size={21}/><h4>No painel</h4><p>Indicadores e comparações.</p><span data-context-tag>Mesmo período</span></div><div><MessageSquare size={21}/><h4>Na conversa</h4><p>Perguntas sobre os dados.</p><span data-context-tag>Mesmo recorte</span></div></div><p className={s.contextCaption}>Conferir a resposta faz parte da construção.</p>
        </div>
      </article>

      <article className={`${s.chapter} ${s.releaseChapter}`} aria-labelledby="release-title">
        <div className={s.story} data-work-reveal><span className={s.category}>Em produção</span><h3 id="release-title">Publicar é<br/><em>continuar.</em></h3><p>Uma ferramenta em uso exige cuidado depois do deploy. Acompanho funcionalidades, validações e ajustes que mantêm a operação consistente.</p><div className={s.releaseExample}><span>UMA EVOLUÇÃO NA ROOMI</span><p>Horizonte de previsão diária ampliado para <strong>90 dias</strong>, com intervalos de confiança e verificações de consistência.</p></div></div>
        <div className={s.releaseVisual} data-release data-work-reveal><div className={s.releaseHeader}><GitCommitHorizontal size={22}/><span>O que acompanha uma entrega</span></div><div className={s.releaseSteps}><i className={s.releaseLine} data-release-line aria-hidden="true"/>{releases.map(([title,text],i)=><div key={title} className={s.releaseStep} data-release-step><span className={s.releaseDot} aria-hidden="true"/><span className={s.releaseIndex}>{String(i+1).padStart(2,'0')}</span><div><h4>{title}</h4><p>{text}</p></div></div>)}</div><p className={s.releaseClosing}>O uso real orienta a próxima versão.</p></div>
      </article>
    </div>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="prompt-dialog-title" onKeyDown={focus} onCancel={e=>{e.preventDefault();setExpanded(false);}} onClick={e=>{if(e.target===e.currentTarget)setExpanded(false);}}><div className={s.dialogHeader}><div><span>EXEMPLO DE PROMPT</span><h2 id="prompt-dialog-title">Uma decisão de produto</h2></div><button autoFocus aria-label="Fechar prompt" onClick={()=>setExpanded(false)}><X/></button></div><div className={s.dialogContent}><p className={s.dialogIntro}>Cenário fictício. Você pode copiar a instrução completa e experimentar em um LLM.</p><PromptDocument/><button className={s.copyButton} onClick={copy}>{copied===true?<Check size={18}/>:<Copy size={18}/>} {copied===true?'Prompt copiado':'Copiar prompt completo'}</button><span className={s.copyStatus} aria-live="polite">{copied==='error'?'Não foi possível copiar. Selecione o texto acima.':''}</span></div></dialog>
  </section>;
}
