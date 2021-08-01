import React from "react";
import styles from "./../../styles/BottomNavbar.module.scss";

export default function NavbarContainer(props) {
  return (
    <header className={styles.bottomHeader}>
      <div className={styles.container}>
        <nav className={styles.bottomNav}>{props.children}</nav>
      </div>
    </header>
  );
}
