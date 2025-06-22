import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

// Setup asas
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('simulator').appendChild(renderer.domElement);

// Lampu
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

// Lantai
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x404040 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Kereta
let carModel = null;
const loader = new GLTFLoader();
loader.load('models/axia.glb', function(gltf) {
  carModel = gltf.scene;
  carModel.scale.set(1.5, 1.5, 1.5);
  carModel.position.set(0, 0, 0);
  scene.add(carModel);
}, undefined, function(error) {
  console.error("Gagal load model axia.glb:", error);
});

// Kamera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Animasi
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Kawalan stereng
const wheel = document.getElementById("steeringWheel");
let isDragging = false;
let startX = 0;
let steeringAngle = 0;

wheel.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  steeringAngle = Math.max(-45, Math.min(45, dx)); // clamp ke -45° hingga 45°
  wheel.style.transform = `rotate(${steeringAngle}deg)`;

  if (carModel) {
    carModel.rotation.y = -steeringAngle * Math.PI / 180;
  }
});
