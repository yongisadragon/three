import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

//Create sphere (radius, segments, segments)
const geo = new THREE.SphereGeometry(3, 64, 64);
const mat = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.3,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

console.log(mesh);
//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Light
const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10);
// light.intensity = 2;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(0, 0, 20);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(3);
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

//Controls (must be after camera,renderer)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.dampingFactor = 0.05;
controls.autoRotateSpeed = 5;
// controls.update();

//Resize
window.addEventListener("resize", () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Timeline magic
const tl = gsap.timeline({ defaults: { duration: 0.7 } });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//Mouse Animation Color
let mouseDown = false;
let rgb = []; //color range
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    //animate here
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`); //this gonna be as obj
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
    console.log(newColor);
  }
});
