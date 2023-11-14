"use client";
import styles from "./page.module.scss";
import StickyCursor from "../components/stickyCursor";
import { useRef } from "react";
import Header from "../components/header";
export default function Home() {
  const stickyElement = useRef(null);
  return (
    <main className={styles.main}>
      <Header ref={stickyElement} />
      <StickyCursor stickyElement={stickyElement} />
    </main>
  );
}
