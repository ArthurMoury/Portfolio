import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { blend, options, leafPositions } from './studyMechanics';

const TAU = Math.PI * 2;
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
function curve(group, points, material, radius = 0.025) {
  const route = new T.CatmullRomCurve3(points.map(([x, y, z]) => new T.Vector3(x, y, z)));
  add(group, new T.TubeGeometry(route, 56, radius, 8, false), material);
  return route;
}

// Three strands share the same axis but meet at different points along the weave.
function weave(group, m) {
  for (let i = 0; i < 3; i++) {
    const points = Array.from({length: 93}, (_, k) => {
      const t = k / 92, a = t * TAU * 1.2 + i * TAU / 3;
      const r = 0.3 + 0.39 * Math.sin(t * Math.PI);
      return [(t - 0.5) * 3.4, Math.cos(a) * r, Math.sin(a) * r];
    });
    curve(group, points, [m.steel, m.carbon, m.pearl][i], 0.16);
  }
  group.rotation.z = 0.31;
  return p => { group.rotation.x = -0.6 + p * 2.5; group.rotation.y = 0.3 - p * 0.65; };
}

function nextToken(group, m) {
  const candidates = [];
  let origin = new T.Vector3(-1.65, -0.15, 0);
  const node = new T.IcosahedronGeometry(0.14, 1);
  add(group, node, m.pearl, ...origin.toArray());
  for (let step = 0; step < options.length; step++) {
    const next = [];
    for (let i = 0; i < 3; i++) {
      const x = origin.x + 1.07;
      const y = origin.y + (i - 1) * 0.86;
      const z = (1 - i) * 0.28;
      const path = curve(group, [origin.toArray(), [origin.x + 0.4, origin.y, origin.z], [x,y,z]], m.carbon);
      const end = add(group, node, m.steel, x, y, z);
      end.scale.setScalar([0.75, 1.25, 0.92][(i + step) % 3]);
      next.push({path, end});
    }
    candidates.push(next);
    origin = next[options[step]].end.position.clone();
  }
  const signal = add(group, new T.SphereGeometry(0.09, 20, 12), m.light);
  return p => {
    const cursor = Math.min(2.99999, p * 3), step = Math.floor(cursor);
    candidates.forEach((row, n) => row.forEach(({end}, i) => {
      end.material = n <= step && i === options[n] ? m.pearl : m.carbon;
    }));
    signal.position.copy(candidates[step][options[step]].path.getPointAt(cursor - step));
    group.rotation.set(-0.13, -0.35 + 0.62 * p, -0.07);
  };
}

function inscription(group, word, textures) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ink = canvas.getContext('2d');
  ink.fillStyle = '#e1e2e2'; ink.font = '64px monospace';
  ink.textAlign = 'center'; ink.textBaseline = 'middle'; ink.fillText(word, 256, 64);
  const texture = new T.CanvasTexture(canvas);
  textures.push(texture);
  return add(group, new T.PlaneGeometry(1.26, 0.315), new T.MeshBasicMaterial({
    map: texture, transparent: true, depthWrite: false, toneMapped: false,
  }), 0, 0, 0.094);
}

function normalization(group, m) {
  const tiles = ['“Recife”', '“recife”', '“ Recife ”'].map(word => {
    const tile = new T.Group();
    group.add(tile);
    plate(tile, m.ink, 1.53, 0.46, 0.18, 0, 0, 0);
    const input = inscription(tile, word, m.maps);
    const output = inscription(tile, 'recife', m.maps);
    return {tile,input,output};
  });
  return p => {
    const merge = blend((p - 0.28) / 0.72);
    tiles.forEach(({tile,input,output},i) => {
      const lane = i - 1;
      tile.position.set(-0.42 + p + lane * 0.4 * (1 - merge),
        lane * (1.02 - 0.87 * merge), lane * (0.05 + 0.22 * merge));
      tile.rotation.set(-0.13, lane * 0.35 * (1 - merge), lane * 0.11 * (1 - merge));
      input.visible = p < 0.27 + i * 0.09;
      output.visible = !input.visible;
    });
    group.rotation.set(-0.23, -0.28, 0.05);
  };
}

function componentTree(group, m) {
  const tiers = [[0],[-0.83,0.83],leafPositions];
  const tree = tiers.map((xs, level) => xs.map((x,i) => {
    const y = (1-level)*0.92;
    if(level) {
      const parent = tiers[level-1][Math.floor(i/2)];
      curve(group, [[parent,y+0.78,0],[parent,y+0.53,0],[x,y+0.34,0],[x,y+0.16,0]], m.steel, 0.023);
    }
    return plate(group, m.carbon, level===0?1.24:0.64, 0.37, 0.21, x, y, 0);
  }));
  return p => {
    const selected = Math.min(3, Math.floor(p*4));
    tree[0][0].material = m.steel;
    tree[1].forEach((node,i)=>{ node.material = i === Math.floor(selected/2) ? m.steel : m.carbon; });
    tree[2].forEach((node,i)=>{
      node.material = i === selected ? m.pearl : m.carbon;
      node.position.z = i === selected ? 0.15 + Math.sin((p*4 % 1)*Math.PI)*0.25 : 0;
    });
    group.rotation.set(-0.2, -0.42 + p*0.72, 0.03);
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
  const maps = [];
  const palette = {
    ink: new T.MeshStandardMaterial({color: 0x26272a, metalness: 0.17, roughness: 0.68}),
    maps, steel: metal('#929398', spun), carbon: metal('#494b50', etched, 0.64),
    pearl: metal('#e2e2df', fluted), light: new T.MeshBasicMaterial({color:'#ffffff'}),
  };
  const scene = new T.Scene();
  scene.environment = env.texture;
  const key = new T.DirectionalLight(0xffffff, 2.7);
  key.position.set(-3, 4, 6);
  const rim = new T.DirectionalLight(0xffffff, 2.5);
  rim.position.set(4, 0, 1);
  scene.add(key, rim);
  const camera = new T.OrthographicCamera(-2, 2, 2, -2, 0.1, 25);
  camera.position.z = 8;
  const groups = [weave, nextToken, normalization, componentTree].map(build => {
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
        const span = 2.04;
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
      const resources = new Set([spun, etched, fluted, ...maps]);
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
