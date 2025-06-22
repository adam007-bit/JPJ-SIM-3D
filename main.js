const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef3f7);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('simulator').appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === KERETA ===
const car = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 4), new THREE.MeshStandardMaterial({ color: 0x007bff }));
body.position.y = 0.5;
car.add(body);

const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 2), new THREE.MeshStandardMaterial({ color: 0x0056b3 }));
roof.position.set(0, 1.1, 0);
car.add(roof);

car.position.set(0, 0, 0);
scene.add(car);

// === Kawalan
let carSpeed = 0;
let carDirection = 0;

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

// Kawalan global untuk butang
window.moveForward = () => { carSpeed = 0.05; };
window.brake = () => { carSpeed = 0; };
window.turnLeft = () => { carDirection = 0.03; setTimeout(() => carDirection = 0, 200); };
window.turnRight = () => { carDirection = -0.03; setTimeout(() => carDirection = 0, 200); };

