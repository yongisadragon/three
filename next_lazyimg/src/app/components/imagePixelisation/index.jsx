"use client";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { useInView } from "react-intersection-observer";

export default function index({ src, src10 }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  // Detecting when in view
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });
  const canvas = useRef(null);

  useEffect(() => {
    if (inView && dimension.height > 0) {
      //animate after img has done loading, ref가 달린 요소를 추적함. + height가 생겨나는 조건 추가
      // console.log("true");
      const image = new Image();
      image.onload = () => {
        //animate
        setTimeout(() => {
          animate(image);
        }, 500);
      };
      image.src = src;
    }
  }, [inView, dimension]);

  const animate = (image, size = 20) => {
    let h = dimension.height;
    let w = dimension.width;
    // willReadFrequently 이는 소프트웨어(하드웨어 가속 대신) 2D 캔버스의 사용을 강제하며 getImageData() (en-US) 호출이 빈번할때 메모리를 절약할 수 있습니다.
    const ctx = canvas.current.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, w, h);

    if (size < 5) return; // 무한 렌더 방지
    // 이미지로부터 색상값을 얻기 위한 이미지 정보 추출 배열. ex) 400x600은 단순히 그 갯수뿐 아니라 x4만큼 rgba의 정보도 들어있음.
    const pixelArr = ctx.getImageData(0, 0, w, h).data;
    //loop the rows of pixels
    for (let y = 0; y < h; y += size) {
      //loop the column of pixels
      for (let x = 0; x < w; x += size) {
        let pos = (x + y * w) * 4;
        //각각 rgba에 값을 넣어주는 공식.
        ctx.fillStyle =
          "rgba(" +
          pixelArr[pos] +
          "," +
          pixelArr[pos + 1] +
          "," +
          pixelArr[pos + 2] +
          "," +
          pixelArr[pos + 3] +
          ")";
        //순회한 픽셀정보들의 색상값을 토대로. pixel rect를 채워주기.
        ctx.fillRect(x, y, size, size);
      }
    }

    setTimeout(() => {
      animate(image, size / 2);
    }, 200);
  };

  return (
    <div className={styles.imgContainer}>
      <NextImage
        ref={ref}
        src={src10}
        width={0}
        height={0}
        // 브라우저가 이미지를 즉시 렌더링, 어떤 지연 로딩도 않겠다.
        priority={true}
        // 로드되는 기본 이미지와 동일한 크기 생성
        onLoadingComplete={(e) => {
          setDimension((prev) => ({
            ...prev,
            width: e.width,
            height: e.height,
          }));
        }}
        alt="image"
      />
      {/* 이미지로부터 픽셀을 뽑아 변화를 그려줄 캔버스 생성 */}
      <canvas
        ref={canvas}
        width={dimension.width}
        height={dimension.height}
      ></canvas>
    </div>
  );
}
