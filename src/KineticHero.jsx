import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import s from './KineticHero.module.css';

function Fold({ reduced }) {
  const host = useRef(null);
  useEffect(() => {
    if (reduced) return;
    let disposed = false, renderer, geometry, material, environment, observer, resize;
    let frame = 0, visible = true;
    const pointer = { x: 0, y: 0 };
    let shape=0;
    const changeShape=()=>{shape=(shape+1)%3;sync();};
    const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();changeShape();}};
    const node = host.current;
    const interaction=node.closest('section');
    const move = e => {
      const rect = node.getBoundingClientRect();
      pointer.x = Math.max(-.7,Math.min(.7,(e.clientX - rect.left) / rect.width - .5));
      pointer.y = Math.max(-.7,Math.min(.7,(e.clientY - rect.top) / rect.height - .5));
      sync();
    };
    const reset = () => { pointer.x = 0; pointer.y = 0; sync(); };
    let sync = () => {};
    Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')]).then(([T, { RoomEnvironment }]) => {
      if (disposed) return;
      try {
        renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
        renderer.setClearColor(0x101112, 0);
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        node.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(35, 1, .1, 100);
        camera.position.z = 7.4;
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        environment = pmrem.fromScene(room, .04);
        scene.environment = environment.texture;
        room.dispose(); pmrem.dispose();
        // A continuous, folded strip: the surface itself carries the light.
        const positions = [], indices = [], count = 200, across = 12;
        for (let i = 0; i <= count; i++) {
          const t = i / count * Math.PI * 2;
          for (let j = 0; j <= across; j++) {
            const v = (j / across - .5) * 1.16;
            const r = 1.45 + .22 * Math.cos(3 * t) + v * Math.cos(t * 1.5);
            positions.push(r * Math.cos(t), r * Math.sin(t), .42 * Math.sin(3 * t) + v * Math.sin(t * 1.5));
            if (i < count && j < across) {
              const a = i * (across + 1) + j, b = a + across + 1;
              indices.push(a, b, a + 1, b, b + 1, a + 1);
            }
          }
        }
        geometry = new T.BufferGeometry();
        geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices); geometry.computeVertexNormals();
        const basePositions = new Float32Array(positions);
        material = new T.MeshPhysicalMaterial({ color: 0xbcc0c4, metalness: 1, roughness: .23, side: T.DoubleSide, clearcoat: .8, clearcoatRoughness: .16 });
        const fold = new T.Mesh(geometry, material);
        scene.add(fold);
        scene.add(new T.HemisphereLight(0xffffff, 0x333333, 2));
        const light = new T.DirectionalLight(0xffffff, 3);
        light.position.set(2, 3, 4); scene.add(light);
        const fit = () => {
          const width=node.clientWidth, height=node.clientHeight;
          if (!width || !height) return;
          camera.aspect = width / height; camera.position.z = 7.4 / Math.min(1, camera.aspect); camera.updateProjectionMatrix(); renderer.setSize(width, height, false); sync();
        };
        fit(); resize = new ResizeObserver(fit); resize.observe(node);
        let elapsed = 0, last = 0, rx = 0, ry = 0, morph=0;
        const draw = now => {
          if (disposed || !visible || document.hidden) { frame = 0; last = 0; return; }
          elapsed += last ? Math.min((now - last) / 1000, .05) : 0; last = now;
          const progress = Math.min(elapsed / 3.2, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          rx += (pointer.y * 1.1 - rx) * .055; ry += (pointer.x * 1.7 - ry) * .055;
          morph+=(shape-morph)*.045;
          const vertices = geometry.attributes.position.array;
          for(let i=0;i<vertices.length;i+=3){
            vertices[i]=basePositions[i]*(1+ry*.24+morph*.08);
            vertices[i+1]=basePositions[i+1]*(1-ry*.18-morph*.09);
            vertices[i+2]=basePositions[i+2]+Math.sin(basePositions[i]*2.2+rx*3)*(ry*.55+morph*.27);
          }
          geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();
          fold.rotation.set(.42 + rx, -.4 + ry + (1 - ease) * 2.8, -.45 + ease * .2 + morph*.6);
          fold.scale.setScalar(.3 + ease * .7);
          renderer.render(scene, camera);
          node.dataset.ready = 'true';
          const moving = Math.abs(pointer.y * 1.1 - rx) + Math.abs(pointer.x * 1.7 - ry) > .0005;
          frame = progress < 1 || moving || Math.abs(shape-morph)>.001 ? requestAnimationFrame(draw) : 0;
        };
        sync = () => { if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw); };
        observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        observer.observe(node); sync();
      } catch { node.dataset.ready = 'false'; }
    }).catch(() => { node.dataset.ready = 'false'; });
    const visibility = () => sync();
    interaction.addEventListener('pointermove', move); interaction.addEventListener('pointerleave', reset);
    node.addEventListener('pointerdown',changeShape);node.addEventListener('keydown',key);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); resize?.disconnect();
      interaction.removeEventListener('pointermove', move); interaction.removeEventListener('pointerleave', reset);
      node.removeEventListener('pointerdown',changeShape);node.removeEventListener('keydown',key);
      document.removeEventListener('visibilitychange', visibility);
      geometry?.dispose(); material?.dispose(); environment?.dispose(); renderer?.dispose();
      renderer?.domElement.remove(); delete node.dataset.ready;
    };
  }, [reduced]);
  return <div ref={host} className={s.fold} role={reduced?"img":"button"} tabIndex={reduced?undefined:0} aria-label={reduced?"Escultura abstrata":"Escultura interativa. Mova o cursor ou pressione Enter para transformar."} data-fold>
    <svg className={s.fallback} viewBox="0 0 600 600" fill="none"><g stroke="currentColor">{Array.from({length:14},(_,i)=><ellipse key={i} cx="300" cy="300" rx={190-i*5} ry={85+i*8} transform={`rotate(${i*7} 300 300)`} />)}</g></svg>
  </div>;
}

export default function KineticHero({ reduced }) {
  const root = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .fromTo(q('[data-entry-top]'),{yPercent:0},{yPercent:-102,duration:1.25,ease:'power3.inOut'},.05)
        .fromTo(q('[data-entry-bottom]'),{yPercent:0},{yPercent:102,duration:1.25,ease:'power3.inOut'},.05)
        .from(q('[data-name-line]'), { yPercent: 110, rotate: 4, duration: 1.3, stagger: .12, clearProps: 'all' }, .45)
        .from(q('[data-intro-copy]'), { opacity: .25, y: 20, duration: 1, stagger: .13, clearProps: 'all' }, .85)
        .fromTo(q('[data-fold]'), { opacity: .1, scale: .6 }, { opacity: 1, scale: 1, duration: 1.5 }, .1);
      gsap.to(q('[data-horizon]'), {attr:{d:'M0 12C280 85 430 0 720 38S1160 100 1440 12V100H0Z'},ease:'none',scrollTrigger:{trigger:root.current,start:'top top',end:'bottom top',scrub:1}});
      gsap.to(q('[data-hero-stage]'), { y: 65, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: .7 } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return <section ref={root} id="inicio" className={s.hero} aria-labelledby="hero-title" data-context="pessoa">
    {!reduced&&<div className={s.entry} aria-hidden="true"><div data-entry-top/><div data-entry-bottom/></div>}
    <div className={s.layout}>
      <div className={s.copy}>
        <p className={s.hello} data-intro-copy>Olá, sou</p>
        <h1 id="hero-title" aria-label="Arthur Moury"><span className={s.nameMask}><span data-name-line>Arthur</span></span><span className={s.nameMask}><span data-name-line>Moury<span className={s.period}>.</span></span></span></h1>
        <p className={s.description} data-intro-copy>Entendo problemas.<br/> Construo possibilidades.</p>
        <a href="#sobre" className={s.aboutLink} data-intro-copy>Conheça meu universo<ArrowUpRight size={18}/></a>
      </div>
      <div className={s.stage} data-hero-stage>
        <Fold reduced={reduced}/>
      </div>
    </div>
    <div className={s.horizon} aria-hidden="true"><svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path data-horizon d="M0 62C280 0 430 100 720 48S1160 0 1440 62V100H0Z"/></svg></div>
  </section>;
}