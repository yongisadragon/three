import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function index({ stickyElement }) {
  const [isHovered, setIsHovered] = useState(false);

  const cursorSize = isHovered ? 60 : 20;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 15, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  // 좌표 설정
  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      stickyElement.current.getBoundingClientRect();
    //center position of the stickyElement 호버 됐을때만 동그라미 중심을 중심으로 설정
    const center = { x: left + width / 2, y: top + height / 2 };

    if (isHovered) {
      mouse.x.set(center.x - cursorSize / 2);
      mouse.y.set(center.y - cursorSize / 2);
    } else {
      //center position
      mouse.x.set(clientX - cursorSize / 2);
      mouse.y.set(clientY - cursorSize / 2);
    }
  };

  const manageMouseOver = () => {
    setIsHovered(true);
  };
  const manageMouseLeave = () => {
    setIsHovered(false);
  };

  //track mouse
  useEffect(() => {
    stickyElement.current.addEventListener("mouseover", manageMouseOver);
    stickyElement.current.addEventListener("mouseleave", manageMouseLeave);
    window.addEventListener("mousemove", manageMouseMove);
    return () => {
      stickyElement.current.removeEventListener("mouseover", manageMouseOver);
      stickyElement.current.removeEventListener("mouseleave", manageMouseLeave);
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, [setIsHovered]);

  return (
    <motion.div
      className={styles.cursor}
      style={{ left: smoothMouse.x, top: smoothMouse.y }}
      animate={{ width: cursorSize, height: cursorSize }}
    ></motion.div>
  );
}
