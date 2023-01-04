import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./MessageBox.module.css";

const MessageBox = () => {
  return (
    <div className={styles.container}>
      <div className={styles.bar}></div>
      <div className={styles.messageRow}>
        <label className={styles.symbol}></label>
        <p className={styles.message}></p>
      </div>
      <div className={styles.btnsRow}>
        <button className={styles.btn}>Yes</button>
        <button className={styles.btn}>No</button>
      </div>
    </div>
  );
};

export default MessageBox;
