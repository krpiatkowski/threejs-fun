import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.25,
  50
);
camera.position.set(20, 20, 20);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

var light = new THREE.PointLight(0xffffff, 10, 100);
light.position.set(50, 50, 50);
scene.add(light);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var loader = new GLTFLoader();
loader.load(
  // resource URL
  "./assets/gltf/FLLv2.gltf",
  // called when the resource is loaded
  (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.info(child);
      }
    });
    scene.add(gltf.scene);
    render();
  },
  () => {},
  (err) => {
    console.error(err);
  }
);

const render = () => {
  renderer.render(scene, camera);
};

var controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", render); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 40;
controls.target.set(0, 0, -0.2);
controls.update();
