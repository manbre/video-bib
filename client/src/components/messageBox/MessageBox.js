import React from "react";
import styles from "./MessageBox.module.css";

const MessageBox = ({ message, onDialog }) => {
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.bar}></div>
        <div className={styles.messageRow}>
          <label className={styles.symbol}></label>
          <p className={styles.message}>{message}</p>
        </div>
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
