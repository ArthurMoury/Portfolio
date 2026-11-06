// A single strip of folded metal. u is measured in panel widths in the
// four-screen world; only its leading edge advances as the rail moves.
export function ribbonFrame(width, height, slide, compact) {
  const mobile = width <= 720 && height > 420;
  const lead = (mobile ? .78 : .86) - .14 * Math.sin(slide * Math.PI);
  const finish = Math.max(0, Math.min(1, slide - 2));
  const extension = finish * finish * (3 - 2 * finish);
  const end = slide + lead + (1 - lead) * extension;
  // Start just behind the camera: older folds still exist in world space.
  const start = Math.max(-.16, slide - .08);
  const scale = Math.min(height*(compact ? .28 : .15), width*(mobile ? .29 : .17));
  return {width,height,slide,start,end,scale,base:height*.5};
}

export function ribbonPoint(frame, u, side, out) {
  const {width,slide,end,scale,base} = frame;
  const phase = u*9.7 - slide*1.25;
  const twist = u*7.3 + slide*.9;
  const taper = Math.min(1, Math.max(.035,(end-u)*15), Math.max(.035,(u+.16)*12));
  const breadth = scale*(.44+.14*Math.sin(u*5))*taper;
  out[0] = (u-slide)*width + side*breadth*.25*Math.sin(twist);
  out[1] = base + scale*(.51*Math.sin(phase)+.24*Math.cos(phase*.52)) + side*breadth*Math.cos(twist);
  out[2] = scale*.56*Math.cos(phase) + side*breadth*Math.sin(twist);
  return out;
}
