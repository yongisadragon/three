import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import {
  animate,
  motion,
  transform,
  useMotionValue,
  useSpring,
} from "framer-motion";

export default function index({ stickyElement }) {
  const [isHovered, setIsHovered] = useState(false);

  const cursorRef = useRef();
  const cursorSize = isHovered ? 60 : 20;
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  // stickycursor 늘어남 효과를 위한 스케일 조정
  const scale = {
    x: useMotionValue(1),
    y: useMotionValue(1),
  };

  const smoothOptions = { damping: 12, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const rotate = (distance) => {
    // 커서 꼭지의 거리(이전에 만든 distance에 담겨있음)에 따른 각도값(radians) 반환?
    const angle = Math.atan2(distance.y, distance.x);
    animate(cursorRef.current, { rotate: `${angle}rad` }, { duration: 0 });
  };
  // 좌표 설정
  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      stickyElement.current.getBoundingClientRect();

    //center position of the stickyElement.
    const center = { x: left + width / 2, y: top + height / 2 };
    // magnetic motion distance 계산식
    const distance = { x: clientX - center.x, y: clientY - center.y };

    if (isHovered) {
      // 스케일 모양 변화를 각 방향에서 rotation
      rotate(distance);
      // 커서를 포인터와 커스텀 커서 사이의 거리 기반으로 늘려줌 abs는 절대값 계산, 호버시에만 늘어나도록
      const absDistance = Math.max(Math.abs(distance.x), Math.abs(distance.y));
      // newScaleX와 newScaleY의 마지막 배열 안 값은 가로로 늘어나는 결과.
      const newScaleX = transform(absDistance, [0, width / 2], [1, 1.2]);
      const newScaleY = transform(absDistance, [0, width / 2], [1, 0.8]);
      scale.x.set(newScaleX);
      scale.y.set(newScaleY);

      // 호버 됐을때만 동그라미 커서 중심을 햄버거의 center로 재조정, sticky perform을 위한 값
      mouse.x.set(center.x - cursorSize / 2 + distance.x * 0.3);
      mouse.y.set(center.y - cursorSize / 2 + distance.y * 0.3);
    } else {
      // normal cursor center position
      mouse.x.set(clientX - cursorSize / 2);
      mouse.y.set(clientY - cursorSize / 2);
    }
  };

  // stickyElement(버거)에 호버링 됐을때 변경 감지
  const manageMouseOver = () => {
    setIsHovered(true);
  };
  const manageMouseLeave = () => {
    setIsHovered(false);
    // 호버를 빠져나가면 커서를 원상태로 돌리기 위한 에니매.
    animate(
      cursorRef.current,
      { scaleX: 1, scaleY: 1 },
      { duration: 0.2 },
      { type: "spring" }
    );
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
  }, [isHovered]);

  //템플릿은 트랜스폼 되는 순서(원랜 스케일->회전. 다시 회전->스케일로 조정)를 정할 수 있음. scale 이전에 rotating이 먼저 돼야 각도에 따른 스티키 커서의 폼을 변화할 수 있다.
  const tmeplate = ({ rotate, scaleX, scaleY }) => {
    return `rotate(${rotate}) scaleX(${scaleX}) scaleY(${scaleY})`;
  };

  return (
    <motion.div
      transformTemplate={tmeplate}
      className={styles.cursor}
      ref={cursorRef}
      style={{
        left: smoothMouse.x,
        top: smoothMouse.y,
        scaleX: scale.x,
        scaleY: scale.y,
      }}
      animate={{ width: cursorSize, height: cursorSize }}
    ></motion.div>
  );
}
