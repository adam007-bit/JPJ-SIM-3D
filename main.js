import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef3f7);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 12);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('simulator').appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
light.castShadow = true;
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040)); // Soft light

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === Kereta Profesional Kotak ===
const carGroup = new THREE.Group();

// Badan kereta
const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x007bff, metalness: 0.3, roughness: 0.6 })
);
body.position.y = 0.5;
body.castShadow = true;
carGroup.add(body);

// Bumbung
const roof = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.4, 2),
  new THREE.MeshStandardMaterial({ color: 0x0056b3 })
);
roof.position.set(0, 1.1, 0);
roof.castShadow = true;
carGroup.add(roof);

// Lampu depan
const lightL = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ emissive: 0xffff00, color: 0x222222 })
);
lightL.position.set(-0.6, 0.6, 2);
carGroup.add(lightL);

const lightR = lightL.clone();
lightR.position.x = 0.6;
carGroup.add(lightR);

// Tayar (4 biji)
const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

const wheelPositions = [
  [-0.9, 0.2, -1.5], [0.9, 0.2, -1.5], // belakang
  [-0.9, 0.2, 1.5], [0.9, 0.2, 1.5],   // depan
];

for (let pos of wheelPositions) {
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(...pos);
  wheel.castShadow = true;
  carGroup.add(wheel);
}

carGroup.position.set(0, 0, 0);
scene.add(carGroup);

// Animasi & Kawalan
let carSpeed = 0;
let carDirection = 0;

function animate() {
  requestAnimationFrame(animate);

  carGroup.rotation.y += carDirection;
  const angle = carGroup.rotation.y;
  carGroup.position.x -= Math.sin(angle) * carSpeed;
  carGroup.position.z -= Math.cos(angle) * carSpeed;

  // Kamera follow kereta
  camera.position.lerp(
    new THREE.Vector3(
      carGroup.position.x + 6 * Math.sin(-angle),
      5,
      carGroup.position.z + 6 * Math.cos(-angle)
    ),
    0.05
  );
  camera.lookAt(carGroup.position);

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
