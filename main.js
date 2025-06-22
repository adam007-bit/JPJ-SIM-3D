import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lantai
let ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x00aa00 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Cahaya
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 20, 10).normalize();
scene.add(light);

// Kereta (placeholder cube)
let kereta = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
kereta.position.y = 0.5;
scene.add(kereta);

camera.position.set(0, 10, 10);
camera.lookAt(kereta.position);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
