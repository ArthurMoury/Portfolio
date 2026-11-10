import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ribbonPoint } from './studyMechanics';

export function createStudyRenderer(canvas) {
  const compact = canvas.ownerDocument.documentElement.clientWidth < 900;
  const renderer = new T.WebGLRenderer({canvas, alpha:true, antialias:!compact, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1 : 1.5));
  renderer.setClearColor(0,0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  let env,matcap;
  if(compact){
    // A coded silver matcap avoids the environment capture pass on phones.
    const image=document.createElement('canvas');image.width=image.height=128;
    const ink=image.getContext('2d'),gradient=ink.createLinearGradient(0,0,128,100);
    [[0,'#242933'],[.18,'#bac1cc'],[.29,'#f0f1f2'],[.4,'#404650'],[.58,'#929ba7'],[.72,'#e1e4e8'],[.9,'#333a45'],[1,'#151a23']].forEach(([offset,color])=>gradient.addColorStop(offset,color));
    ink.fillStyle=gradient;ink.fillRect(0,0,128,128);
    matcap=new T.CanvasTexture(image);matcap.colorSpace=T.SRGBColorSpace;
  }else{
    const generator = new T.PMREMGenerator(renderer), studio = new RoomEnvironment();
    env = generator.fromScene(studio,.035);studio.dispose();generator.dispose();
  }
  const scene = new T.Scene();
  if(env)scene.environment = env.texture;
  const camera = new T.OrthographicCamera(0,1,1,0,.1,6000);
  camera.position.z=3000;
  const segments=compact ? 72 : 180, profile=[[-1,-.025],[-.97,.015],[0,.09],[.97,.015],[1,-.025],[0,-.07]];
  const stride=profile.length;
  const geometry=new T.BufferGeometry(), indices=[];
  const pos=new T.Float32BufferAttribute(new Float32Array((segments+1)*stride*3),3);
  pos.setUsage(T.DynamicDrawUsage);
  geometry.setAttribute('position',pos);
  for(let i=0;i<segments;i++) for(let j=0;j<stride;j++){
    const a=i*stride+j,b=i*stride+(j+1)%stride;
    indices.push(a,b,a+stride,b,b+stride,a+stride);
  }
  geometry.setIndex(indices);
  const material=compact?new T.MeshMatcapMaterial({matcap,color:0xd6d9df,side:T.DoubleSide}):new T.MeshStandardMaterial({color:0xa2a4a8, metalness:.94, roughness:.29,side:T.DoubleSide});
  const mesh=new T.Mesh(geometry,material);
  mesh.frustumCulled=false;
  scene.add(mesh);
  const point=[0,0,0];
  let w=0,h=0;
  return {
    paint(frame){
      const {width,height,start,end,scale,slide}=frame;
      if(width!==w||height!==h){
        renderer.setSize(width,height,false);
        camera.right=w=width;camera.top=h=height;camera.updateProjectionMatrix();
      }
      for(let i=0;i<=segments;i++){
        const u=start+(end-start)*i/segments;
        const twist=u*7.3+slide*.9;
        profile.forEach(([side,depth],j)=>{
          ribbonPoint(frame,u,side,point);
          const d=depth*scale*Math.min(1,(end-u)*15);
          pos.setXYZ(i*stride+j,point[0],height-point[1]+d*Math.sin(twist),point[2]+d*Math.cos(twist));
        });
      }
      pos.needsUpdate=true;
      geometry.computeVertexNormals();
      renderer.render(scene,camera);
    },
    dispose(){geometry.dispose();material.dispose();env?.dispose();matcap?.dispose();renderer.dispose();renderer.forceContextLoss();}
  };
}
