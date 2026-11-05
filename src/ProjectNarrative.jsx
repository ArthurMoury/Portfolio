import { localize } from './i18n';
import { useEffect } from 'react';
import { useAnimate, useInView, stagger } from 'motion/react';
import TextReveal from './TextReveal';
import s from './App.module.css';

function useAssembly(open,reduced,kind){
  const [scope,animate]=useAnimate();
  const visible=useInView(scope,{amount:.2});
  useEffect(()=>{
    if(!open||!visible||reduced)return;
    const animations=[];
    if(kind==='copy'){
      animations.push(animate('[data-reveal-word]',{x:[18,0],opacity:[0,1]},{duration:.62,delay:stagger(.012,{from:'center'}),ease:[.16,1,.3,1]}));
    }else{
      animations.push(animate('dt',{x:[-18,0],opacity:[0,1]},{duration:.48,ease:[.22,1,.36,1]}));
      animations.push(animate('dd',{x:[24,0],opacity:[0,1]},{duration:.6,delay:.09,ease:[.22,1,.36,1]}));
      animations.push(animate(scope.current,{'--spec-progress':[0,1]},{duration:.7,ease:[.22,1,.36,1]}));
    }
    return()=>animations.forEach(animation=>animation.cancel());
  },[open,reduced,visible,animate,kind]);
  return scope;
}
function Detail({item,open,reduced}){
  const scope=useAssembly(open,reduced,'detail');
  return localize(<div ref={scope} data-project-spec><dt>{item.label}</dt><dd>{item.text}</dd></div>);
}
export default function ProjectNarrative({project,open,reduced}){
  const scope=useAssembly(open,reduced,'copy');
  return localize(<div className={s.projectBuild}><p ref={scope} className={s.buildDescription} data-project-copy><TextReveal text={project.detail}/></p><dl>{project.implementation.map(item=>localize(<Detail key={item.label} item={item} open={open} reduced={reduced}/>))}</dl></div>);
}
