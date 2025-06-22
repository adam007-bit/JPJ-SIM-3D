import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

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

// Load kereta
const loader = new GLTFLoader();
loader.load('models/axia.glb', function(gltf) {
  const car = gltf.scene;
  car.scale.set(1.5, 1.5, 1.5);
  car.position.set(0, 0, 0);
  scene.add(car);
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
