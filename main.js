import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef3f7);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('simulator').appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x999999 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Load car model
let carModel = null;
const loader = new GLTFLoader();
loader.load('models/axia.glb', function(gltf) {
  carModel = gltf.scene;
  carModel.scale.set(1.5, 1.5, 1.5);
  carModel.position.set(0, 0, 0);
  scene.add(carModel);
}, undefined, function(error) {
  console.error('Gagal load model:', error);
});

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Animation
let carSpeed = 0;
let carDirection = 0;

function animate() {
  requestAnimationFrame(animate);

  if (carModel) {
    // Pusing kereta
    carModel.rotation.y += carDirection;

    // Gerak ke depan ikut arah
    const angle = carModel.rotation.y;
    carModel.position.x -= Math.sin(angle) * carSpeed;
    carModel.position.z -= Math.cos(angle) * carSpeed;
  }

  renderer.render(scene, camera);
}
animate();

// Kawalan
window.moveForward = () => {
  carSpeed = 0.05;
};

window.brake = () => {
  carSpeed = 0;
};

window.turnLeft = () => {
  carDirection = 0.03;
};

window.turnRight = () => {
  carDirection = -0.03;
};


