import React from "react";
import styles from "./MessageBox.module.css";

const MessageBox = ({ message, onDialog }) => {
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <label className={styles.symbol}></label>
        <p className={styles.message}>{message}</p>
        <div className={styles.btnsRow}>
          <button className={styles.btn} onClick={() => onDialog(true)}>
            Yes
          </button>
          <button className={styles.btn} onClick={() => onDialog(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
