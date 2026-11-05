import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { blend, unit, breathAt, instruction, membership, meanAt, sample } from './studyMechanics';

const TAU = Math.PI * 2;
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
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function toolmarks(mode) {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const path = mode === 'fluted' ? x + y / 2 : y;
      const cut = mode === 'etched' ? (x % 32 < 2 || (y + x) % 48 < 2 ? -36 : 12) : 32 * Math.cos(path * TAU / 8);
      const grain = 7 * Math.sin(x * 32.19 + y * 47.23);
      const shade = Math.round(156 + cut + grain);
      pixels.set([shade, shade, shade, 255], (y * size + x) * 4);
    }
  }
  const texture = new T.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function metal(color, texture, roughness = 0.46) {
  return new T.MeshStandardMaterial({ color, metalness: 0.82, roughness, roughnessMap: texture, bumpMap: texture, bumpScale: 0.009 });
}
function add(parent, geometry, material, x = 0, y = 0, z = 0) {
  const mesh = new T.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}
function plate(parent, material, w, h, d, x, y, z, bevel = 0.045) {
  return add(parent, new RoundedBoxGeometry(w, h, d, 2, bevel), material, x, y, z);
}
function trace(parent, material, points, radius = 0.014) {
  const curve = new T.CatmullRomCurve3(points.map(([x,y,z]) => new T.Vector3(x,y,z)));
  add(parent, new T.TubeGeometry(curve, 46, radius, 6, false), material);
  return curve;
}
function lamp(color) { return new T.MeshBasicMaterial({ color, toneMapped: false }); }

function signature(group, palette) {
  const geometry = castingGeometry();
  const rings = [palette.copper, palette.silicon, palette.teal].map(mat => add(group, geometry, mat));
  const bead = add(group, new T.SphereGeometry(0.13, 24, 16), palette.ivory);
  return p => {
    const engage = blend(p / 0.78);
    group.rotation.set(-0.4 + engage * 0.18, -0.74 + engage * 0.49, -0.2);
    rings.forEach((ring, i) => {
      ring.scale.setScalar(1.12);
      ring.position.set((i - 1) * (1 - engage) * 0.32, 0, (i - 1) * (0.5 - engage * 0.23));
      ring.rotation.set(0, (i - 1) * 0.4 * (1 - engage), (i - 1) * 0.5 + engage * (i + 1) * Math.PI / 3);
    });
    bead.position.set(0, 0, -1.1 + 2.45 * blend((p - 0.6) / 0.4));
    bead.scale.setScalar(0.4 + 0.95 * engage);
  };
}

function harmonica(group, palette) {
  // An exploded reed plate: air enters one chamber, bends a reed and sends a pulse.
  const body = palette.graphite, brass = palette.copper;
  plate(group, body, 3.22, 1.1, 0.47, 0, 0, 0, 0.1);
  plate(group, palette.silver, 3.32, 1.18, 0.12, 0, 0, -0.25);
  const cover = plate(group, brass, 3.35, 0.93, 0.15, 0, 0.22, 0.32, 0.07);
  const slots = [], reeds = [];
  for (let i = 0; i < 8; i++) {
    const x = (i - 3.5) * 0.365;
    plate(group, palette.black, 0.285, 0.72, 0.06, x, -0.09, 0.245);
    const reed = new T.Group();
    reed.position.set(x, 0.25, 0.288);
    group.add(reed);
    const material = metal('#bb8852', palette.spun);
    material.emissive.set('#ee7735');
    plate(reed, material, 0.15, 0.62, 0.033, 0, -0.30, 0, 0.014);
    reeds.push(reed);
    slots.push(material);
  }
  const rivet = new T.SphereGeometry(0.055, 12, 8);
  for (const x of [-1.55, 1.55]) for (const y of [-0.39,0.39]) add(group, rivet, palette.silver, x, y, 0.29);
  const winds = new T.Group();
  group.add(winds);
  const particle = new T.SphereGeometry(0.035, 10, 8);
  const stream = new T.InstancedMesh(particle, palette.amber, 42);
  winds.add(stream);
  const temp = new T.Object3D();
  const waves = Array.from({length: 3}, () => {
    const material = new T.MeshBasicMaterial({color: '#ffc98f', transparent: true, depthWrite: false});
    return add(group, new T.TorusGeometry(0.24, 0.014, 8, 56), material);
  });
  return p => {
    const { channel, phase, pressure } = breathAt(p);
    group.rotation.set(-0.70 + 0.11 * p, 0.31, -0.19);
    group.position.y = 0.05;
    cover.position.set(0, 0.25 + 0.68 * blend(p * 6), 0.34 + 0.24 * blend(p * 6));
    cover.rotation.x = -0.23 * blend(p * 6);
    reeds.forEach((reed, i) => {
      reed.rotation.x = i === channel ? -pressure * (0.65 + 0.15 * Math.sin(phase * TAU * 3)) : 0;
      slots[i].emissiveIntensity = i === channel ? pressure * 0.85 : 0;
    });
    winds.position.x = (channel - 3.5) * 0.365;
    for (let i = 0; i < stream.count; i++) {
      const t = (i / stream.count + phase * 1.8) % 1;
      const angle = t * TAU * 1.6 + i % 3 * TAU / 3;
      temp.position.set(Math.cos(angle) * 0.21 * (1-t), -1.55 + 1.36 * t, 0.3 + 0.15 * Math.sin(angle) * (1-t));
      temp.scale.setScalar((0.32 + 0.85 * pressure) * Math.sin(Math.PI * t));
      temp.updateMatrix(); stream.setMatrixAt(i, temp.matrix);
    }
    stream.instanceMatrix.needsUpdate = true;
    waves.forEach((wave, i) => {
      const t = (phase + i / 3) % 1;
      wave.position.set(winds.position.x, 0.43 + t * 0.9, 0.48 + t * 0.7);
      wave.rotation.x = -0.7;
      wave.scale.setScalar(0.4 + t * 1.5);
      wave.material.opacity = pressure * (1-t) * 0.9;
    });
  };
}

function processor(group, palette) {
  group.rotation.set(-0.55, -0.28, -0.12);
  const board = palette.silicon;
  plate(group, palette.graphite, 3.75, 2.48, 0.25, 0, 0, -0.18);
  plate(group, board, 3.7, 2.44, 0.09, 0, 0, 0.01);
  const grid = new T.InstancedMesh(new T.BoxGeometry(0.091, 0.091, 0.07), new T.MeshStandardMaterial({metalness:0.42, roughness:0.36}), 256);
  const placement = new T.Object3D();
  const cellPosition = i => [-1.62 + i % 16 * 0.11, 0.85 - Math.floor(i / 16) * 0.11, 0.11];
  const quiet = new T.Color('#494457'), live = new T.Color('#e7b2ff'), fetched = new T.Color('#a59ac5');
  for (let i = 0; i < grid.count; i++) {
    placement.position.set(...cellPosition(i));
    placement.updateMatrix(); grid.setMatrixAt(i, placement.matrix); grid.setColorAt(i, quiet);
  }
  group.add(grid);
  const registerBits = [];
  for (let r = 0; r < 4; r++) {
    const y = 0.73 - r * 0.48;
    plate(group, palette.graphite, 1.18, 0.32, 0.1, 1.02, y, 0.13);
    for (let bit = 0; bit < 8; bit++) {
      const pin = plate(group, palette.unlit, 0.083, 0.16, 0.052, 0.57 + bit * 0.128, y, 0.2, 0.014);
      if (r === 0) registerBits.push(pin);
    }
  }
  const paths = instruction.map((_, i) => {
    const [x,y] = cellPosition(i);
    return trace(group, board, [[x,y,.17],[x,1.03,.24],[.26,1.03,.24],[.38,.82,.26],[.55+i*.12,.74,.27]]);
  });
  const byte = add(group, new T.IcosahedronGeometry(0.104, 1), palette.lilac);
  return p => {
    const phase = p * 3.55;
    const selected = Math.min(2, Math.floor(phase));
    const transfer = unit(phase - selected);
    group.rotation.y = -0.35 + p * 0.25;
    instruction.forEach((_, i) => grid.setColorAt(i, i === selected ? live : i < selected ? fetched : quiet));
    grid.instanceColor.needsUpdate = true;
    byte.position.copy(paths[selected].getPointAt(transfer));
    byte.scale.setScalar(0.45 + Math.sin(Math.PI * transfer) * 0.85);
    registerBits.forEach((bit, i) => {
      const on = phase >= 3 && (instruction[2] & (1 << (7 - i)));
      bit.material = on ? palette.lilac : palette.unlit;
      bit.scale.z = on ? 2 : 1;
    });
  };
}

function salaryBench(group, palette) {
  group.rotation.set(-0.11, -0.32, -0.04);
  const baseline = -1;
  plate(group, palette.graphite, 3.66, 0.13, 0.86, 0, baseline - 0.08, 0);
  plate(group, palette.teal, 3.6, 0.055, 0.82, 0, baseline, 0);
  const bars = sample.map((_,i) => plate(group, palette.teal, 0.147, 1, 0.35, (i-7.5)*0.21, 0, 0, 0.025));
  const line = plate(group, palette.amber, 3.61, 0.022, 0.029, 0, 0, 0.30, 0.01);
  const head = add(group, new T.SphereGeometry(0.055,16,12), palette.ivory, 1.81, 0, 0.3);
  const locks = Array.from({length:4}, (_,i) => plate(group, palette.silver, 0.38, 0.04, 0.08, -0.85 + i * 0.56, baseline - 0.06, 0.44));
  return p => {
    group.rotation.y = -0.38 + p * 0.23;
    bars.forEach((bar, i) => {
      const retained = membership(i, p);
      const height = 0.035 + retained * (sample[i][4] / 92000);
      bar.scale.y = height; bar.position.y = baseline + 0.04 + height / 2;
      bar.material = retained < 0.02 ? palette.graphite : palette.teal;
    });
    head.position.y = line.position.y = baseline + 0.075 + meanAt(p) / 92000;
    locks.forEach((lock,i) => { lock.material = p * 4 > i + 0.55 ? palette.mint : palette.silver; });
  };
}

export function createStudyRenderer(canvas) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0, 0);
  renderer.autoClear = false;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  const generator = new T.PMREMGenerator(renderer);
  const studio = new RoomEnvironment();
  const env = generator.fromScene(studio, 0.035);
  studio.dispose(); generator.dispose();
  const spun = toolmarks('spun'), etched = toolmarks('etched'), fluted = toolmarks('fluted');
  const palette = {
    spun, copper: metal('#c89065', spun), graphite: metal('#353644', etched, 0.65),
    silicon: metal('#827aa9', etched), teal: metal('#60a5a4', fluted),
    silver: metal('#a6a8ab', spun), black: new T.MeshStandardMaterial({color:'#16141a',roughness:0.7}),
    unlit: new T.MeshStandardMaterial({color: '#302a37', roughness: 0.89}),
    amber: lamp('#ffa358'), ivory: lamp('#fff2ce'), lilac: lamp('#d5a7ff'), mint: lamp('#a0ead9'),
  };
  const scene = new T.Scene();
  scene.environment = env.texture;
  const key = new T.DirectionalLight(0xffdfc7, 2.7);
  key.position.set(-3, 4, 6);
  const rim = new T.DirectionalLight(0xb9d9ff, 2.5);
  rim.position.set(4, 0, 1);
  scene.add(key, rim);
  const camera = new T.OrthographicCamera(-2, 2, 2, -2, 0.1, 25);
  camera.position.z = 8;
  const groups = [signature, harmonica, processor, salaryBench].map(build => {
    const group = new T.Group();
    const animate = build(group, palette);
    group.visible = false; scene.add(group);
    return { group, animate };
  });
  let w = 0, h = 0;
  return {
    paint(width, height, slots) {
      if (w !== width || h !== height) {
        renderer.setSize(width, height, false);
        w = width; h = height;
      }
      renderer.setScissorTest(false); renderer.clear();
      renderer.setScissorTest(true);
      for (const {index, x, y, width: sw, height: sh, progress} of slots) {
        const bottom = height - y - sh;
        renderer.setViewport(x, bottom, sw, sh);
        renderer.setScissor(x, bottom, sw, sh);
        const span = index === 0 ? 1.72 : 2.04;
        const aspect = sw / sh;
        camera.right = span * Math.max(1, aspect);
        camera.left = -camera.right;
        camera.top = span / Math.min(1, aspect);
        camera.bottom = -camera.top;
        camera.updateProjectionMatrix();
        const {group, animate} = groups[index];
        animate(progress); group.visible = true;
        renderer.render(scene, camera); group.visible = false;
      }
    },
    dispose() {
      const resources = new Set([spun, etched, fluted, ...Object.values(palette)]);
      scene.traverse(object => {
        if (object.geometry) resources.add(object.geometry);
        if (object.material) resources.add(object.material);
        if (object.isInstancedMesh) object.dispose();
      });
      for (const resource of resources) resource.dispose();
      env.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
