import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check, ArrowRight, Pause, Play, X } from 'lucide-react';
import s from './PracticeLab.module.css';

const cases = [
  { tab:'Prompts & LLMs', title:'Primeiro, explique o problema.', text:'Exemplo fictício: planejar a automação dos pedidos de uma loja.', stack:'Contexto · Objetivo · Critérios · Formato da resposta' },
  { tab:'Automações', title:'Menos operações manuais. Mais tempo para resolver.', text:'Extração de dados, fluxos de manuseio de arquivos, atualização de status, processos manuais e cálculos matemáticos. Conecto essas etapas em rotinas que tratam a informação e mantêm as bases organizadas.', stack:'Node.js · Playwright · n8n · Make · APIs' },
  { tab:'Ferramentas internas', title:'Dados e contexto na mesma conversa.', text:'Atuação na evolução do dashboard interno da Roomi: indicadores de operação, comparação entre períodos e um copiloto que consulta os dados do filtro ativo. As validações verificam se os números do chat correspondem aos do painel.', stack:'JavaScript · APIs · Dashboards · Validação de dados' },
  { tab:'Em produção', title:'A entrega continua depois do deploy.', text:'No dashboard da Roomi, acompanho a evolução de funcionalidades em produção e suas validações. Um exemplo é a ampliação do horizonte de previsão diária para 90 dias, com intervalos de confiança e verificações de consistência.', stack:'Previsão diária · Monitoramento · QA · Integração de dados' },
];
const prompt = [
  ['Contexto','Cuido dos pedidos de uma loja pequena. As solicitações chegam pelo WhatsApp, alguém copia os dados para uma planilha e outra pessoa atualiza o status. Às vezes um pedido se perde ou entra duas vezes.'],
  ['O que preciso','Quero reduzir esse retrabalho sem trocar todas as ferramentas de uma vez. Me ajude a desenhar uma primeira automação simples, que uma equipe pequena consiga manter.'],
  ['Cuidados','Antes de propor uma solução, faça até três perguntas que realmente mudariam sua recomendação. Depois, separe o que vale automatizar agora do que deve continuar com uma pessoa. Aponte riscos de duplicidade, falhas e exposição de dados. Se precisar assumir algo, diga o quê e como isso afeta a proposta.'],
  ['Como responder','Descreva o fluxo em até seis passos, do pedido recebido à confirmação. Compare duas formas de implementar isso pelo esforço de implantação e manutenção, indique qual você escolheria e termine com um teste pequeno para validar a ideia. Prefira uma explicação direta e explique os termos técnicos que precisar usar.'],
];

const summaries=[
  'Um prompt de exemplo para sair de uma rotina confusa e chegar a um plano que dê para testar.',
  'Dados, arquivos, status e cálculos conectados em rotinas de trabalho.',
  'O mesmo filtro e os mesmos números no painel e na conversa com a IA.',
  'Previsões, acompanhamento e validações que continuam depois da entrega.',
];
const automation=['Extração de dados','Manuseio de arquivos','Atualização de status','Processos manuais','Cálculos matemáticos','Integração de sistemas'];
gsap.registerPlugin(ScrollTrigger);

export default function PracticeLab({ reduced }) {
  const root=useRef(null), inner=useRef(null), timeline=useRef(null), modeRef=useRef('scroll'), visible=useRef(false), phase=useRef(0), modalRef=useRef(null), dialog=useRef(null);
  const [active,setActive]=useState(0), [mode,setMode]=useState('scroll'), [copied,setCopied]=useState(false), [modal,setModal]=useState(null);
  modalRef.current=modal;
  const item=cases[active];
  const changeMode=value=>{modeRef.current=value;setMode(value);};
  useEffect(()=>{
    if(reduced){changeMode('paused');return;}
    changeMode('scroll');
    const node=root.current, path=node.querySelector('[data-flow-path]'), fill=node.querySelector('[data-flow-fill]'), capsule=node.querySelector('[data-flow-capsule]');
    const length=path.getTotalLength(), driver={value:0};
    fill.style.strokeDasharray=length;
    const draw=()=>{
      const value=driver.value, index=Math.min(3,Math.floor(value*4)), local=Math.min(1,value*4-index);
      node.style.setProperty('--story-progress',value);node.style.setProperty('--phase-progress',local);
      fill.style.strokeDashoffset=length*(1-value);
      const point=path.getPointAtLength(length*value);capsule.setAttribute('transform',`translate(${point.x} ${point.y})`);
      node.querySelectorAll('[data-flow-node]').forEach((n,i)=>{n.dataset.reached=String(value>=i/3);});
      const count=node.querySelector('[data-practice-count]');if(count)count.textContent=String(Math.min(7,Math.ceil(local*7)));
      if(index!==phase.current){phase.current=index;setActive(index);setCopied(false);}
    };
    const animation=gsap.timeline({paused:true,onUpdate:draw,onComplete:()=>{if(modeRef.current==='play')changeMode('paused');}});
    animation.to(driver,{value:.25,duration:6,ease:'none'}).to(driver,{value:.5,duration:6,ease:'none'}).to(driver,{value:.75,duration:6,ease:'none'}).to(driver,{value:1,duration:6,ease:'none'});
    timeline.current=animation;draw();
    const trigger=ScrollTrigger.create({trigger:node,start:()=>`top ${parseFloat(getComputedStyle(inner.current).top)||118}px`,end:'bottom bottom',onUpdate:self=>{if(modeRef.current==='scroll'&&modalRef.current===null)animation.progress(self.progress);}});
    const sync=()=>{if(modeRef.current==='play'){if(visible.current&&!document.hidden&&modalRef.current===null)animation.play();else animation.pause();}};
    const observer=new IntersectionObserver(([entry])=>{visible.current=entry.isIntersecting;sync();});observer.observe(node);
    document.addEventListener('visibilitychange',sync);
    return()=>{trigger.kill();animation.kill();timeline.current=null;observer.disconnect();document.removeEventListener('visibilitychange',sync);};
  },[reduced]);
  useEffect(()=>{
    if(modal===null)return;
    timeline.current?.pause();
    const previous=document.activeElement, old=document.body.style.overflow, node=dialog.current;
    document.body.style.overflow='hidden';node.showModal();
    return()=>{node.close();document.body.style.overflow=old;previous?.focus({preventScroll:true});if(modeRef.current==='play'&&visible.current&&!document.hidden)timeline.current?.play();};
  },[modal]);
  const pause=()=>{changeMode('paused');timeline.current?.pause();};
  const play=()=>{changeMode('play');if(timeline.current?.progress()>=.999)timeline.current.progress(0);timeline.current?.play();};
  const seek=index=>{
    pause();phase.current=index;setActive(index);setCopied(false);
    timeline.current?.progress((index+.05)/4);
    if(reduced)root.current.style.setProperty('--phase-progress',1);
  };
  const copy=async()=>{try{await navigator.clipboard.writeText(prompt.map(([label,text])=>`${label}: ${text}`).join('\n\n'));setCopied(true);}catch{setCopied('error');}};
  const containFocus=e=>{
    if(e.key!=='Tab')return;
    const items=[...dialog.current.querySelectorAll('button,a[href]')],first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  return <section ref={root} id="processo" className={s.lab} data-context="trabalho" data-reduced={reduced} data-mode={mode} aria-labelledby="practice-title">
    <div ref={inner} className={s.inner}>
      <div className={s.heading}><h2 id="practice-title">Da integração<br className={s.mobileBreak}/> à entrega.</h2><div className={s.controls} aria-label="Controles da animação"><button onClick={pause} disabled={reduced||mode==='paused'} aria-label="Pausar animação"><Pause size={17}/><span>Pausar</span></button><button onClick={play} disabled={reduced||mode==='play'} aria-label="Reproduzir animação"><Play size={17}/><span>Reproduzir</span></button></div></div>
      <nav className={s.phases} aria-label="Aplicações de IA e automação">{cases.map((c,i)=><button key={c.tab} onClick={()=>seek(i)} aria-current={active===i?'step':undefined}><span>{String(i+1).padStart(2,'0')}</span>{c.tab}</button>)}</nav>
      <div className={s.circuit} aria-hidden="true"><svg viewBox="0 0 900 170"><path data-flow-path className={s.route} d="M60 85C145 -20 235 190 320 85S495 -20 580 85S755 190 840 85"/><path data-flow-fill className={s.routeFill} d="M60 85C145 -20 235 190 320 85S495 -20 580 85S755 190 840 85"/>{[60,320,580,840].map((x,i)=><g key={x} data-flow-node transform={`translate(${x} 85)`} className={s.node}><circle r="22"/><text y="5" textAnchor="middle">{i+1}</text></g>)}<g data-flow-capsule className={s.capsule} transform="translate(60 85)"><rect x="-12" y="-6" width="24" height="12" rx="6"/></g></svg></div>
      <div id="practice-panel" className={s.panel} data-phase={active}>
        <div key={`copy-${active}`} className={s.copy}><h3>{item.title}</h3><p>{summaries[active]}</p><div className={s.stack}>{item.stack}</div><button className={s.detailLink} onClick={()=>setModal(active)}>{active===0?'Ver prompt completo':'Ver contexto'}<ArrowRight size={16}/></button></div>
        <div key={`visual-${active}`} className={s.visual}>
          {active===0&&<div className={s.promptPreview}><div className={s.visualTitle}><span>Prompt de exemplo</span><button onClick={copy} aria-label="Copiar exemplo de prompt">{copied===true?<Check size={17}/>:<Copy size={17}/>} {copied===true?'Copiado':'Copiar'}</button></div><div className={s.promptText} role="region" aria-label="Prompt de exemplo completo" tabIndex={0}><dl>{prompt.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></div><small aria-live="polite">{copied==='error'?'Selecione o texto acima para copiar.':'Cenário fictício · automação de pedidos.'}</small></div>}
          {active===1&&<ol className={s.automation}>{automation.map((label,i)=><li key={label} style={{'--order':i}}><span>{String(i+1).padStart(2,'0')}</span>{label}<Check size={15}/></li>)}</ol>}
          {active===2&&<div className={s.validation}><div><span>Filtro ativo</span><i/></div><div><span>Total do painel</span><i/></div><p><strong data-practice-count>7</strong><span>verificações de regressão.<small>Agregação, comparação e limites de acesso.</small></span></p></div>}
          {active===3&&<div className={s.production}><p><strong>90</strong><span>dias no horizonte<br/>de previsão diária.</span></p><div className={s.horizon} aria-hidden="true">{Array.from({length:90},(_,i)=><i key={i} style={{'--day':i}}/>)}</div><small>Funcionalidade em produção desde outubro de 2026.</small></div>}
        </div>
      </div>
    </div>
    <dialog ref={dialog} className={s.dialog} aria-labelledby="practice-dialog-title" onKeyDown={containFocus} onCancel={e=>{e.preventDefault();setModal(null);}} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>{modal!==null&&<div><header><h2 id="practice-dialog-title">{modal===0?'Exemplo de prompt':cases[modal].title}</h2><button autoFocus onClick={()=>setModal(null)} aria-label="Fechar detalhes"><X/></button></header><p>{cases[modal].text}</p>{modal===0?<><button className={s.copyPrompt} onClick={copy}>{copied===true?<Check size={17}/>:<Copy size={17}/>} {copied===true?'Prompt copiado':'Copiar prompt completo'}</button><dl>{prompt.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl></>:<p className={s.stack}>{cases[modal].stack}</p>}</div>}</dialog>
  </section>;
}
