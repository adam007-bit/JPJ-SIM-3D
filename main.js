import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef3f7);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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

// === KERETA KOTAK SEMENTARA === //
const carBody = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x0074D9 })
);

const frontWheel = new THREE.Mesh(
  new THREE.CylinderGeometry(0.4, 0.4, 0.4, 32),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
frontWheel.rotation.z = Math.PI / 2;
frontWheel.position.set(-0.9, -0.5, 1.5);

const backWheel = frontWheel.clone();
backWheel.position.z = -1.5;

const carModel = new THREE.Group();
carModel.add(carBody);
carModel.add(frontWheel);
carModel.add(backWheel);

carModel.position.set(0, 0.5, 0);
scene.add(carModel);

// Kamera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Animasi
let carSpeed = 0;
let carDirection = 0;

function animate() {
  requestAnimationFrame(animate);

  carModel.rotation.y += carDirection;

  const angle = carModel.rotation.y;
  carModel.position.x -= Math.sin(angle) * carSpeed;
  carModel.position.z -= Math.cos(angle) * carSpeed;

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

