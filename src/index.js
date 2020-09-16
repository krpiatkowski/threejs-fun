import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const minDistance = 0.25;
const maxDistance = 200;
var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  minDistance,
  maxDistance
);
camera.position.set(0, 0, 100);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var light = new THREE.SpotLight(0xffffff, 1, 120, Math.PI / 3, 0, 1);
light.position.set(-50, 20, -2.6);
scene.add(light);

var lightTarget = new THREE.Object3D();
lightTarget.position.set(0, 0, 0);
scene.add(lightTarget);
light.target = lightTarget;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const models = [
  "./assets/gltf/grasshopper.gltf",
  "./assets/gltf/grasshopper.gltf",
  // "./assets/gltf/grasshopper.gltf",
];

var loader = new GLTFLoader();

for (var i = 0; i < models.length; i++) {
  const index = i;
  loader.load(
    models[index],
    (gltf) => {
      console.info("light.target", light.target.position);
      gltf.scene.position.set(index * 20, 0, 0);
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

var controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", (e) => {
  console.info("change", camera.position);
  render();
}); // use if there is no animation loop
controls.minDistance = minDistance;
controls.maxDistance = maxDistance;
controls.target.set(0, 0, -0.2);
controls.update();
