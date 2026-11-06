import { ribbonPoint } from './studyMechanics';

// Software projection of the same ribbon for unavailable WebGL contexts.
export function blueprintRenderer(canvas) {
  const ctx=canvas.getContext('2d');
  const a=[],b=[],c=[],d=[];
  return { paint(frame){
    if (!ctx) return;
    const {width,height,start,end,slide}=frame,ratio=Math.min(devicePixelRatio||1,1.5);
    const w=Math.round(width*ratio),h=Math.round(height*ratio);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
    for(let i=0;i<140;i++){
      const u=start+(end-start)*i/140,v=start+(end-start)*(i+1)/140;
      ribbonPoint(frame,u,-1,a);ribbonPoint(frame,u,1,b);
      ribbonPoint(frame,v,1,c);ribbonPoint(frame,v,-1,d);
      const shade=Math.round(61+132*Math.pow(Math.abs(Math.cos(u*7.3+slide*.9+.6)),4));
      ctx.fillStyle=ctx.strokeStyle='rgb('+shade+','+shade+','+(shade+3)+')';
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(d[0],d[1]);ctx.closePath();ctx.fill();ctx.lineWidth=.6;ctx.stroke();
    }
  }};
}
