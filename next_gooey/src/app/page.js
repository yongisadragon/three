"use client";
import { animate } from "framer-motion";
import styles from "./page.module.scss";
import { useEffect, useRef, useState } from "react";

// number shape svg code array
const numbers = [
  "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
  "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8",
  "M74.8,178.5c3,39.4,63.9,46.7,88.6,23.7c34.3-35.1,5.4-75.8-41.7-77c29.9,5.5,68.7-43.1,36.5-73.7 c-23.4-21.5-76.5-11.1-78.6,25",
  "M161.9,220.8 161.9,41 72.6,170.9 208.2,170.9",
  "M183.2,43.7H92.1l-10,88.3c0,0,18.3-21.9,51-21.9s49.4,32.6,49.4,48.2c0,22.2-9.5,57-52.5,57s-51.4-36.7-51.4-36.7",
];

export default function Home() {
  const paths = useRef([]);
  const circles = useRef([]);
  const nbOfCircles = 40;
  const radius = 20;
  // dynamic하게 숫자들을 바꾸기 위한 상태값 설정
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const length = paths.current[index].getTotalLength();
    const step = length / nbOfCircles;

    circles.current.forEach((circle, i) => {
      const { x, y } = paths.current[index].getPointAtLength(i * step);
      animate(circle, { cx: x, cy: y }, { delay: 0.01 * i, ease: "easeInOut" });
    });
  }, [index]);

  return (
    <main className={styles.main}>
      <div className={styles.numbers}>
        {numbers.map((_, i) => {
          return (
            <p
              style={{ color: i == index ? "red" : "black" }}
              onClick={() => {
                setIndex(i);
              }}>
              {i + 1}
            </p>
          );
        })}
      </div>
      <svg viewBox="0 0 256 256">
        {/* def안은 blur속성에 관련된 것 */}
        <defs>
          <filter id="filter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blur"
            />
            {/* in은 위 블러의 result. values는 rgba에 대응되는 값들. */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -15"
              result="filter"
            />
          </filter>
        </defs>

        {numbers.map((d, i) => {
          return (
            <path
              key={`p_${i}`}
              ref={(ref) => (paths.current[i] = ref)}
              d={d}
            />
          );
        })}

        <g>
          {[...Array(nbOfCircles)].map((_, i) => {
            return (
              <circle
                key={`c_${i}`}
                ref={(ref) => (circles.current[i] = ref)}
                r={radius}
                cx={128}
                cy={128}
              />
            );
          })}
        </g>
      </svg>
    </main>
  );
}
