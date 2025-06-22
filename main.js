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
scene.add(new THREE.AmbientLight(0x404040));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// === Kereta Kotak ===
const carGroup = new THREE.Group();
const body = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0x007bff })
);
body.position.y = 0.5;
carGroup.add(body);
carGroup.position.set(0, 0, 0);
scene.add(carGroup);

// === LITAR ZON ===
// Naik Bukit
const bukit = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 12), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
bukit.position.set(-30, 0.5, 0);
bukit.rotation.x = -Math.PI / 10;
scene.add(bukit);

// Selekoh Z
const zPath = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), new THREE.MeshStandardMaterial({ color: 0xffcc80 }));
zPath.rotation.x = -Math.PI / 2;
zPath.position.set(0, 0.01, -30);
scene.add(zPath);

// Selekoh S
const sPath = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), new THREE.MeshStandardMaterial({ color: 0x90caf9 }));
sPath.rotation.x = -Math.PI / 2;
sPath.position.set(30, 0.01, -30);
scene.add(sPath);

// Parkir Sisi
const parkir = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), new THREE.MeshStandardMaterial({ color: 0xc8e6c9 }));
parkir.rotation.x = -Math.PI / 2;
parkir.position.set(-20, 0.01, 20);
scene.add(parkir);

// Tiga Penjuru
const tigaPenjuru = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshStandardMaterial({ color: 0xffab91 }));
tigaPenjuru.rotation.x = -Math.PI / 2;
tigaPenjuru.position.set(20, 0.01, 20);
scene.add(tigaPenjuru);

// === Kon (Traffic Cone) ===
function addCone(x, z) {
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.7, 16),
    new THREE.MeshStandardMaterial({ color: 0xff5722 })
  );
  cone.position.set(x, 0.35, z);
  cone.castShadow = true;
  scene.add(cone);
}

[
  [-32, -4], [-32, 4], [-34, 0],  // Bukit
  [0, -26], [0, -34],             // Z
  [30, -26], [30, -34],           // S
  [-24, 20], [-16, 20],           // Parkir
  [20, 24], [20, 16],             // 3 Penjuru
].forEach(pos => addCone(pos[0], pos[1]));

// === Papan Tanda Zon ===
function addSign(text, x, z) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), material);
  sign.position.set(x, 2, z);
  sign.lookAt(camera.position);
  scene.add(sign);
}

addSign("Naik Bukit", -30, -6);
addSign("Selekoh Z", 0, -38);
addSign("Selekoh S", 30, -38);
addSign("Parkir Sisi", -20, 25);
addSign("3 Penjuru", 20, 25);

// === ANIMASI ===
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

// === Kawalan Butang Pedal ===
window.moveForward = () => { carSpeed = 0.05; };
window.brake = () => { carSpeed = 0; };
window.turnLeft = () => { carDirection = 0.03; };
window.turnRight = () => { carDirection = -0.03; };

};
