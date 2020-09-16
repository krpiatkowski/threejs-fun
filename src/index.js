import * as THREE from "three";
import "./style.css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const distanceFactor = 27;
var positionIndex = 0;

document.body.style;

const minDistance = 0.25;
const maxDistance = 200;
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  minDistance,
  maxDistance
);
camera.position.set(0, 0, 50);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 2, 0.8, 1); // Decay should be used here
light.position.set(0, 0, 20);
light.castShadow = true;
scene.add(light);

var lightTarget = new THREE.Object3D();
lightTarget.position.set(0, 0, 0);
scene.add(lightTarget);
light.target = lightTarget;

var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// var lightCube = new THREE.Mesh(
//   new THREE.BoxGeometry(0.1, 0.1, 0.1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 })
// );
// lightCube.position.set(light.position.x, light.position.y, light.position.z);
// scene.add(lightCube);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const models = [
  "./assets/gltf/grasshopper.gltf",
  "./assets/gltf/grasshopper.gltf",
];
const modelOrigins = [];

var loader = new GLTFLoader();

for (var i = 0; i < models.length; i++) {
  const index = i;
  loader.load(
    models[index],
    (gltf) => {
      var bbox = new THREE.Box3().setFromObject(gltf.scene);
      const xOffset = (bbox.min.x + bbox.max.x) / 2;
      const yOffset = (bbox.min.y + bbox.max.y) / 2;
      const zOffset = (bbox.min.z + bbox.max.z) / 2;

      modelOrigins[index] = {
        x: index * distanceFactor - xOffset,
        y: -yOffset,
        z: -zOffset,
      };

      gltf.scene.position.set(
        modelOrigins[index].x,
        modelOrigins[index].y,
        modelOrigins[index].z
      );

      scene.add(gltf.scene);
      render();
    },
    () => {},
    (err) => {
      console.error(err);
    }
  );
}

const render = () => {
  renderer.render(scene, camera);
};

// const updateCamera = () => {
//   camera.position.x = modelOrigins[positionIndex].x;
//   light.position.x = modelOrigins[positionIndex].x;
//   lightTarget.position.x = modelOrigins[positionIndex].x;
//   render();
// };

var animate = function () {
  requestAnimationFrame(animate);
  // const speed = 0.5;
  // const expectedX = positionIndex * distanceFactor;
  // if (camera.position.x > expectedX) {
  //   camera.position.x -= speed;
  // }
  // if (camera.position.x < expectedX) {
  //   camera.position.x += speed;
  // }
  // light.position.x = camera.position.x;
  // lightTarget.position.x = camera.position.x;
  render();
};
animate();

var controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", (e) => {
  console.info("change", camera.position);
  render();
}); // use if there is no animation loop
controls.enableKeys = false;
controls.minDistance = minDistance;
controls.maxDistance = maxDistance;
controls.target.set(0, 0, -0.2);
controls.update();

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") {
    positionIndex = Math.min(models.length - 1, positionIndex + 1);
  }
  if (e.code === "ArrowLeft") {
    positionIndex = Math.max(0, positionIndex - 1);
  }
});
