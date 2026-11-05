import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const TAU = 2 * Math.PI;
const finishes = [
  { map: 'spun', color: '#b77d57', roughness: 0.5, metalness: 0.88 },
  { map: 'etched', color: '#787394', roughness: 0.63, metalness: 0.86 },
  { map: 'fluted', color: '#528d89', roughness: 0.39, metalness: 0.76 },
];

// Rounded three-lobed sections give all three castings the same silhouette.
// UVs run around the casting so its machining marks follow the metal.
function castingGeometry() {
  const positions = [], uvs = [], indices = [];
  const segments = 336, profile = 28;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, angle = TAU * u;
    const rim = 1.03 + 0.18 * Math.cos(3 * angle) - 0.025 * Math.cos(6 * angle);
    for (let j = 0; j <= profile; j++) {
      const v = j / profile, cross = TAU * v;
      const ridge = 0.024 * Math.cos(84 * angle + 2 * Math.sin(cross));
      const radius = rim + (0.26 + ridge) * Math.cos(cross);
      const depth = 0.115 * Math.sin(cross) + 0.10 * Math.sin(3 * angle + 0.35);
      positions.push(radius * Math.cos(angle), radius * Math.sin(angle), depth);
      uvs.push(u, v);
      if (i < segments && j < profile) {
        const a = i * (profile + 1) + j, b = a + profile + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function mountSculpture(host, travel) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.99;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.z = 5.1;
  const generator = new THREE.PMREMGenerator(renderer);
  const studio = new RoomEnvironment();
  const reflection = generator.fromScene(studio, 0.035);
  scene.environment = reflection.texture;
  studio.dispose();
  generator.dispose();

  const key = new THREE.DirectionalLight(0xffdfc7, 3);
  key.position.set(-3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb9d9ff, 3.3);
  rim.position.set(4, 0, 1);
  scene.add(rim);

  const assembly = new THREE.Group();
  const geometry = castingGeometry();
  const loader = new THREE.TextureLoader();
  const textures = [];
  const castings = finishes.map(finish => {
    const texture = loader.load('/studies/materials/' + finish.map + '.svg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    textures.push(texture);
    const material = new THREE.MeshPhysicalMaterial({
      color: finish.color, metalness: finish.metalness, roughness: finish.roughness,
      roughnessMap: texture, bumpMap: texture, bumpScale: 0.014,
      clearcoat: 0.2, clearcoatRoughness: 0.38,
    });
    const mesh = new THREE.Mesh(geometry, material);
    assembly.add(mesh);
    return mesh;
  });
  scene.add(assembly);
  host.appendChild(renderer.domElement);
  const pointer = new THREE.Vector2(), smoothed = new THREE.Vector2();
  let frame = 0, visible = false, destroyed = false, contextLost = false;

  function draw(time) {
    frame = 0;
    if (!visible || document.hidden || destroyed || contextLost) return;
    const seconds = time / 1000;
    const spread = Math.min(1, Math.max(0, travel.current));
    smoothed.lerp(pointer, 0.08);
    assembly.rotation.set(-0.39 + smoothed.y * 0.19, -0.69 + smoothed.x * 0.28 + spread * 0.7, -0.20 + Math.sin(seconds * 0.3) * 0.055);
    castings.forEach((mesh, i) => {
      mesh.position.z = (i - 1) * (0.31 + spread * 0.44);
      mesh.rotation.z = (i - 1) * (0.25 + 0.14 * Math.sin(seconds * 0.42) + spread * 0.4);
      mesh.rotation.y = (i - 1) * (0.13 + spread * 0.25);
    });
    renderer.render(scene, camera);
    host.dataset.ready = 'true';
    frame = requestAnimationFrame(draw);
  }

  function schedule() {
    if (!frame && visible && !document.hidden && !destroyed && !contextLost) frame = requestAnimationFrame(draw);
  }
  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = 5.1 / Math.min(1, camera.aspect);
    camera.updateProjectionMatrix();
    schedule();
  }
  function move(event) {
    const rect = host.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
  }
  const reset = () => pointer.set(0, 0);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  });
  observer.observe(host);
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerleave', reset);
  document.addEventListener('visibilitychange', schedule);
  const lost = () => { contextLost = true; delete host.dataset.ready; };
  renderer.domElement.addEventListener('webglcontextlost', lost);
  resize();
  return () => {
    destroyed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerleave', reset);
    document.removeEventListener('visibilitychange', schedule);
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    geometry.dispose();
    castings.forEach(mesh => mesh.material.dispose());
    textures.forEach(texture => texture.dispose());
    reflection.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    delete host.dataset.ready;
  };
}
