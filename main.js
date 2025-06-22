import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// === Scene Setup ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef3f7);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('simulator').appendChild(renderer.domElement);

// === Lighting ===
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));

// === Ground ===
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === Profesional Kereta Kotak ===
const car = new THREE.Group();

// Badan
const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x007bff })
);
body.position.y = 0.5;
car.add(body);

// Bumbung
const roof = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.4, 2),
  new THREE.MeshStandardMaterial({ color: 0x0056b3 })
);
roof.position.set(0, 1.1, 0);
car.add(roof);

// Tayar
const wheel = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
[[-1, -1.5], [1, -1.5], [-1, 1.5], [1, 1.5]].forEach(([x, z]) => {
  const w = new THREE.Mesh(wheel, wheelMat);
  w.rotation.z = Math.PI / 2;
  w.position.set(x * 0.9, 0.2, z);
  car.add(w);
});

car.position.set(0, 0, 0);
scene.add(car);

// === Laluan JPJ ===
function addZone(x, z, w, h, color) {
  const zone = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color })
  );
  zone.rotation.x = -Math.PI / 2;
  zone.position.set(x, 0.01, z);
  scene.add(zone);
}

addZone(-30, 0, 6, 12, 0x8d6e63);   // Bukit
addZone(0, -30, 20, 4, 0xffcc80);   // Z
addZone(30, -30, 20, 4, 0x90caf9);  // S
addZone(-20, 20, 8, 3, 0xc8e6c9);   // Parkir
addZone(20, 20, 6, 6, 0xffab91);    // 3 Penjuru

// === Kon ===
function addCone(x, z) {
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.7, 16),
    new THREE.MeshStandardMaterial({ color: 0xff5722 })
  );
  cone.position.set(x, 0.35, z);
  scene.add(cone);
}
[[-32, -4], [-32, 4], [0, -26], [0, -34], [30, -26], [30, -34], [-24, 20], [-16, 20], [20, 24], [20, 16]]
  .forEach(([x, z]) => addCone(x, z));

// === Garisan Panduan ===
function addGuide(points) {
  const geo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p[0], 0.02, p[1])));
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
}
addGuide([[ -10, -25 ], [ 0, -30 ], [ 10, -35 ]]);     // Z
addGuide([[ 20, -25 ], [ 30, -30 ], [ 40, -35 ]]);     // S
addGuide([[ -30, -6 ], [ -30, 6 ]]);                   // Bukit
addGuide([[ -24, 20 ], [ -16, 20 ]]);                  // Parkir
addGuide([[ 20, 24 ], [ 20, 16 ]]);                    // 3 Penjuru

// === Tanda Zon ===
function addSign(text, x, z) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 64;
  ctx.fillStyle = '#222'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText(text, canvas.width/2, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), mat);
  sign.position.set(x, 2, z);
  sign.lookAt(camera.position);
  scene.add(sign);
}
addSign("Naik Bukit", -30, -6);
addSign("Selekoh Z", 0, -38);
addSign("Selekoh S", 30, -38);
addSign("Parkir Sisi", -20, 25);
addSign("3 Penjuru", 20, 25);

// === Animasi & Kamera ===
let carSpeed = 0, carDirection = 0;

function animate() {
  requestAnimationFrame(animate);
  car.rotation.y += carDirection;
  const angle = car.rotation.y;
  car.position.x -= Math.sin(angle) * carSpeed;
  car.position.z -= Math.cos(angle) * carSpeed;

  camera.position.set(car.position.x, 50, car.position.z);
  camera.lookAt(car.position);

  renderer.render(scene, camera);
}
animate();

// === Kawalan Butang ===
window.moveForward = () => carSpeed = 0.05;
window.brake = () => carSpeed = 0;
window.turnLeft = () => carDirection = 0.03;
window.turnRight = () => carDirection = -0.03;
