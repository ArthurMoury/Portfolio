import * as T from 'three';

const planeVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const planeFragment = `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform vec2 uSize;
varying vec2 vUv;
void main() {
  float before = 1.0 - smoothstep(0.03, 0.25, uProgress);
  float after = smoothstep(0.76, 0.98, uProgress);
  vec3 color = (texture2D(uFrom, vUv).rgb * before + texture2D(uTo, vUv).rgb * after) / max(before + after, 0.001);
  vec2 corner = abs(vUv - 0.5) * uSize - (uSize * 0.5 - 8.0);
  float distance = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - 8.0;
  float rounded = 1.0 - smoothstep(-0.65, 0.65, distance);
  gl_FragColor = vec4(color, min(1.0, before + after) * rounded);
}`;

const particleVertex = `
uniform float uProgress;
uniform vec2 uSize;
uniform float uCell;
uniform float uRatio;
uniform float uCamera;
attribute vec2 aTarget;
attribute vec2 aSeed;
varying vec2 vFrom;
varying vec2 vTo;
varying float vEdge;
void main() {
  vFrom = position.xy + 0.5;
  vTo = aTarget;
  float begin = 0.02 + aSeed.x * 0.07 + vFrom.x * 0.10;
  float end = 0.80 + aSeed.y * 0.05 + vTo.x * 0.12;
  float phase = smoothstep(begin, end, uProgress);
  float arc = sin(phase * 3.14159265);
  vec2 xy = mix(position.xy, aTarget - 0.5, phase) * uSize;
  float angle = aSeed.x * 6.2831853 + phase * 2.4;
  xy.x += arc * uSize.x * (sin(angle) * 0.035 + (0.5 - vFrom.y) * 0.04);
  xy.y += arc * uSize.y * (cos(angle + aSeed.y) * 0.045 + (0.5 - vTo.x) * 0.06);
  float z = arc * (aSeed.y - 0.5) * 140.0;
  vec4 cameraPoint = modelViewMatrix * vec4(xy, z, 1.0);
  gl_Position = projectionMatrix * cameraPoint;
  gl_PointSize = clamp(uCell * uRatio * (1.03 + arc * 0.16) * uCamera / -cameraPoint.z, 1.0, 10.0);
  vec2 edge = abs(gl_Position.xy / gl_Position.w);
  vEdge = 1.0 - smoothstep(0.92, 1.0, max(edge.x, edge.y));
}`;

const particleFragment = `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
varying vec2 vFrom;
varying vec2 vTo;
varying float vEdge;
void main() {
  float circle = 1.0 - smoothstep(0.62, 1.0, length(gl_PointCoord - 0.5) * 2.0);
  float presence = smoothstep(0.0, 0.14, uProgress) * (1.0 - smoothstep(0.86, 1.0, uProgress));
  vec3 color = mix(texture2D(uFrom, vFrom).rgb, texture2D(uTo, vTo).rgb, smoothstep(0.16, 0.84, uProgress));
  gl_FragColor = vec4(color, circle * presence * vEdge);
}`;

function compose(chapter, image, brand) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image composition unavailable');
  ctx.fillStyle = chapter.background || '#17191b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const margin = chapter.fit === 'brand' ? .8 : 1;
  const ratio = (chapter.fit === 'cover' ? Math.max : Math.min)(canvas.width * margin / image.naturalWidth, canvas.height * margin / image.naturalHeight);
  const width = image.naturalWidth * ratio, height = image.naturalHeight * ratio;
  ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  if (brand) ctx.drawImage(brand, 1024 - 128, 26, 102, 102);
  const texture = new T.CanvasTexture(canvas);
  // These shaders operate directly on image colors, without lighting or tone mapping.
  texture.colorSpace = T.NoColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = T.LinearFilter;
  return texture;
}

export function createCareerParticles(canvas, chapters, images, brands) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(ratio);
  renderer.toneMapping = T.NoToneMapping;
  renderer.setClearColor(0, 0);
  renderer.debug.onShaderError = () => { throw new Error('Image morph shader unavailable'); };
  const textures = chapters.map((chapter, i) => compose(chapter, images[i], brands[i]));
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(45, 1, 1, 2400);
  camera.position.z = 1000;
  const compact = (navigator.hardwareConcurrency || 8) <= 4;
  const columns = compact ? 160 : 224, rows = compact ? 100 : 140;
  const count = columns * rows, positions = new Float32Array(count * 3);
  const targets = new Float32Array(count * 2), seeds = new Float32Array(count * 2);
  const random = n => { const v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); };
  for (let i = 0; i < count; i++) {
    const column = i % columns, row = Math.floor(i / columns);
    // Two reversible grid shears keep nearby pixels travelling in coherent
    // ribbons. Every destination pixel still has exactly one source particle.
    const targetRow = (row + Math.round(Math.sin(column / columns * Math.PI * 2) * rows * .14) + rows) % rows;
    const targetColumn = (column + Math.round(Math.sin(targetRow / rows * Math.PI * 2) * columns * .18) + columns) % columns;
    const target = targetRow * columns + targetColumn;
    positions[i * 3] = (i % columns + .5) / columns - .5;
    positions[i * 3 + 1] = (Math.floor(i / columns) + .5) / rows - .5;
    targets[i * 2] = (target % columns + .5) / columns;
    targets[i * 2 + 1] = (Math.floor(target / columns) + .5) / rows;
    seeds[i * 2] = random(i + 1); seeds[i * 2 + 1] = random(i + 71);
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
  geometry.setAttribute('aTarget', new T.BufferAttribute(targets, 2));
  geometry.setAttribute('aSeed', new T.BufferAttribute(seeds, 2));
  const uniforms = {
    uFrom: { value: textures[0] }, uTo: { value: textures[1] }, uProgress: { value: 0 },
    uSize: { value: new T.Vector2(1, 1) }, uCell: { value: 1 }, uRatio: { value: ratio }, uCamera: { value: 1000 },
  };
  const settings = { uniforms, transparent: true, depthWrite: false, depthTest: false, toneMapped: false };
  const particlesMaterial = new T.ShaderMaterial({ ...settings, vertexShader: particleVertex, fragmentShader: particleFragment });
  const planeMaterial = new T.ShaderMaterial({ ...settings, vertexShader: planeVertex, fragmentShader: planeFragment });
  const planeGeometry = new T.PlaneGeometry(1, 1);
  const plane = new T.Mesh(planeGeometry, planeMaterial), points = new T.Points(geometry, particlesMaterial);
  points.frustumCulled = false;
  plane.renderOrder = 0; points.renderOrder = 1;
  scene.add(plane, points);
  let width = 0, height = 0, surfaceWidth = 0, surfaceHeight = 0;
  return {
    count,
    draw(position, nextWidth, nextHeight, nextSurfaceWidth = nextWidth, nextSurfaceHeight = nextHeight) {
      if (width !== nextWidth || height !== nextHeight || surfaceWidth !== nextSurfaceWidth || surfaceHeight !== nextSurfaceHeight) {
        width = nextWidth; height = nextHeight;
        surfaceWidth = nextSurfaceWidth; surfaceHeight = nextSurfaceHeight;
        renderer.setSize(surfaceWidth, surfaceHeight, false);
        camera.aspect = surfaceWidth / surfaceHeight;
        camera.fov = T.MathUtils.radToDeg(2 * Math.atan(surfaceHeight / 2000));
        camera.updateProjectionMatrix();
        uniforms.uSize.value.set(width, height);
        uniforms.uCell.value = width / columns;
        plane.scale.set(width, height, 1);
      }
      const index = Math.min(chapters.length - 2, Math.max(0, Math.floor(position)));
      const progress = Math.max(0, Math.min(1, position - index));
      uniforms.uFrom.value = textures[index]; uniforms.uTo.value = textures[index + 1];
      uniforms.uProgress.value = progress;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose(); planeGeometry.dispose(); particlesMaterial.dispose(); planeMaterial.dispose();
      textures.forEach(texture => texture.dispose()); renderer.dispose();
    },
  };
}
