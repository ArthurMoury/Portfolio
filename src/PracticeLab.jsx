import { useRef, useState } from 'react';
import { Copy, Check, ArrowRight, Braces, Database, ShieldCheck } from 'lucide-react';
import s from './PracticeLab.module.css';

const cases = [
  { tab:'Prompts & LLMs', title:'Uma resposta precisa começar com evidência.', text:'No copiloto analítico da Roomi, perguntas em linguagem natural se conectam a ferramentas de consulta. O trabalho inclui testar escopo, consistência dos cálculos e respostas quando a informação não existe.', stack:'LLMs · Tool calling · JavaScript · Testes de regressão' },
  { tab:'Automações', title:'Da exportação à base atualizada, em um acionamento.', text:'Automação de reservas que consulta a semana anterior, exporta o CSV, transforma estadias em diárias e atualiza a base no Google Drive. A deduplicação evita repetir reservas, e o histórico de versões do arquivo é preservado.', stack:'Node.js · Playwright · CSV · Google Drive API' },
  { tab:'Ferramentas internas', title:'Dados e contexto na mesma conversa.', text:'Atuação na evolução do dashboard interno da Roomi: indicadores de operação, comparação entre períodos e um copiloto que consulta os dados do filtro ativo. As validações verificam se os números do chat correspondem aos do painel.', stack:'JavaScript · APIs · Dashboards · Validação de dados' },
  { tab:'Em produção', title:'A entrega continua depois do deploy.', text:'No dashboard da Roomi, acompanho a evolução de funcionalidades em produção e suas validações. Um exemplo é a ampliação do horizonte de previsão diária para 90 dias, com intervalos de confiança e verificações de consistência.', stack:'Previsão diária · Monitoramento · QA · Integração de dados' },
];
const prompt = [
  ['Contexto','Analise o período e os filtros selecionados no painel.'],
  ['Tarefa','Explique a variação do resultado entre os dois períodos.'],
  ['Limites','Consulte as ferramentas antes de responder. Não invente valores. Se faltar uma informação, diga qual.'],
  ['Formato','Apresente a variação, os fatores que a explicam e as evidências. Em previsões, inclua faixa e confiança.'],
];

export default function PracticeLab({ reduced }) {
  const [active,setActive]=useState(0), [copied,setCopied]=useState(false);
  const tabs=useRef([]);
  const item=cases[active];
  const select=index=>{setActive(index);setCopied(false);};
  const keyboard=(event,index)=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%cases.length;
    else if(event.key==='ArrowLeft')next=(index+cases.length-1)%cases.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=cases.length-1;
    else return;
    event.preventDefault();select(next);tabs.current[next]?.focus();
  };
  const copy=async()=>{
    try { await navigator.clipboard.writeText(prompt.map(([label,text])=>`${label}: ${text}`).join('\n\n'));setCopied(true); }
    catch { setCopied('error'); }
  };
  return <section id="processo" className={s.lab} data-context="trabalho" data-reduced={reduced} aria-labelledby="practice-title">
    <div className={s.inner}>
      <div className={s.heading}><h2 id="practice-title">Da integração<br/>à entrega.</h2><p>Além das interfaces, existe o trabalho de conectar dados, testar hipóteses e fazer a operação funcionar.</p></div>
      <div className={s.tabs} role="tablist" aria-label="Aplicações de IA e automação">{cases.map((c,i)=><button key={c.tab} id={`practice-tab-${i}`} ref={el=>{tabs.current[i]=el;}} role="tab" aria-selected={active===i} aria-controls="practice-panel" tabIndex={active===i?0:-1} onClick={()=>select(i)} onKeyDown={event=>keyboard(event,i)}>{c.tab}</button>)}</div>
      <div id="practice-panel" role="tabpanel" tabIndex={0} aria-labelledby={`practice-tab-${active}`} className={s.panel}>
        <div key={`copy-${active}`} className={s.copy}><h3>{item.title}</h3><p>{item.text}</p><div className={s.stack}>{item.stack}</div></div>
        <div key={`visual-${active}`} className={s.visual}>
          {active===0&&<div className={s.prompt}><div className={s.visualTitle}><span><Braces size={19}/>Exemplo de prompt</span><button onClick={copy} aria-label="Copiar exemplo de prompt">{copied===true?<Check size={17}/>:<Copy size={17}/>} {copied===true?'Copiado':'Copiar'}</button></div><dl>{prompt.map(([label,text])=><div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl><small aria-live="polite">{copied==='error'?'Selecione o texto para copiar.':'Exemplo adaptado, sem dados de clientes.'}</small></div>}
          {active===1&&<div className={s.automation}><div className={s.metric}><strong>6</strong><span>etapas conectadas.<br/>Um único acionamento.</span></div><ol>{['Consultar período','Exportar reservas','Transformar em diárias','Ler a base existente','Remover duplicatas','Atualizar no Drive'].map((label,i)=><li key={label}><span>{String(i+1).padStart(2,'0')}</span>{label}{i<5?<ArrowRight size={15}/>:<Check size={17}/>}</li>)}</ol><p>Mesma base. Nova versão. Histórico preservado.</p></div>}
          {active===2&&<div className={s.validation}><Database size={38} strokeWidth={1}/><h4>O painel e a IA<br/>precisam concordar.</h4><div className={s.validationRow}><span>Período consultado</span><span>Filtro ativo</span></div><div className={s.validationRow}><span>Total do painel</span><span>Total da ferramenta</span></div><div className={s.validationResult}><ShieldCheck size={23}/><p><strong>7 verificações de regressão</strong><span>Agregação, comparação e limites de acesso.</span></p></div></div>}
          {active===3&&<div className={s.production}><div className={s.metric}><strong>90</strong><span>dias no horizonte<br/>de previsão diária.</span></div><div className={s.horizon} aria-hidden="true">{Array.from({length:90},(_,i)=><i key={i} style={{'--day':i}}/>)}</div><div className={s.horizonLabels}><span>Hoje</span><span>+30 dias</span><span>+60 dias</span><span>+90 dias</span></div><p>Funcionalidade levada à produção em outubro de 2026.</p></div>}
        </div>
      </div>
    </div>
  </section>;
}
