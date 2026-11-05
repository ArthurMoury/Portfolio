// Sample one braided cable in rail coordinates. Its knots coincide with the
// instruments, so translating the panels never cuts the cable at their edges.
export function paintThread(canvas, width, height, anchors, horizontal, phase, lift) {
  const ctx = canvas.getContext('2d');
  if (!ctx || anchors.length < 2) return;
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  const w = Math.round(width * ratio), h = Math.round(height * ratio);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const points = [anchors[0].map((v,k)=>2*v-anchors[1][k]), ...anchors,
    anchors.at(-1).map((v,k)=>2*v-anchors.at(-2)[k])];
  const axis = horizontal ? 0 : 1;
  const extent = horizontal ? width : height;
  for (let i=1;i<points.length;i++) {
    const a=points[i-1], b=points[i];
    if (b[axis]<-10 || a[axis]>extent+10) continue;
    for (let strand=0;strand<3;strand++) {
      ctx.beginPath();
      for (let n=0;n<=96;n++) {
        const t=n/96, arc=Math.sin(Math.PI*t);
        const wave=Math.sin((t*2+i)*Math.PI+phase*.75);
        const twist=Math.cos(2*Math.PI*(t+i)*1.5+strand*2.094+phase*1.5);
        const bend=arc*(wave+twist*.34)*Math.min(width*.13,height*.14,105) - lift*arc*arc;
        const x=a[0]+(b[0]-a[0])*t+(horizontal?0:bend);
        const y=a[1]+(b[1]-a[1])*t+(horizontal?bend:0);
        if (!n) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle=['#48494d','#77787b','#393a3c'][strand];
      ctx.lineWidth=[2.5,1,4][strand];ctx.stroke();
    }
  }
}
