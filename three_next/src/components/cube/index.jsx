"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import styles from "./style.module.scss";

import {
  OrbitControls,
  ScrollControls,
  OrthographicCamera,
  PerspectiveCamera,
  useGLTF,
  Html,
  Environment,
  Preload,
} from "@react-three/drei";
import {
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { motion } from "framer-motion-3d";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

export default function index() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  //actuall, it means progress*10 in motion.mesh TAG ,, but progress was obj. not be treated as value
  const progress = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const smoothProgress = useSpring(progress, { damping: 20 });

  return (
    <div ref={container} className={styles.main}>
      <div className={styles.cube}>
        <Canvas
        // camera={{
        //   fov: 50,
        //   position: [7, 3, 0],
        //   near: 0.1,
        //   far: 20,
        // }}
        >
          <Suspense
            fallback={
              <Html>
                <div style={{ color: "white" }}>기다려주세요</div>
              </Html>
            }>
            <Environment files="/mingletest.hdr" background blur={0.1} />
            <ScrollControls pages={10}>
              {/* 1page = 100vh */}
              <OrbitControls
                enableZoom={true}
                enableRotate={true}
                // enablePan={true}
                // maxPolarAngle={Math.PI / 2}
                maxAzimuthAngle={Math.PI / 2}
              />
              <ambientLight intensity={1} />
              <directionalLight position={[1, 1, 1]} intensity={10} />
              <Model />
              {/* <Cube progress={smoothProgress} /> */}
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
useGLTF.preload("/mingletest.glb");

const Model = ({ scale = 1 }) => {
  const [hovered, hover] = useState(false);

  // const gltf = useLoader(GLTFLoader, "/scene.gltf");
  const { nodes, materials } = useGLTF("/studiometal.glb");
  const { scene } = useGLTF("/studiometal2.glb");

  return (
    // <group dispose={null}>
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.Icosphere.geometry}
    //     material={materials["metal"]}
    //     rotation={[Math.PI / 2, 0, 0]}
    //     scale={0.1}
    //   />
    // </group>
    <primitive
      // castShadow
      // receiveShadow
      object={scene}
      // scale={hovered ? scale * 1.1 : scale}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
    />
  );
};

function Cube({ progress }) {
  const mesh = useRef(null);

  //*scrolling mouse scroll gesture
  // const data = useScroll(); // // from drei

  // useFrame((state, delta) => {
  //   // from useScrolls..
  //   const { offset } = data;
  //   mesh.current.rotation.x = offset * 5;
  //   mesh.current.rotation.y = offset * 5;
  //   mesh.current.rotation.z = offset * 5;
  // });

  //*following mouse move gesture
  const options = {
    damping: 15,
  };

  const mouse = {
    x: useSpring(useMotionValue(0), options),
    y: useSpring(useMotionValue(0), options),
  };
  const manageMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const { clientX, clientY } = e;
    const multiplier = 0.7;
    const x = (-0.5 + clientX / innerWidth) * multiplier;
    const y = (-0.5 + clientY / innerHeight) * multiplier;
    mouse.x.set(x);
    mouse.y.set(y);
  };

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove);

    return () => window.removeEventListener("mouse", manageMouseMove);
  }, []);

  // *normal ratation
  // useFrame((state, delta) => {
  // mesh.current.rotation.x += delta * 0.3;
  // mesh.current.rotation.y += delta * 0.3;
  // });

  const texture_1 = useLoader(TextureLoader, "/assets/제목 없음.png");
  const texture_2 = useLoader(
    TextureLoader,
    "/assets/KakaoTalk_20230328_141150563.png"
  );
  const texture_3 = useLoader(TextureLoader, "/assets/learn.png");
  const texture_4 = useLoader(TextureLoader, "/assets/i14657123959.jpg");
  return (
    <motion.mesh ref={mesh} rotation-x={mouse.y} rotation-y={mouse.x}>
      {/* <motion.mesh ref={mesh} rotation-y={progress} rotation-x={progress}> */}
      {/* args = [width, height, depth] */}
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial color={"orange"} attach="material-0" />
      <meshStandardMaterial color={"pink"} attach="material-1" />
      <meshStandardMaterial color={"black"} attach="material-2" />
      <meshStandardMaterial color={"green"} attach="material-3" />
      <meshStandardMaterial color={"red"} attach="material-4" />
      <meshStandardMaterial map={texture_4} attach="material-5" />
    </motion.mesh>
  );
}
