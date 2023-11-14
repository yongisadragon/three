import NextImage from "next/image";
import { useState } from "react";

export default function index({ src, src10 }) {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  return (
    <div className={styles.imageContainer}>
      <NextImage
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
      />
      {/* 이미지로부터 픽셀을 뽑아 변화를 그려줄 캔버스 생성 */}
      <canvas width={dimension.width} height={dimension.height}></canvas>
    </div>
  );
}
