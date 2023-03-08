import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./TopBar.module.css";
import { toggleEditor } from "../../features/view";

const TopBar = () => {
  const [isMax, setIsMax] = useState(true);
  const isEditor = useSelector((state) => state.view.isEditor);
  const dispatch = useDispatch();

  window.addEventListener("resize", () => {
    var A = screen.availWidth;
    var AA = window.outerWidth;

    var B = screen.availHeight;
    var BB = window.outerHeight;

    if (A == AA && B == BB) {
      setIsMax(true);
    } else {
      setIsMax(false);
    }
  });

  const checkWindow = () => {
    var A = screen.availWidth;
    var AA = window.outerWidth;

    var B = screen.availHeight;
    var BB = window.outerHeight;

    if (A == AA && B == BB) {
      setIsMax(true);
    } else {
      setIsMax(false);
    }
    electron.maxApp.max();
  };

  return (
    <div className={styles.container}>
      <div className={styles.dragBar}></div>
      <button
        className={isEditor ? styles.closeMenuBtn : styles.openMenuBtn}
        onClick={() => dispatch(toggleEditor())}
      ></button>
      <div className={styles.buttonsBar}>
        <button
          className={styles.minBtn}
          onClick={() => {
            electron.minApp.min();
          }}
        ></button>
        <button
          className={isMax ? styles.restoreBtn : styles.maxBtn}
          onClick={() => {
            checkWindow();
          }}
        ></button>
        <button
          className={styles.closeBtn}
          onClick={() => {
            electron.closeApp.close();
          }}
        ></button>
      </div>
    </div>
  );
};

export default TopBar;
