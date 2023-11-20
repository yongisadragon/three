"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function index() {
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.7 } });
    tl.fromTo("p", { y: "-100%" }, { y: "0%" });
  }, []);
  return (
    <>
      <p style={{ color: "white", fontSize: "50px" }}>안녕안녕?!!?</p>
    </>
  );
}
