import { Box } from "@chakra-ui/layout";
import React from "react";
import styles from "./../../styles/BottomNavbar.module.scss";

export default function Nav(props) {
  return (
    <Box className={styles.bottomNavItem} {...props}>
      <Box className={styles.bottomNavLink}>
        {!props.children ? (
          <>
            <Box
              as={"i"}
              color={props.titleColor ? props.titleColor : "#ff9f1c"}
            >
              {props.icon}
            </Box>
            <Box
              as={"span"}
              fontSize={["md", "lg"]}
              color={props.titleColor ? props.titleColor : "#ff9f1c"}
            >
              {props.title}
            </Box>
          </>
        ) : (
          props.children
        )}
      </Box>
    </Box>
  );
}
