import React from "react";
import styles from "./VideoControl.module.css";
import { useDispatch } from "react-redux";
import TopBar from "../topBar/TopBar";
import { selectGenre } from "../../features/video";

import { useNavigate } from "react-router-dom";

const VideoControl = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectGenre("0"));
    navigate("/");
  };
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.player}>
        <div className={styles.top}>
          <button className={styles.closeButton} onClick={handleClick}></button>
          <div className={styles.title}>
            <p>{props.title}</p>
            <p></p>
          </div>
          <div className={styles.controls}>
            {props.volume > 50 ? (
              <button className={styles.volumeOver}></button>
            ) : (
              <button className={styles.volumeUnder}></button>
            )}
            <input
              className={styles.volumeRange}
              type="range"
              min={0}
              max={100}
              value={props.volume}
              onChange={props.handleVolumeChange}
            ></input>
            <button className={styles.screenButton}></button>
          </div>
        </div>
        <div className={styles.mid}>
          <button
            className={styles.rewind}
            onClick={props.handleRewind}
          ></button>
          {props.playing ? (
            <button
              className={styles.pause}
              onClick={props.togglePlay}
            ></button>
          ) : (
            <button className={styles.play} onClick={props.togglePlay}></button>
          )}
          <button
            className={styles.forward}
            onClick={props.handleForward}
          ></button>
        </div>
        <div className={styles.progress}>
          <input
            className={styles.seekRange}
            type="range"
            min={0}
            max={props.duration}
            onChange={props.handleSeekChange}
            value={props.seek}
          ></input>
        </div>
        <div className={styles.bottom}>
          <p className={styles.time}>
            {props.time} / {props.timeTotal}
          </p>
          <button className={styles.nextButton}>Nächste Folge</button>
        </div>
      </div>
    </div>
  );
};

export default VideoControl;
