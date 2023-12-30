"use client";
import { useEffect, useRef } from "react";
import styles from "../app/page.module.scss";
import { useScroll, motion } from "framer-motion";
export default function Paragraph({ value }) {
  const element = useRef();
  // intersection obsever API와 비슷한 훅
  const { scrollYProgress } = useScroll({
    target: element,
    // container라는 속성으로 탐색범위를 특정할 수 있으나 안넣으면 window를 탐색함.
    //0.8만큼의 세로비율만큼에서 opacity가 0 -> 1로 변하기 시작해서, 세로 0.25 비율만큼 왔을때 opcity 1이 됨.
    offset: ["start 0.8", "start 0.25"],
  });

  useEffect(() => {
    scrollYProgress.on("change", (e) => console.log(e));
  }, []);

  return (
    <motion.p
      style={{ opacity: scrollYProgress }}
      ref={element}
      className={styles.paragraph}>
      {value}
    </motion.p>
  );
}
