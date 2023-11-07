//기본세팅
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "GLTFLoader";
import WebGL from "three/addons/capabilities/WebGL.js";

//WebGL 호환성 검사
if (WebGL.isWebGLAvailable()) {
  //장면 만들고
  const scene = new THREE.Scene();
  //브라우저에 '장면을' 렌더링 해주세요. (WebGL을 사용하는 함수)
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  //gltf는 색상 인코딩을 이렇게 해줘야 원래 색이 나온다.
  renderer.outputEncoding = THREE.sRGBEncoding;

  //3D 모델을 보여줄 때 필요한 것. 1. 카메라, 2. 조명, 3. 배경
  //카메라 추가, OrthographicCamera(원근x)
  let camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 10);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //조명,배경 추가, AmbientLight, PointLight 등
  scene.background = new THREE.Color("white");

  let light = new THREE.DirectionalLight(0xffff00, 10);
  scene.add(light);

  //OrbitControls는 camera이후에 써줄것.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 15;
  controls.enableDamping = true; //관성
  controls.dampingFactor = 0.03; //관성값 (기본0.05)
  controls.autoRotate = true;
  controls.autoRotateSpeed = 10; //회전값 기본 2.0
  // controls.maxPolarAngle = Math.PI / 2; //바닥 이하로 범위 제한
  // controls.enablePan = false; //카메라 위치 이동(키보드, 마우스 패닝) 허가(true 기본)
  controls.update();

  let loader = new GLTFLoader();
  //load는 콜백함수로 들어갈 scene 대상을 파라미터로 받는다. 그 파라미터를 add로 소환해줌.
  loader.load("shiba/scene.gltf", function (gltf) {
    scene.add(gltf.scene);

    function animate() {
      requestAnimationFrame(animate);
      //여기 작성하면 1초에 60번 실행됨
      // gltf.scene.rotation.x += 0.01;
      // gltf.scene.rotation.y -= 0.02;
      controls.update(); //damping 등을 사용하기위해 작성
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
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
