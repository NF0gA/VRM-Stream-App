import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const stage = document.getElementById('stage');
const hint = document.getElementById('hint');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.35, 3.6);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff, 0x777788, 2.0));
const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(1, 2, 3);
scene.add(key);

let vrm = null;
let fps = 30;
let lastFrame = 0;
let cameraState = { rotateX: 0, rotateY: 0, panX: 0, panY: 0 };
let dragging = false, lastX = 0, lastY = 0, dragMode = 'camera';

const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));

async function loadModel(fileUrl) {
  hint.textContent = 'VRMを読み込み中…';
  try {
    const gltf = await loader.loadAsync(fileUrl);
    const nextVrm = gltf.userData.vrm;
    if (!nextVrm) throw new Error('VRMデータを取得できませんでした');
    if (vrm) {
      scene.remove(vrm.scene);
      VRMUtils.deepDispose(vrm.scene);
    }
    vrm = nextVrm;
    VRMUtils.rotateVRM0(vrm);
    scene.add(vrm.scene);
    const box = new THREE.Box3().setFromObject(vrm.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    vrm.scene.position.x -= center.x;
    vrm.scene.position.y -= box.min.y;
    camera.position.set(0, Math.max(0.8, size.y * 0.52), Math.max(2.2, size.y * 2.3));
    cameraState = { rotateX: 0, rotateY: 0, panX: 0, panY: 0 };
    camera.lookAt(0, size.y * 0.48, 0);
    hint.textContent = '';
  } catch (err) {
    console.error(err);
    hint.textContent = `読み込み失敗: ${err?.message ?? String(err)}`;
  }
}

function applyOptions(options) {
  fps = [15, 24, 30, 60].includes(Number(options?.fps)) ? Number(options.fps) : 30;
  const color = options?.chromaColor || '#00ff00';
  if (options?.background === 'chroma') {
    document.body.style.background = color;
    stage.style.background = color;
    renderer.setClearColor(color, 1);
  } else {
    document.body.style.background = 'transparent';
    stage.style.background = 'transparent';
    renderer.setClearColor(0x000000, 0);
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  if (now - lastFrame < 1000 / fps) return;
  const delta = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 1 / fps;
  lastFrame = now;
  if (vrm) vrm.update(delta);
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
window.vrmApp.onLoadModel(loadModel);
window.vrmApp.onOptions(applyOptions);
window.vrmApp.onCamera((state) => {
  cameraState = { ...cameraState, ...state };
  camera.position.x = cameraState.panX;
  camera.position.y = Math.max(0.1, 1.35 + cameraState.panY);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = cameraState.rotateY;
  camera.rotation.x = cameraState.rotateX;
});

renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 && e.button !== 2) return;
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  dragMode = e.button === 0 ? 'window' : 'camera';
  renderer.domElement.setPointerCapture(e.pointerId);
});
renderer.domElement.addEventListener('pointerup', () => { dragging = false; });
renderer.domElement.addEventListener('pointercancel', () => { dragging = false; });
renderer.domElement.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  if (dragMode === 'window') {
    window.vrmApp.moveWindow(dx, dy);
  } else if (e.ctrlKey) {
    cameraState.panX += dx * 0.004;
    cameraState.panY -= dy * 0.004;
    window.vrmApp.sendCamera(cameraState);
  } else {
    cameraState.rotateY += dx * 0.008;
    cameraState.rotateX = Math.max(-1.2, Math.min(1.2, cameraState.rotateX + dy * 0.008));
    window.vrmApp.sendCamera(cameraState);
  }
});
