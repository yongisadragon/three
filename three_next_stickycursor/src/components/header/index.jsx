import { forwardRef } from "react";
import styles from "./style.module.scss";

const Header = forwardRef(function index(props, ref) {
  return (
    <div className={styles.header}>
      <div ref={ref} className={styles.burger}>
        <div className={styles.bounds}></div>
      </div>
    </div>
  );
});
export default Header;
