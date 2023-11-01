import * as THREE from "../node_modules/three/build/three.module.js";
import { GLTFLoader } from "GLTFLoader";
console.log(THREE, GLTFLoader);

//*장면
const scene = new THREE.Scene();
//조명,배경 추가, AmbientLight, PointLight 등
scene.background = new THREE.Color(0x004fff);

//*카메라
const fov = 47; //표준:50mm, 광각(화각이 넓다,풍경): 35mm이하, 망원(화각이 좁다,확대): 85mm이상. 여기에서는 값이 커질수록 광각으로 보임.
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1; //카메라 시점이 시작하는 위치. 카메라가 잡을 수 있는 시야의 범위 (near ~ far). 이 값들보다 크거나 작은 값들은 카메라에 잡히지 않음(렌더링 x)
const far = 1000; //카메라 시점이 끝나는 위치
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.set(1, 0, 10); //카메라 위치조정. xyz
// camera.lookAt(new THREE.Vector3(0, 0, 0)); //카메라 위치에 상관없이 해당 좌표를 바라보게 강제함. 카메라 뿐 아니라 lookAt은 빛등에도 적용 가능하다.

//*렌더러
const renderer = new THREE.WebGLRenderer({
  alpha: true, // 배경 없이 가능
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//*빛
// PointLight=전구, DirectionalLight=태양, HemisphereLight=하늘,땅
// const pointLight = new THREE.PointLight(0xffff00, 20);
// light.position.set(2, -1, 3);
// scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffff00, 5);
directionalLight.position.set(2, 2, 2); //전구 위치 조정
const dlHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2,
  "white"
); //가이드 선 helper 추가
scene.add(dlHelper);
scene.add(directionalLight);

//*메쉬
const geometry = new THREE.BoxGeometry(1, 1, 1);
//MeshStandardMaterial는 물리적 엔진을 기반으로 렌더링.
const material = new THREE.MeshStandardMaterial({
  color: 0xff7f00,
  metalness: 0.6,
  roughness: 0.4,
});
// material.wireframe = true;
const cube = new THREE.Mesh(geometry, material);
// cube.position.x = 1; // 물체 이동
scene.add(cube);

const geometry1 = new THREE.BoxGeometry(1, 1, 1);
//MeshStandardMaterial는 물리적 엔진을 기반으로 렌더링.
const material1 = new THREE.MeshPhysicalMaterial({
  color: 0xff7f,
  clearcoat: 1,
});
// material.wireframe = true;
const cube1 = new THREE.Mesh(geometry1, material1);
cube1.position.x = 2; // 물체 이동
scene.add(cube1);

//*GLTF로더
let loader = new GLTFLoader();
//load는 콜백함수로 들어갈 scene 대상을 파라미터로 받는다. 그 파라미터를 add로 소환해줌.
loader.load("../shiba/scene.gltf", function (gltf) {
  scene.add(gltf.scene);

  //*에니메이션 render
  function animate(time) {
    requestAnimationFrame(animate);
    time *= 0.001; //convert time to sec

    cube.rotation.x = time;
    cube.rotation.y = time;
    cube1.rotation.x = time;
    cube1.rotation.y = time;

    renderer.render(scene, camera);
  }
  animate();
});

//반응형 처리(예를 들면 오브젝트가 항상 가운대로 오도록 처리)
function onWindowResize() {
  //사이즈 조절시 윈도값 가변처리, 종횡비도 일정하게 유지해줌
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, innerHeight);
}
// window가 리사이즈 될때마다 반응형되도록 처리
window.addEventListener("resize", onWindowResize);
