import * as T from 'three';
import { careerPlacement } from './careerFlow';

const planeVertex = `
uniform float uProgress;
uniform vec2 uFromCenter;
uniform vec2 uToCenter;
uniform vec2 uRoute;
uniform float uLift;
uniform vec2 uSize;
varying vec2 vUv;
varying vec2 vWorld;
void main() {
  vUv = uv;
  float route = smoothstep(uRoute.x, uRoute.y, uProgress);
  vec2 center = mix(uFromCenter, uToCenter, route);
  center.y += sin(route * 3.14159265) * uLift;
  vWorld = position.xy * uSize + center;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy * uSize + center, position.z, 1.0);
}`;

const planeFragment = `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform vec2 uSize;
uniform vec2 uPointer;
uniform float uHover;
varying vec2 vUv;
varying vec2 vWorld;
void main() {
  float before = 1.0 - smoothstep(0.03, 0.25, uProgress);
  float after = smoothstep(0.76, 0.98, uProgress);
  vec3 color = (texture2D(uFrom, vUv).rgb * before + texture2D(uTo, vUv).rgb * after) / max(before + after, 0.001);
  vec2 corner = abs(vUv - 0.5) * uSize - (uSize * 0.5 - 8.0);
  float distance = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - 8.0;
  float rounded = 1.0 - smoothstep(-0.65, 0.65, distance);
  float touch = (1.0 - smoothstep(0.0, 140.0, length(vWorld - uPointer))) * uHover;
  gl_FragColor = vec4(color, min(1.0, before + after) * rounded * (1.0 - touch));
}`;

const particleVertex = `
uniform float uProgress;
uniform vec2 uSize;
uniform float uCell;
uniform float uRatio;
uniform float uCamera;
uniform vec2 uFromCenter;
uniform vec2 uToCenter;
uniform vec2 uRoute;
uniform float uLift;
uniform float uScatter;
uniform vec2 uPointer;
uniform float uHover;
uniform float uTime;
attribute vec2 aTarget;
attribute vec2 aSeed;
varying vec2 vFrom;
varying vec2 vTo;
varying float vEdge;
varying float vTouch;
void main() {
  vFrom = position.xy + 0.5;
  vTo = aTarget;
  float begin = 0.02 + aSeed.x * 0.07 + vFrom.x * 0.10;
  float end = 0.80 + aSeed.y * 0.05 + vTo.x * 0.12;
  float phase = smoothstep(begin, end, uProgress);
  float arc = sin(phase * 3.14159265);
  vec2 xy = mix(position.xy, aTarget - 0.5, phase) * uSize;
  float angle = aSeed.x * 6.2831853 + phase * 2.4;
  xy.x += arc * uSize.x * ((sin(angle) * 0.035 + (0.5 - vFrom.y) * 0.04) * uScatter);
  xy.y += arc * uSize.y * ((cos(angle + aSeed.y) * 0.045 + (0.5 - vTo.x) * 0.06) * uScatter);
  float route = smoothstep(uRoute.x, uRoute.y, uProgress);
  vec2 center = mix(uFromCenter, uToCenter, route);
  center.y += sin(route * 3.14159265) * uLift;
  xy += center;
  vec2 delta = xy - uPointer;
  vTouch = (1.0 - smoothstep(0.0, 140.0, length(delta))) * uHover;
  vec2 direction = normalize(delta + vec2(0.01));
  xy += (direction * (22.0 + sin(uTime * 2.5 + aSeed.x * 6.283) * 8.0)
    + vec2(-direction.y, direction.x) * sin(uTime * 1.8 + aSeed.y * 6.283) * 15.0) * vTouch;
  float z = arc * (aSeed.y - 0.5) * 140.0 * uScatter;
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
varying float vTouch;
void main() {
  float circle = 1.0 - smoothstep(0.62, 1.0, length(gl_PointCoord - 0.5) * 2.0);
  float presence = smoothstep(0.0, 0.14, uProgress) * (1.0 - smoothstep(0.86, 1.0, uProgress));
  vec4 ink = mix(texture2D(uFrom, vFrom), texture2D(uTo, vTo), smoothstep(0.16, 0.84, uProgress));
  gl_FragColor = vec4(ink.rgb, circle * max(presence, vTouch) * vEdge * ink.a);
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

export function createCareerParticles(canvas, chapters, images, brands, textFrames) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(ratio);
  renderer.toneMapping = T.NoToneMapping;
  renderer.setClearColor(0, 0);
  renderer.debug.onShaderError = () => { throw new Error('Image morph shader unavailable'); };
  const textures = chapters.map((chapter, i) => compose(chapter, images[i], brands[i]));
  const textTextures = textFrames.map(frame => {
    const texture = new T.CanvasTexture(frame.canvas);
    texture.colorSpace = T.NoColorSpace; texture.generateMipmaps = false; texture.minFilter = T.LinearFilter;
    return texture;
  });
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
  const makeUniforms = (size, route, scatter) => ({
    uFrom: { value: textures[0] }, uTo: { value: textures[1] }, uProgress: { value: 0 },
    uSize: { value: new T.Vector2(1, 1) }, uCell: { value: size }, uRatio: { value: ratio }, uCamera: { value: 1000 },
    uFromCenter: { value: new T.Vector2() }, uToCenter: { value: new T.Vector2() },
    uRoute: { value: new T.Vector2(...route) }, uLift: { value: 0 }, uScatter: { value: scatter },
    uPointer: { value: new T.Vector2(-10000, -10000) }, uHover: { value: 0 }, uTime: { value: 0 },
  });
  const imageUniforms = makeUniforms(1, [.08, .92], 1), textUniforms = makeUniforms(1.75, [.02, .82], .55);
  const material = (uniforms, vertexShader, fragmentShader) => new T.ShaderMaterial({
    uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, depthTest: false, toneMapped: false,
  });
  const particlesMaterial = material(imageUniforms, particleVertex, particleFragment);
  const textMaterial = material(textUniforms, particleVertex, particleFragment);
  const planeMaterial = material(imageUniforms, planeVertex, planeFragment);
  const planeGeometry = new T.PlaneGeometry(1, 1);
  const plane = new T.Mesh(planeGeometry, planeMaterial), points = new T.Points(geometry, particlesMaterial);
  const textCount = compact ? 8000 : 12000;
  const textGeometries = textFrames.slice(0, -1).map((frame, index) => {
    const a = frame.points, b = textFrames[index + 1].points;
    if (!a.length || !b.length) throw new Error('Empty text image');
    const pos = new Float32Array(textCount * 3), target = new Float32Array(textCount * 2), seed = new Float32Array(textCount * 2);
    for (let j = 0; j < textCount; j++) {
      const from = a[Math.floor(j / textCount * a.length)], to = b[Math.floor(j / textCount * b.length)];
      pos[j * 3] = from[0] - .5; pos[j * 3 + 1] = from[1] - .5;
      target[j * 2] = to[0]; target[j * 2 + 1] = to[1];
      seed[j * 2] = random(j + 57); seed[j * 2 + 1] = random(j + 143);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aTarget', new T.BufferAttribute(target, 2));
    g.setAttribute('aSeed', new T.BufferAttribute(seed, 2));
    return g;
  });
  const textPoints = new T.Points(textGeometries[0], textMaterial);
  points.frustumCulled = false; textPoints.frustumCulled = false;
  plane.renderOrder = 0; points.renderOrder = 1; textPoints.renderOrder = 2;
  scene.add(plane, points, textPoints);
  let surfaceWidth = 0, surfaceHeight = 0;
  return {
    count, textCount,
    draw(frame, layout, interaction = { x: -10000, y: -10000, strength: 0, time: 0 }) {
      const { width, height, imageWidth, imageHeight, textWidth } = layout;
      if (surfaceWidth !== layout.surfaceWidth || surfaceHeight !== layout.surfaceHeight) {
        surfaceWidth = layout.surfaceWidth; surfaceHeight = layout.surfaceHeight;
        renderer.setSize(surfaceWidth, surfaceHeight, false);
        camera.aspect = surfaceWidth / surfaceHeight;
        camera.fov = T.MathUtils.radToDeg(2 * Math.atan(surfaceHeight / 2000));
        camera.updateProjectionMatrix();
      }
      const { index, phase } = frame, placement = careerPlacement(index, phase, layout);
      const configure = (u, from, to, textureA, textureB, w, h, lift) => {
        u.uFrom.value = textureA; u.uTo.value = textureB; u.uProgress.value = phase;
        u.uSize.value.set(w, h); u.uLift.value = lift;
        u.uPointer.value.set(interaction.x - width / 2, height / 2 - interaction.y);
        u.uHover.value = interaction.strength; u.uTime.value = interaction.time;
        u.uFromCenter.value.set(from.x - width / 2, height / 2 - from.y);
        u.uToCenter.value.set(to.x - width / 2, height / 2 - to.y);
      };
      configure(imageUniforms, placement.imageFrom, placement.imageTo, textures[index], textures[index + 1], imageWidth, imageHeight, -height * .10);
      configure(textUniforms, placement.textFrom, placement.textTo, textTextures[index], textTextures[index + 1], textWidth, height, height * .10);
      imageUniforms.uCell.value = imageWidth / columns;
      textPoints.geometry = textGeometries[index];
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose(); planeGeometry.dispose(); textGeometries.forEach(g => g.dispose());
      particlesMaterial.dispose(); textMaterial.dispose(); planeMaterial.dispose();
      [...textures, ...textTextures].forEach(texture => texture.dispose()); renderer.dispose();
    },
  };
}
