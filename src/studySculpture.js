import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ribbonPoint } from './studyMechanics';

export function createStudyRenderer(canvas) {
  const renderer = new T.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1,1.5));
  renderer.setClearColor(0,0);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  const generator = new T.PMREMGenerator(renderer), studio = new RoomEnvironment();
  const env = generator.fromScene(studio,.035);
  studio.dispose(); generator.dispose();
  const scene = new T.Scene();
  scene.environment = env.texture;
  const camera = new T.OrthographicCamera(0,1,1,0,.1,6000);
  camera.position.z=3000;
  const segments=180, profile=[[-1,-.025],[-.97,.015],[0,.09],[.97,.015],[1,-.025],[0,-.07]];
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
  const material=new T.MeshStandardMaterial({color:0xa2a4a8, metalness:.94, roughness:.29,side:T.DoubleSide});
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
    dispose(){geometry.dispose();material.dispose();env.dispose();renderer.dispose();renderer.forceContextLoss();}
  };
}
