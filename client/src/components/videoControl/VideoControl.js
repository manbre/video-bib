import React from "react";
import styles from "./VideoControl.module.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TopBar from "../topBar/TopBar";
import { selectAudio, selectGenre, selectVideo } from "../../features/video";
import {
  useUpdateMovieMutation,
  useUpdateEpisodeMutation,
} from "../../features/api";

import { useNavigate } from "react-router-dom";

const VideoControl = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const selectedNext = useSelector((state) => state.video.next);
  const selectedAudio = useSelector((state) => state.video.audio);
  const viewType = useSelector((state) => state.view.viewType);
  const [useUpdateMovie] = useUpdateMovieMutation();
  const [useUpdateEpisode] = useUpdateEpisodeMutation();
  const [isAudioSelect, setIsAudioSelect] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  var timeout;

  document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
      case 27: //escape
        e.preventDefault();
        isFullscreen && setIsFullscreen(false);
        break;
    }
  });

  document.addEventListener("mousemove", function (e) {
    let controls = document.getElementById("controls");
    controls.style = "opacity: 1;";
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      controls.style = "opacity: 0;";
    }, 2000);
  });

  useEffect(() => {
    let nextBtn = document.getElementById("nextBtn");
    selectedVideo && viewType == 2
      ? props.seek > selectedVideo.intro
        ? (nextBtn.innerHTML = "next episode")
        : (nextBtn.innerHTML = "skip intro")
      : null;
  }, [props.seek]);

  const handleClose = () => {
    dispatch(selectGenre("0"));
    navigate("/");
    if (selectedVideo) {
      switch (viewType) {
        case 1:
          useUpdateMovie({
            id: selectedVideo.id,
            elapsed_time: props.seek,
            last_viewed: new Date(),
          });
          break;
        case 2:
          useUpdateEpisode({
            id: selectedVideo.id,
            elapsed_time: props.seek,
            last_viewed: new Date(),
          });
          break;
      }
    }
    isFullscreen && setIsFullscreen(false);
  };

  const openAudioSelect = () => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (selectedAudio) {
      case 1:
        german[0].style = "border-top: 2px solid white;";
        selectedVideo.english ? (english[0].style = "border: none;") : null;
        break;
      case 2:
        english[0].style = "border-top: 2px solid white;";
        selectedVideo.german ? (german[0].style = "border: none;") : null;
        break;
    }
    if (isAudioSelect) {
      document.getElementById("audioDrop").style = "visibility: hidden;";
      setIsAudioSelect(false);
    } else {
      document.getElementById("audioDrop").style = "visibility: visible;";
      setIsAudioSelect(true);
    }
  };

  const takeAudio = (audio) => {
    let german = document.getElementsByClassName(`${styles.german}`);
    let english = document.getElementsByClassName(`${styles.english}`);
    switch (audio) {
      case 1:
        german[0].style = "border-top: 2px solid white;";
        selectedVideo.english ? (english[0].style = "border: none;") : null;
        dispatch(selectAudio(1));
        break;
      case 2:
        english[0].style = "border-top: 2px solid white;";
        selectedVideo.german ? (german[0].style = "border: none;") : null;
        dispatch(selectAudio(2));
        break;
    }
  };

  const handleNext = () => {
    selectedVideo.intro > 0 && selectedVideo.intro < props.seek
      ? props.changeSeek(selectedVideo.intro)
      : selectVideo(selectedNext);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      electron.enterFullscreen();
      setIsFullscreen(true);
    } else {
      electron.leaveFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    var bar = document.getElementById("topBar");
    isFullscreen
      ? bar && (bar.style = "display: none;")
      : bar && (bar.style = "display: block;");
  }, [isFullscreen]);

  return (
    <div className={styles.container}>
      <div id="topBar">
        <TopBar />
      </div>
      <div id="controls" className={styles.player}>
        <div className={styles.top}>
          <button className={styles.closeButton} onClick={handleClose}></button>
          <div className={styles.title}>
            <p>{props.title}</p>
            <p></p>
          </div>
          <div className={styles.audioSelect}>
            <button
              className={styles.speechButton}
              onClick={() => openAudioSelect()}
            ></button>
            <div id="audioDrop" className={styles.dropContent}>
              {selectedVideo && selectedVideo.german ? (
                <a className={styles.german} onClick={() => takeAudio(1)}></a>
              ) : (
                ""
              )}
              {selectedVideo && selectedVideo.english ? (
                <a className={styles.english} onClick={() => takeAudio(2)}></a>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={styles.controls}>
            {props.volume > 50 ? (
              <button className={styles.volumeOver}></button>
            ) : props.volume > 0 ? (
              <button className={styles.volumeUnder}></button>
            ) : (
              <button className={styles.volumeMute}></button>
            )}
            <input
              className={styles.volumeRange}
              type="range"
              min={0}
              max={100}
              value={props.volume}
              onChange={props.handleVolumeChange}
            ></input>
            <button
              className={styles.screenButton}
              onClick={() => toggleFullscreen()}
            ></button>
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
            min="0"
            max={props.duration}
            onChange={props.handleSeekChange}
            value={props.seek}
          ></input>
        </div>
        <div className={styles.bottom}>
          <p className={styles.time}>
            {props.time} / {props.timeTotal}
          </p>
          <button
            id="nextBtn"
            className={styles.nextButton}
            onClick={() => handleNext()}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default VideoControl;
