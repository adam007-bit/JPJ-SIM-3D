import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lampu
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 20, 10).normalize();
scene.add(light);

// Lantai
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xa0d468 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Kereta (blok merah buat sementara)
const kereta = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
kereta.position.y = 0.5;
scene.add(kereta);

// Kamera ikut belakang kereta
camera.position.set(0, 5, 10);
camera.lookAt(kereta.position);

// Kawalan
let moveForward = false;
let moveBackward = false;
let turnLeft = false;
let turnRight = false;

// Keyboard event
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') moveForward = true;
  if (e.key === 'ArrowDown' || e.key === 's') moveBackward = true;
  if (e.key === 'ArrowLeft' || e.key === 'a') turnLeft = true;
  if (e.key === 'ArrowRight' || e.key === 'd') turnRight = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') moveForward = false;
  if (e.key === 'ArrowDown' || e.key === 's') moveBackward = false;
  if (e.key === 'ArrowLeft' || e.key === 'a') turnLeft = false;
  if (e.key === 'ArrowRight' || e.key === 'd') turnRight = false;
});

// Sentuh button
function controlTouch(id, state) {
  if (id === 'btn-forward') moveForward = state;
  if (id === 'btn-backward') moveBackward = state;
  if (id === 'btn-left') turnLeft = state;
  if (id === 'btn-right') turnRight = state;
}

function updateKereta() {
  if (turnLeft) kereta.rotation.y += 0.05;
  if (turnRight) kereta.rotation.y -= 0.05;

  let speed = 0;
  if (moveForward) speed = 0.2;
  if (moveBackward) speed = -0.1;

  kereta.position.x -= Math.sin(kereta.rotation.y) * speed;
  kereta.position.z -= Math.cos(kereta.rotation.y) * speed;
}

// Loop
function animate() {
  requestAnimationFrame(animate);
  updateKereta();
  camera.position.x = kereta.position.x + Math.sin(kereta.rotation.y) * 10;
  camera.position.z = kereta.position.z + Math.cos(kereta.rotation.y) * 10;
  camera.lookAt(kereta.position);
  renderer.render(scene, camera);
}
animate();

// Kawalan sentuh
const touchButtons = ['forward', 'backward', 'left', 'right'];
touchButtons.forEach(dir => {
  const btn = document.createElement('button');
  btn.id = `btn-${dir}`;
  btn.innerText = dir.toUpperCase();
  btn.style.position = 'fixed';
  btn.style.zIndex = '10';
  btn.style.padding = '10px 15px';
  btn.style.borderRadius = '10px';
  btn.style.background = '#333';
  btn.style.color = '#fff';
  btn.style.opacity = 0.8;

  // Susun butang
  if (dir === 'left') { btn.style.bottom = '100px'; btn.style.left = '20px'; }
  if (dir === 'right') { btn.style.bottom = '100px'; btn.style.left = '120px'; }
  if (dir === 'forward') { btn.style.bottom = '180px'; btn.style.left = '70px'; }
  if (dir === 'backward') { btn.style.bottom = '20px'; btn.style.left = '70px'; }

  btn.ontouchstart = () => controlTouch(btn.id, true);
  btn.ontouchend = () => controlTouch(btn.id, false);

  document.body.appendChild(btn);
});
