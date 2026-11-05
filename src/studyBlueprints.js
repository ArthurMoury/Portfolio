import { options, leafPositions, blend } from './studyMechanics';

function path(ctx, points) {
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
}
function bead(ctx,x,y,r) {ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function weave(ctx,p) {
  ctx.rotate(-0.23);
  for(let strand=0;strand<3;strand++) {
    ctx.lineWidth=5;
    path(ctx,Array.from({length:90},(_,i)=>[i*2.6-117,Math.sin(i*.08+strand*2.09+p*2.5)*(17+19*Math.sin(i/89*Math.PI))]));
  }
}
function generation(ctx,p) {
  let x=-111,y=0;
  options.forEach((chosen,n)=>{
    for(let i=0;i<3;i++){
      const yy=y+(1-i)*37;
      ctx.globalAlpha=i===chosen&&n<=p*3?1:.4;
      path(ctx,[[x,y],[x+26,y],[x+70,yy]]);
      bead(ctx,x+70,yy,4+(i+n)%3);
    }
    if(n===Math.min(2,Math.floor(p*3))){
      const t=Math.min(1,p*3-n);
      ctx.globalAlpha=1;bead(ctx,x+70*t,y+(1-chosen)*37*Math.max(0,(t-.37)/.63),5);
    }
    x+=70;y+=(1-chosen)*37;
  });
}
function python(ctx,p) {
  const k=blend((p-.28)/.72);
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='15px monospace';
  ['“Recife”','“recife”','“ Recife ”'].forEach((word,i)=>{
    const x=(i-1)*(16-8*k)+20*p,y=(i-1)*(54-43*k);
    ctx.fillStyle='#252629';ctx.fillRect(x-49,y-14,98,28);ctx.strokeRect(x-49,y-14,98,28);
    ctx.fillStyle='#dedede';ctx.fillText(p<.27+i*.09?word:'recife',x,y);
  });
}
function react(ctx,p) {
  const selected=Math.min(3,Math.floor(p*4));
  leafPositions.forEach((x,i)=>{
    const parent=i<2?-51:51;
    path(ctx,[[0,-57],[parent,0],[x*86,57]]);
    ctx.fillStyle=i===selected?'#ededed':'#68696c';ctx.fillRect(x*86-15,48,30,18);
  });
  ctx.fillStyle='#bcbdbf';
  for(const x of [-51,51])ctx.fillRect(x-14,-9,28,18);
  ctx.fillRect(-21,-66,42,18);
}
const diagrams=[weave,generation,python,react];

export function blueprintRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  return {
    paint(width, height, slots) {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      const w = Math.ceil(width * ratio), h = Math.ceil(height * ratio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const {index, x, y, width: sw, height: sh, progress} of slots) {
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, sw, sh); ctx.clip();
        ctx.translate(x + sw / 2, y + sh / 2);
        const scale = Math.min(sw, sh) / 282;
        ctx.scale(scale, scale);
        ctx.strokeStyle = ctx.fillStyle = '#c8c9ca';
        ctx.lineWidth = 1.25;
        diagrams[index](ctx, progress);
        ctx.restore();
      }
    },
  };
}
