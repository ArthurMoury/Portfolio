import { localize } from './i18n';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import s from './KineticHero.module.css';
import LanguageSwitch from './LanguageSwitch';

function Fold({ reduced, flightRef }) {
  const host = useRef(null);
  useEffect(() => {
    if (reduced) return;
    let disposed = false, renderer, geometry, material, environment, observer, resize;
    let frame = 0, visible = true, flightProgress = flightRef.progress || 0;
    const pointer = { x: 0, y: 0 };
    let shape=0;
    const changeShape=()=>{shape=(shape+1)%3;sync();};
    const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();changeShape();}};
    const node = host.current;
    const interaction=node.closest('section');
    const move = e => {
      const rect = interaction.querySelector('[data-hero-stage]').getBoundingClientRect();
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
        renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 900 ? 1.25 : 1.6));
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
        const positions = [], indices = [], count = innerWidth < 900 ? 120 : 200, across = innerWidth < 900 ? 8 : 12;
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
        let cameraDistance = 7.4;
        const target = new T.Vector3();
        const fit = () => {
          const width=node.clientWidth, height=node.clientHeight;
          if (!width || !height) return;
          camera.aspect = width / height;
          const anchor = interaction.querySelector('[data-hero-stage]').getBoundingClientRect();
          const bounds = node.getBoundingClientRect();
          const mobile = innerWidth < 900;
          const fitHeight = mobile ? Math.min(anchor.height, anchor.width * 1.2) : anchor.height;
          cameraDistance = (mobile ? 7.5 : 7.4) * height / fitHeight;
          const worldHeight = 2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * cameraDistance;
          target.set(((anchor.left + anchor.width / 2 - bounds.left) / width - .5) * worldHeight * camera.aspect, (.5 - (anchor.top + anchor.height / 2 - bounds.top) / height) * worldHeight, 0);
          fold.position.copy(target);
          camera.updateProjectionMatrix(); renderer.setSize(width, height, false); sync();
        };
        fit(); resize = new ResizeObserver(fit); resize.observe(node);
        let elapsed = 0, last = 0, rx = 0, ry = 0, morph=0;
        const draw = now => {
          if (disposed || !visible || document.hidden) { frame = 0; last = 0; return; }
          elapsed += last ? Math.min((now - last) / 1000, .05) : 0; last = now;
          const progress = Math.min(elapsed / 3.2, 1);
          const ease = Math.max(1 - Math.pow(1 - progress, 4), T.MathUtils.smoothstep(flightProgress, 0, .15));
          const interactionWeight = Math.pow(1 - Math.min(1, flightProgress * 2.4), 2);
          rx += (pointer.y * 1.1 * interactionWeight - rx) * .09;
          ry += (pointer.x * 1.7 * interactionWeight - ry) * .09;
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
          // The mesh is built around the origin, so the camera travels through its actual opening.
          const alignment = T.MathUtils.smoothstep(flightProgress, 0, .55);
          camera.position.set(target.x * alignment, target.y * alignment, cameraDistance - (cameraDistance + 1.15) * flightProgress * flightProgress);
          fold.visible = flightProgress < 1;
          renderer.render(scene, camera);
          node.dataset.ready = 'true';
          const moving = Math.abs(pointer.y * 1.1 * interactionWeight - rx) + Math.abs(pointer.x * 1.7 * interactionWeight - ry) > .0005;
          frame = progress < 1 || moving || Math.abs(shape-morph)>.001 ? requestAnimationFrame(draw) : 0;
        };
        sync = () => { if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw); };
        flightRef.current = value => { flightProgress = value; sync(); };
        observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
        observer.observe(node); sync();
      } catch { node.dataset.ready = 'false'; }
    }).catch(() => { node.dataset.ready = 'false'; });
    const visibility = () => sync();
    interaction.addEventListener('pointerdown', move); interaction.addEventListener('pointercancel', reset); interaction.addEventListener('pointermove', move); interaction.addEventListener('pointerleave', reset);
    node.addEventListener('click',changeShape);node.addEventListener('keydown',key);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); resize?.disconnect();
      interaction.removeEventListener('pointerdown', move); interaction.removeEventListener('pointercancel', reset); interaction.removeEventListener('pointermove', move); interaction.removeEventListener('pointerleave', reset);
      node.removeEventListener('click',changeShape);node.removeEventListener('keydown',key);
      document.removeEventListener('visibilitychange', visibility);
      geometry?.dispose(); material?.dispose(); environment?.dispose(); renderer?.dispose();
      flightRef.current = null;
      renderer?.domElement.remove(); delete node.dataset.ready;
    };
  }, [reduced, flightRef]);
  return localize(<div ref={host} className={s.fold} role={reduced?"img":"button"} tabIndex={reduced?undefined:0} aria-label={reduced?"Escultura abstrata":"Escultura interativa. Mova o cursor, toque ou pressione Enter para transformar."} data-fold>
    <svg className={s.fallback} viewBox="0 0 600 600" fill="none"><g stroke="currentColor">{Array.from({length:14},(_,i)=>localize(<ellipse key={i} cx="300" cy="300" rx={190-i*5} ry={85+i*8} transform={`rotate(${i*7} 300 300)`} />))}</g></svg>
  </div>);
}

export default function KineticHero({ reduced }) {
  const root = useRef(null);
  const flightRef = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .fromTo(q('[data-entry-slice]'),{x:0,xPercent:0},{xPercent:i=>i%2?105:-105,duration:1.08,stagger:.065,ease:'power3.inOut'},.08)
        .fromTo(q('[data-hero-greeting]'),{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.65,clearProps:'clipPath'},.36)
        .fromTo(q('[data-hero-glyph]'),{yPercent:115,rotation:6},{yPercent:0,rotation:0,duration:.85,stagger:.045,clearProps:'transform'},.48)
        .fromTo(q('[data-description-line]'),{yPercent:110},{yPercent:0,duration:.7,stagger:.13,clearProps:'transform'},1.04)
        .fromTo(q('[data-hero-action]'),{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.65,clearProps:'clipPath'},1.25)
        .fromTo(q('[data-fold]'), { opacity: .1 }, { opacity: 1, duration: 1.2 }, .15)
        .set(q('[data-entry-slice]'),{visibility:'hidden'},1.65);
      const opening=root.current.closest('[data-opening]');
      const about=opening.querySelector('#sobre');
      const photo=about.querySelector('[data-about-photo]');
      gsap.set(about,{autoAlpha:0});
      const travel={progress:0};
      const flight=gsap.timeline({scrollTrigger:{id:'opening-flight',trigger:opening,start:'top top',end:'+=200%',pin:true,scrub:.65,invalidateOnRefresh:true}});
      flight.to(q('[data-intro-copy], [data-name-line], [data-horizon]'),{opacity:0,duration:.2,ease:'none'},0)
        .to(travel,{progress:1,duration:.7,ease:'none',onUpdate:()=>{flightRef.progress=travel.progress;flightRef.current?.(travel.progress);}},0)
        .to(root.current,{autoAlpha:0,duration:.06},.68)
        .set(about,{autoAlpha:1},.75)
        .fromTo(about.querySelector('h2'),{autoAlpha:0,y:25,clipPath:'inset(0 0 100% 0)'},{autoAlpha:1,y:0,clipPath:'inset(0 0 0% 0)',duration:.24,ease:'power3.out'},.76)
        .fromTo(photo,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.28,ease:'power3.out'},.95)
        .fromTo(photo.querySelector('img'),{scale:1.12,x:16},{scale:1,x:0,duration:.32,ease:'power3.out'},.95)
        .fromTo(about.querySelectorAll('p[data-about-piece]'),{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.23,stagger:.16,ease:'power3.out'},1.12)
        .fromTo(about.querySelectorAll('a[data-about-piece]'),{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.18,stagger:.075,ease:'power3.out'},1.43)
        .fromTo(about.querySelectorAll('dl [data-about-piece]'),{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.22,stagger:.09,ease:'power3.out'},1.56);

    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return localize(<section ref={root} id="inicio" className={s.hero} aria-labelledby="hero-title" data-context="pessoa">
    <LanguageSwitch/>
    {!reduced&&<div className={s.entry} aria-hidden="true">{Array.from({length:6},(_,i)=>localize(<div key={i} data-entry-slice/>))}</div>}
    <div className={s.layout}>
      <div className={s.copy}>
        <p className={s.hello} data-intro-copy data-hero-greeting>Olá, sou</p>
        <h1 id="hero-title" aria-label="Arthur Moury"><span className={s.nameMask}><span data-name-line aria-hidden="true">{[...'Arthur'].map((letter,i)=>localize(<span className={s.nameGlyph} data-hero-glyph key={i}>{letter}</span>))}</span></span><span className={s.nameMask}><span data-name-line aria-hidden="true">{[...'Moury.'].map((letter,i)=>localize(<span className={`${s.nameGlyph} ${letter==='.'?s.period:''}`} data-hero-glyph key={i}>{letter}</span>))}</span></span></h1>
        <p className={s.description} data-intro-copy><span className={s.descriptionMask}><span data-description-line>Entendo problemas.</span></span><span className={s.descriptionMask}><span data-description-line>Construo possibilidades.</span></span></p>
        <a href="#sobre" className={s.aboutLink} data-intro-copy data-hero-action>Conheça meu universo<ArrowUpRight size={18}/></a>
      </div>
      <div className={s.stage} data-hero-stage aria-hidden="true"/>
    </div>
    <Fold reduced={reduced} flightRef={flightRef}/>
    <div className={s.horizon} aria-hidden="true"><svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path data-horizon d="M0 62C280 0 430 100 720 48S1160 0 1440 62V100H0Z"/></svg></div>
  </section>);
}
