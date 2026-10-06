import * as THREE from 'three';

/* ---------- Environment ---------- */
const isMobile = window.matchMedia('(max-width: 768px)').matches || /Mobi|Android|iPhone/i.test(navigator.userAgent);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.getElementById('loader');
const canvas = document.getElementById('scene');

let loaderHidden = false;
function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  loader.classList.add('done');
  setTimeout(() => loader.remove(), 1200);
}
setTimeout(hideLoader, 6000); // safety net

/* ---------- UI (works without WebGL) ---------- */
function initUI() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal, .chart').forEach((el) => io.observe(el));

  const dots = [...document.querySelectorAll('.dots a')];
  const dotIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) dots.forEach((d) => d.classList.toggle('active', d.dataset.dot === e.target.id));
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  document.querySelectorAll('main > section').forEach((s) => dotIO.observe(s));
}

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch (e) { return false; }
}


/* ---------- Helpers ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function glowTexture(inner = 'rgba(255,255,255,1)', mid = 'rgba(255,200,120,0.35)') {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner); grd.addColorStop(0.25, mid); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function rayTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 32;
  const g = c.getContext('2d');
  const h = g.createLinearGradient(0, 0, 256, 0);
  h.addColorStop(0, 'rgba(255,220,150,0.9)'); h.addColorStop(1, 'rgba(255,180,90,0)');
  g.fillStyle = h; g.fillRect(0, 0, 256, 32);
  const v = g.createLinearGradient(0, 0, 0, 32);
  v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = v; g.fillRect(0, 0, 256, 32);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function panelTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = '#0a1a3f'; g.fillRect(0, 0, 128, 96);
  g.strokeStyle = '#6fa8ff'; g.lineWidth = 2;
  for (let x = 0; x <= 128; x += 21.33) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 96); g.stroke(); }
  for (let y = 0; y <= 96; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); }
  g.strokeStyle = '#c9d6ea'; g.lineWidth = 5; g.strokeRect(0, 0, 128, 96);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- Scene ---------- */
function initScene() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: 'high-performance' });
  const maxDPR = isMobile ? 1.25 : 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1a2050, 60, 230);
  const camera = new THREE.PerspectiveCamera(isMobile ? 55 : 42, window.innerWidth / window.innerHeight, 0.1, 900);

  /* Sky dome */
  const skyUniforms = {
    topColor: { value: new THREE.Color() }, midColor: { value: new THREE.Color() },
    horizonColor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3(0, 0.1, -1) },
    sunGlow: { value: 1.0 }
  };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(500, 32, 16),
    new THREE.ShaderMaterial({
      uniforms: skyUniforms, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 topColor; uniform vec3 midColor; uniform vec3 horizonColor; uniform vec3 sunDir; uniform float sunGlow; varying vec3 vDir;
        void main(){
          float h = vDir.y;
          vec3 col = mix(horizonColor, midColor, smoothstep(-0.05, 0.22, h));
          col = mix(col, topColor, smoothstep(0.18, 0.75, h));
          float s = max(dot(normalize(vDir), normalize(sunDir)), 0.0);
          col += vec3(1.0,0.62,0.3) * pow(s, 8.0) * 0.55 * sunGlow;
          col += vec3(1.0,0.85,0.6) * pow(s, 64.0) * 0.6 * sunGlow;
          gl_FragColor = vec4(col, 1.0);
        }`
    })
  );
  scene.add(sky);

  /* Stars */
  const starCount = isMobile ? 350 : 900;
  const starPos = new Float32Array(starCount * 3);
  const r1 = rng(7);
  for (let i = 0; i < starCount; i++) {
    const th = r1() * Math.PI * 2, ph = Math.acos(lerp(0.08, 1, r1()));
    starPos.set([Math.sin(ph) * Math.cos(th) * 420, Math.cos(ph) * 420, Math.sin(ph) * Math.sin(th) * 420], i * 3);
  }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: isMobile ? 2.2 : 1.8, sizeAttenuation: false, color: 0xdfe8ff, transparent: true, opacity: 0, depthWrite: false, fog: false });
  scene.add(new THREE.Points(starGeo, starMat));

  /* Lights */
  const hemi = new THREE.HemisphereLight(0x8fa6ff, 0x2a1c2e, 0.6); scene.add(hemi);
  const sunLight = new THREE.DirectionalLight(0xffc48a, 2.2);
  sunLight.castShadow = !isMobile;
  sunLight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunLight.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 });
  sunLight.shadow.bias = -0.0008;
  scene.add(sunLight); scene.add(sunLight.target);
  const fill = new THREE.DirectionalLight(0xffe2c4, 0.8); fill.position.set(12, 18, 40); scene.add(fill);
  const homeGlow = new THREE.PointLight(0xffb15c, 0, 12, 1.4); homeGlow.position.set(0, 3, 5.5); scene.add(homeGlow);

  /* Sun */
  const sunGroup = new THREE.Group(); scene.add(sunGroup);
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(9, 32, 16), new THREE.MeshBasicMaterial({ color: 0xffe2a0, fog: false, toneMapped: false }));
  sunGroup.add(sunCore);
  const glowTex = glowTexture();
  const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffb460, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  sunHalo.scale.set(90, 90, 1); sunGroup.add(sunHalo);
  const sunHalo2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff7a3d, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  sunHalo2.scale.set(220, 220, 1); sunGroup.add(sunHalo2);
  // light rays
  const rays = new THREE.Group(); sunGroup.add(rays);
  const rayMatBase = new THREE.MeshBasicMaterial({ map: rayTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const rayCount = isMobile ? 8 : 14;
  for (let i = 0; i < rayCount; i++) {
    const len = 120 + (i % 3) * 50;
    const g = new THREE.PlaneGeometry(len, 6 + (i % 4) * 3); g.translate(len / 2, 0, 0);
    const m = new THREE.Mesh(g, rayMatBase.clone());
    m.rotation.z = (i / rayCount) * Math.PI * 2;
    m.userData.base = m.rotation.z; m.userData.speed = 0.02 + (i % 5) * 0.006;
    rays.add(m);
  }

  /* Ground */
  const groundGeo = new THREE.PlaneGeometry(520, 520, isMobile ? 50 : 80, isMobile ? 50 : 80);
  groundGeo.rotateX(-Math.PI / 2);
  const gp = groundGeo.attributes.position; const r2 = rng(42);
  for (let i = 0; i < gp.count; i++) {
    const x = gp.getX(i), z = gp.getZ(i); const d = Math.hypot(x, z);
    const hills = d > 45 ? (Math.sin(x * 0.04) * Math.cos(z * 0.05) * 5 + r2() * 1.6) * smooth(clamp((d - 45) / 60, 0, 1)) : 0;
    gp.setY(i, hills + (d > 140 ? (d - 140) * 0.12 : 0));
  }
  groundGeo.computeVertexNormals();
  const ground = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x2c4a3a, roughness: 1, flatShading: true }));
  ground.receiveShadow = true; scene.add(ground);
  // street
  const road = new THREE.Mesh(new THREE.PlaneGeometry(220, 7), new THREE.MeshStandardMaterial({ color: 0x1b1f2b, roughness: 0.9 }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0.03, 13); road.receiveShadow = true; scene.add(road);
  const road2 = road.clone(); road2.position.z = -22; scene.add(road2);
  const drive = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 6), new THREE.MeshStandardMaterial({ color: 0x8c8a86, roughness: 0.9 }));
  drive.rotation.x = -Math.PI / 2; drive.position.set(-2.4, 0.04, 6.6); scene.add(drive);
  // lane dashes
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xe8d9a8 });
  for (let x = -100; x <= 100; x += 6) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.18), dashMat); d.rotation.x = -Math.PI / 2; d.position.set(x, 0.05, 13); scene.add(d);
  }

  /* House builder */
  const ownWinMat = new THREE.MeshStandardMaterial({ color: 0x2a2416, emissive: 0xffc070, emissiveIntensity: 0.6 });
  const neighborWinMat = new THREE.MeshStandardMaterial({ color: 0x1e2230, emissive: 0xffc878, emissiveIntensity: 0 });
  const windowGeo = new THREE.PlaneGeometry(1, 1);

  function makeHouse({ w = 8, h = 4, d = 6, roofH = 2.6, wall = 0xe9e1d3, roof = 0x3a3f55, winMat }) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: wall, roughness: 0.85, flatShading: true }));
    body.position.y = h / 2; body.castShadow = body.receiveShadow = true; g.add(body);
    const half = d / 2 + 0.5;
    const shape = new THREE.Shape([new THREE.Vector2(-half, 0), new THREE.Vector2(half, 0), new THREE.Vector2(0, roofH)]);
    const roofGeo = new THREE.ExtrudeGeometry(shape, { depth: w + 0.8, bevelEnabled: false });
    roofGeo.translate(0, 0, -(w + 0.8) / 2); roofGeo.rotateY(Math.PI / 2);
    const roofMesh = new THREE.Mesh(roofGeo, new THREE.MeshStandardMaterial({ color: roof, roughness: 0.75, flatShading: true }));
    roofMesh.position.y = h; roofMesh.castShadow = true; roofMesh.receiveShadow = true; g.add(roofMesh);
    // windows (front + sides)
    const cols = Math.max(2, Math.round(w / 3));
    for (let i = 0; i < cols; i++) {
      const x = -w / 2 + (w / (cols + 1)) * (i + 1);
      if (cols >= 3 && i === Math.floor(cols / 2)) continue; // door slot
      const win = new THREE.Mesh(windowGeo, winMat); win.scale.set(1.2, 1.1, 1); win.position.set(x, h * 0.55, d / 2 + 0.02); g.add(win);
    }
    const back = new THREE.Mesh(windowGeo, winMat); back.scale.set(1.4, 1.1, 1); back.position.set(0, h * 0.55, -d / 2 - 0.02); back.rotation.y = Math.PI; g.add(back);
    const side = new THREE.Mesh(windowGeo, winMat); side.scale.set(1.2, 1.1, 1); side.position.set(-w / 2 - 0.02, h * 0.55, 0); side.rotation.y = -Math.PI / 2; g.add(side);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2), new THREE.MeshStandardMaterial({ color: 0x5b3a2a, roughness: 0.8 }));
    door.position.set(cols >= 3 ? -w / 2 + (w / (cols + 1)) * (Math.floor(cols / 2) + 1) : 0, 1, d / 2 + 0.02); g.add(door);
    g.userData = { w, h, d, roofH, half };
    return g;
  }

  /* Hero house */
  const house = makeHouse({ w: 9, h: 4, d: 6.4, roofH: 2.8, wall: 0xf1e8da, roof: 0x2f3550, winMat: ownWinMat });
  scene.add(house);
  const { h: HH, half: HALF, roofH: RH } = house.userData;
  const slope = Math.atan2(RH, HALF);
  // solar panels on front slope
  const panelTex = panelTexture();
  const panelMats = [];
  const panelGroup = new THREE.Group();
  panelGroup.position.set(0, HH + RH / 2, HALF / 2);
  panelGroup.rotation.x = slope;
  panelGroup.translateY(0.12);
  house.add(panelGroup);
  const slopeLen = Math.hypot(RH, HALF);
  const pCols = 5, pRows = 2, pw = 1.45, pd = (slopeLen - 0.9) / pRows - 0.12;
  const panelWorldPts = [];
  for (let r = 0; r < pRows; r++) for (let c = 0; c < pCols; c++) {
    const m = new THREE.MeshStandardMaterial({ map: panelTex, color: 0x9fb6e0, metalness: 0.55, roughness: 0.28, emissive: 0x4aa8ff, emissiveMap: panelTex, emissiveIntensity: 0 });
    m.userData.phase = c * 0.6 + r * 1.1;
    panelMats.push(m);
    const p = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.08, pd), m);
    p.position.set((c - (pCols - 1) / 2) * (pw + 0.12), 0, (r - (pRows - 1) / 2) * (pd + 0.12));
    p.castShadow = true; panelGroup.add(p);
  }
  // battery on right wall
  const battery = new THREE.Group();
  const battBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 1.1), new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.4 }));
  battery.add(battBody);
  const battStripMat = new THREE.MeshBasicMaterial({ color: 0x7dffb2, transparent: true, opacity: 0.6 });
  const battStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 1.3), battStripMat); battStrip.rotation.y = Math.PI / 2; battStrip.position.x = 0.26; battery.add(battStrip);
  const battGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x7dffb2, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  battGlow.scale.set(5, 5, 1); battGlow.position.x = 0.4; battery.add(battGlow);
  battery.position.set(4.5 + 0.26, 1.1, 1.6); house.add(battery);
  // warm glow sprite in front of house (for blackout)
  const porchGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffb860, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  porchGlow.scale.set(22, 14, 1); porchGlow.position.set(0, 2.6, 3.6); house.add(porchGlow);

  /* Neighborhood */
  const r3 = rng(99);
  const wallColors = [0xd9cbb8, 0xc8d3dc, 0xe4d6c4, 0xbfc9b8, 0xdcc6c0, 0xcfd1d8];
  const roofColors = [0x47394a, 0x3c4658, 0x5a4136, 0x3a4a46, 0x4b4b5e];
  const neighborSpots = [
    [-16, 0, 0], [16, 0, 0], [-31, 0, 1], [31, 0, -1], [-46, 0, 0], [46, 0, 1],
    [-27, 0, 29, Math.PI], [27, 0, 29, Math.PI],
    [-12, 0, -36], [10, 0, -36], [-30, 0, -36], [30, 0, -37], [-44, 0, 29, Math.PI], [45, 0, 29, Math.PI]
  ];
  const nCount = isMobile ? 10 : neighborSpots.length;
  for (let i = 0; i < nCount; i++) {
    const [x, y, z, ry = 0] = neighborSpots[i];
    const nh = makeHouse({ w: 7 + r3() * 2.5, h: 3.4 + r3() * 1, d: 5.6 + r3() * 1, roofH: 2 + r3() * 1, wall: wallColors[i % wallColors.length], roof: roofColors[i % roofColors.length], winMat: neighborWinMat });
    nh.position.set(x, y, z); nh.rotation.y = ry; scene.add(nh);
  }
  // streetlights
  const lampMat = new THREE.MeshStandardMaterial({ color: 0x30333f, roughness: 0.6 });
  const lampBulbMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
  const lampGlows = [];
  for (let x = -40; x <= 40; x += 20) {
    if (x === 0) continue;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.5, 6), lampMat); post.position.set(x, 2.25, 9.7); scene.add(post);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), lampBulbMat); bulb.position.set(x, 4.5, 9.7); scene.add(bulb);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffc070, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.set(5, 5, 1); glow.position.copy(bulb.position); scene.add(glow); lampGlows.push({ glow, bulb });
  }
  // trees
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3426, roughness: 1, flatShading: true });
  const leafMats = [0x2f6b4a, 0x3d7a4f, 0x285c45].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1, flatShading: true }));
  const treeCount = isMobile ? 26 : 60;
  const r4 = rng(3);
  for (let i = 0; i < treeCount; i++) {
    let x, z, tries = 0;
    do { x = (r4() - 0.5) * 140; z = (r4() - 0.5) * 120; tries++; }
    while (tries < 30 && (Math.abs(z - 13) < 5 || Math.abs(z + 22) < 5 || neighborSpots.some(([nx, , nz]) => Math.abs(nx - x) < 6.5 && Math.abs(nz - z) < 5.5) || (Math.abs(x) < 9 && Math.abs(z) < 9)));
    const s = 0.8 + r4() * 0.9;
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.4, 5), trunkMat); trunk.position.y = 0.7; t.add(trunk);
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.4, 6), leafMats[i % 3]); leaf.position.y = 2.9; leaf.castShadow = true; t.add(leaf);
    const leaf2 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.4, 6), leafMats[(i + 1) % 3]); leaf2.position.y = 4.1; t.add(leaf2);
    t.position.set(x, 0, z); t.scale.setScalar(s); t.rotation.y = r4() * 6; scene.add(t);
  }

  /* Energy flow particles: panels -> down wall -> battery -> into home */
  house.updateMatrixWorld(true);
  const curves = [];
  for (let c = 0; c < pCols; c++) {
    const a = new THREE.Vector3((c - (pCols - 1) / 2) * (pw + 0.12), 0.1, -(pd + 0.12) / 2);
    const b = new THREE.Vector3((c - (pCols - 1) / 2) * (pw + 0.12), 0.1, (pd + 0.12) / 2 + 0.3);
    panelGroup.localToWorld(a); panelGroup.localToWorld(b);
    curves.push(new THREE.CatmullRomCurve3([
      a, b,
      new THREE.Vector3(lerp(b.x, 4.4, 0.6), HH - 0.2, HALF - 0.2),
      new THREE.Vector3(4.9, 2.8, 2.4),
      new THREE.Vector3(5.0, 1.4, 1.7),
      new THREE.Vector3(4.2, 1.5, 3.7),
      new THREE.Vector3(1.6, 1.8, 3.8),
      new THREE.Vector3(0.0, 1.4, 3.0)
    ]));
  }
  const dotTex = glowTexture('rgba(255,255,255,1)', 'rgba(255,230,160,0.5)');
  const flowCount = isMobile ? 160 : 420;
  const flowGeo = new THREE.BufferGeometry();
  const flowPos = new Float32Array(flowCount * 3); const flowSeed = new Float32Array(flowCount * 3);
  for (let i = 0; i < flowCount; i++) flowSeed.set([Math.random(), Math.random() - 0.5, Math.random() - 0.5], i * 3);
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  const flowMat = new THREE.PointsMaterial({ map: dotTex, size: isMobile ? 0.55 : 0.45, color: 0xffd98a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const flow = new THREE.Points(flowGeo, flowMat); flow.frustumCulled = false; scene.add(flow);

  // incoming sunlight "photons" onto panels
  const photonCount = isMobile ? 70 : 180;
  const photonGeo = new THREE.BufferGeometry();
  const photonPos = new Float32Array(photonCount * 3); const photonSeed = new Float32Array(photonCount * 3);
  for (let i = 0; i < photonCount; i++) photonSeed.set([Math.random(), (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 2.5], i * 3);
  photonGeo.setAttribute('position', new THREE.BufferAttribute(photonPos, 3));
  const photonMat = new THREE.PointsMaterial({ map: dotTex, size: 0.35, color: 0xfff0c0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const photons = new THREE.Points(photonGeo, photonMat); photons.frustumCulled = false; scene.add(photons);
  const panelCenter = new THREE.Vector3(); panelGroup.getWorldPosition(panelCenter);

  // ambient dust motes
  const dustCount = isMobile ? 220 : 650;
  const dustGeo = new THREE.BufferGeometry(); const dustPos = new Float32Array(dustCount * 3); const dustBase = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) dustBase.set([(Math.random() - 0.5) * 70, Math.random() * 22, (Math.random() - 0.5) * 60], i * 3);
  dustPos.set(dustBase); dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ map: dotTex, size: 0.22, color: 0xffd8a8, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
  const dust = new THREE.Points(dustGeo, dustMat); dust.frustumCulled = false; scene.add(dust);

  /* ---------- Scroll-driven states ---------- */
  // cam, look, dawn (sun height / sky), charge (panel glow), flow (energy), dark (blackout)
  const STATES = {
    hero:     { cam: [13, 5, 22],     look: [-4.5, 4.6, 0],   dawn: 0.55, charge: 0.25, flow: 0.15, dark: 0 },
    rate:     { cam: [-19, 8, 17],    look: [3, 3.6, -2],  dawn: 0.78, charge: 0.4,  flow: 0.25, dark: 0 },
    reliable: { cam: [9, 11.5, 12],   look: [0.5, 4.2, 1], dawn: 1.0,  charge: 1.0,  flow: 1.0,  dark: 0 },
    backup:   { cam: [-24, 15, 33],   look: [2, 1.5, 2],   dawn: 0.0,  charge: 0.0,  flow: 0.0,  dark: 1 },
    how:      { cam: [14, 26, 30],    look: [1, -4, 10],   dawn: 0.88, charge: 0.75, flow: 0.6,  dark: 0 },
    horace:   { cam: [-16, 4, 24],    look: [2, 4, 0],    dawn: 0.94, charge: 0.6,  flow: 0.35, dark: 0 },
    quote:    { cam: [9, 2.0, 34],    look: [-10, 30, -60],  dawn: 1.0,  charge: 0.9,  flow: 0.5,  dark: 0 }
  };
  if (isMobile) { // pull back so the house frames above the bottom-aligned cards
    for (const k in STATES) { const s = STATES[k]; s.cam = [s.cam[0] * 1.15, s.cam[1] * 1.1 + 3, s.cam[2] * 1.15]; s.look = [s.look[0], s.look[1] - 2.5, s.look[2]]; }
  }
  if (isMobile) { STATES.backup.look = [2, -4.5, 2]; STATES.reliable.look = [0.5, 2.2, 1]; }
  const sections = [...document.querySelectorAll('[data-scene]')];
  let centers = [];
  function measure() { centers = sections.map((s) => { const r = s.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2; }); }
  measure();

  const keys = ['dawn', 'charge', 'flow', 'dark'];
  function targetState() {
    const anchor = window.scrollY + window.innerHeight / 2;
    let i = 0;
    while (i < centers.length - 1 && anchor > centers[i + 1]) i++;
    const j = Math.min(i + 1, centers.length - 1);
    const t = j === i ? 0 : smooth(clamp((anchor - centers[i]) / (centers[j] - centers[i]), 0, 1));
    const A = STATES[sections[i].dataset.scene], B = STATES[sections[j].dataset.scene];
    const out = { cam: A.cam.map((v, k) => lerp(v, B.cam[k], t)), look: A.look.map((v, k) => lerp(v, B.look[k], t)) };
    keys.forEach((k) => (out[k] = lerp(A[k], B[k], t)));
    return out;
  }
  const cur = JSON.parse(JSON.stringify(targetState()));

  /* Mouse parallax */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (e) => { mouse.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.y = (e.clientY / window.innerHeight) * 2 - 1; }, { passive: true });
  }

  /* Colors */
  const C = (h) => new THREE.Color(h);
  const NIGHT = { top: C(0x02050f), mid: C(0x07112b), hor: C(0x142348) };
  const DAWN = { top: C(0x0b1640), mid: C(0x3b2a7a), hor: C(0xff7a3d) };
  const DAY = { top: C(0x1c3f7a), mid: C(0x6b6fb0), hor: C(0xffc06a) };
  const tmpA = new THREE.Color(), tmpB = new THREE.Color(), tmpC = new THREE.Color();
  function skyColor(set, d, out) {
    if (d < 0.5) return out.copy(NIGHT[set]).lerp(DAWN[set], d / 0.5);
    return out.copy(DAWN[set]).lerp(DAY[set], (d - 0.5) / 0.5);
  }
  const sunColLow = C(0xff8a3d), sunColHigh = C(0xfff0d0);
  const groundDay = C(0x3b5e45), groundNight = C(0x16222a);

  /* ---------- Frame ---------- */
  const clock = new THREE.Clock();
  let intro = reduceMotion ? 1 : 0;
  let time = 0;
  const v3 = new THREE.Vector3();

  function update(dt) {
    const T = targetState();
    const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 3.2);
    for (let i = 0; i < 3; i++) { cur.cam[i] = lerp(cur.cam[i], T.cam[i], k); cur.look[i] = lerp(cur.look[i], T.look[i], k); }
    keys.forEach((key) => (cur[key] = lerp(cur[key], T[key], k)));

    if (!reduceMotion) intro = Math.min(1, intro + dt / 3.2);
    const ie = 1 - Math.pow(1 - intro, 3);
    const dawn = lerp(0.04, cur.dawn, ie);
    const night = clamp(1 - dawn * 1.7, 0, 1);
    const dark = cur.dark;

    // camera + parallax
    mouse.sx = lerp(mouse.sx, mouse.x, 1 - Math.exp(-dt * 2.5));
    mouse.sy = lerp(mouse.sy, mouse.y, 1 - Math.exp(-dt * 2.5));
    const introPush = (1 - ie) * 6;
    camera.position.set(cur.cam[0] + mouse.sx * 1.6, cur.cam[1] - mouse.sy * 0.8 - introPush * 0.3, cur.cam[2] + introPush);
    camera.lookAt(cur.look[0], cur.look[1], cur.look[2]);

    // sun
    const sunY = lerp(-14, 52, dawn);
    sunGroup.position.set(-38, sunY, -170);
    v3.copy(sunGroup.position).normalize();
    skyUniforms.sunDir.value.copy(v3);
    skyUniforms.sunGlow.value = clamp(dawn * 1.6, 0, 1);
    sunLight.position.copy(v3).multiplyScalar(80); sunLight.position.y = Math.max(sunLight.position.y, 6);
    sunLight.intensity = lerp(0.05, 2.6, smooth(clamp(dawn * 1.4, 0, 1)));
    sunLight.color.copy(sunColLow).lerp(sunColHigh, clamp((dawn - 0.4) / 0.6, 0, 1));
    sunCore.material.color.copy(sunColLow).lerp(sunColHigh, clamp(dawn, 0, 1));
    sunHalo.material.opacity = clamp(dawn * 1.5, 0, 1);
    sunHalo2.material.opacity = clamp(dawn * 1.2, 0, 1) * 0.55;
    rays.lookAt(camera.position);
    rays.children.forEach((m, i) => {
      m.rotation.z = m.userData.base + time * m.userData.speed;
      m.material.opacity = (0.16 + 0.1 * Math.sin(time * 0.7 + i * 1.7)) * clamp(dawn * 1.4, 0, 1);
    });

    // sky + fog + ambient
    skyColor('top', dawn, skyUniforms.topColor.value);
    skyColor('mid', dawn, skyUniforms.midColor.value);
    skyColor('hor', dawn, skyUniforms.horizonColor.value);
    scene.fog.color.copy(skyUniforms.horizonColor.value).lerp(skyUniforms.midColor.value, 0.35);
    hemi.intensity = lerp(0.35, 1.0, dawn);
    hemi.color.copy(tmpA.set(0x4a5aa8)).lerp(tmpB.set(0xbfd0ff), dawn);
    ground.material.color.copy(groundNight).lerp(groundDay, clamp(dawn * 1.3, 0, 1));
    starMat.opacity = night * 0.9;
    renderer.toneMappingExposure = lerp(1.25, 1.0, dawn);

    // windows & lights
    neighborWinMat.emissiveIntensity = night * (1 - dark) * 1.8;
    ownWinMat.emissiveIntensity = 0.5 + night * 1.6 + dark * 1.4;
    homeGlow.intensity = (night * 0.5 + dark * 0.8) * 40;
    fill.intensity = lerp(0.12, 0.9, dawn) * (1 - dark * 0.7);
    porchGlow.material.opacity = dark * 0.4;
    lampGlows.forEach(({ glow, bulb }) => { const on = night * (1 - dark); glow.material.opacity = on * 0.85; bulb.material.color.setRGB(lerp(0.12, 1, on), lerp(0.12, 0.85, on), lerp(0.14, 0.63, on)); });

    // panels
    panelMats.forEach((m) => { m.emissiveIntensity = cur.charge * dawn * (0.55 + 0.35 * Math.sin(time * 2.4 - m.userData.phase)); });

    // battery
    const battLevel = Math.max(cur.flow * 0.6, dark);
    battGlow.material.opacity = battLevel * (0.55 + 0.25 * Math.sin(time * 3));
    battStripMat.opacity = 0.35 + battLevel * 0.65;

    // energy flow particles
    flowMat.opacity = clamp(Math.max(cur.flow * dawn, dark * 0.9), 0, 1);
    const startT = dark > 0.5 ? 0.55 : 0; // during blackout only battery -> home segment flows
    for (let i = 0; i < flowCount; i++) {
      const s = flowSeed[i * 3];
      const u = startT + (((s + time * 0.12) % 1) * (1 - startT));
      curves[i % pCols].getPointAt(u, v3);
      flowPos[i * 3] = v3.x + flowSeed[i * 3 + 1] * 0.25;
      flowPos[i * 3 + 1] = v3.y + Math.sin(time * 4 + s * 20) * 0.06;
      flowPos[i * 3 + 2] = v3.z + flowSeed[i * 3 + 2] * 0.25;
    }
    flowGeo.attributes.position.needsUpdate = true;

    // photons from the sun onto the panels
    photonMat.opacity = cur.charge * clamp(dawn * 1.5 - 0.3, 0, 1) * 0.9;
    const sunDirN = skyUniforms.sunDir.value;
    for (let i = 0; i < photonCount; i++) {
      const p = (photonSeed[i * 3] + time * 0.35) % 1;
      const dist = (1 - p) * 26;
      photonPos[i * 3] = panelCenter.x + photonSeed[i * 3 + 1] + sunDirN.x * dist;
      photonPos[i * 3 + 1] = panelCenter.y + sunDirN.y * dist + (1 - p) * 4;
      photonPos[i * 3 + 2] = panelCenter.z + photonSeed[i * 3 + 2] + sunDirN.z * dist;
    }
    photonGeo.attributes.position.needsUpdate = true;

    // dust
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = dustBase[i * 3] + Math.sin(time * 0.2 + i) * 0.8;
      dustPos[i * 3 + 1] = (dustBase[i * 3 + 1] + time * 0.25 * ((i % 5) + 1) * 0.2) % 22;
      dustPos[i * 3 + 2] = dustBase[i * 3 + 2] + Math.cos(time * 0.15 + i) * 0.8;
    }
    dustGeo.attributes.position.needsUpdate = true;
    dustMat.opacity = 0.18 + dawn * 0.35;
  }

  let firstFrame = true;
  function render() {
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; requestAnimationFrame(() => hideLoader()); }
  }

  // Pause rendering while full-bleed media sections hide the canvas (html.gl-off, set by modules.js)
  let glOffSince = 0;
  function loop() {
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;
    const off = document.documentElement.classList.contains('gl-off');
    if (off) { if (!glOffSince) glOffSince = performance.now(); } else glOffSince = 0;
    if (!off || performance.now() - glOffSince < 1000) { update(dt); render(); }
    requestAnimationFrame(loop);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    measure();
    if (reduceMotion) { update(0); render(); }
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('load', measure);

  if (reduceMotion) {
    // Static fallback: no animation loop; re-render a still frame only when scrolling between scenes.
    time = 1.5;
    update(0); render();
    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending) return; pending = true;
      requestAnimationFrame(() => { pending = false; update(0); render(); });
    }, { passive: true });
  } else {
    loop();
  }
}

/* ---------- Boot ---------- */
initUI();
if (hasWebGL()) {
  try { initScene(); } catch (err) { console.warn('3D scene failed, using fallback', err); document.documentElement.classList.add('no-webgl'); hideLoader(); }
} else {
  document.documentElement.classList.add('no-webgl');
  hideLoader();
}
