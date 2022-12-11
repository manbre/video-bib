import React from "react";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoCard.module.css";
import { selectVideo } from "../../features/video";

const VideoCard = ({ video, index }) => {
  const selected = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const dispatch = useDispatch();

  const selectedSource = useSelector((state) => state.source.source);

  useEffect(() => {
    var elements = document.getElementsByClassName(`${styles.progress}`);
    for (let i = 0; i < elements.length; i++) {
      elements[i].style = "width: 30%;";
    }
  }, []);

  useEffect(() => {
    if (!selected) {
      var elements = document.getElementsByClassName(`${styles.container}`);
      var posters = document.getElementsByClassName(`${styles.poster}`);
      for (let i = 0; i < elements.length; i++) {
        elements[i].style = "border: none;";
        posters[i].style = "z-index: 2;";
      }
    }
  }, [selected]);

  const markSelected = () => {
    var elements = document.getElementsByClassName(`${styles.container}`);
    var posters = document.getElementsByClassName(`${styles.poster}`);
    var infos = document.getElementsByClassName(`${styles.info}`);
    elements[index].style = "outline: 4px solid white; transform: scaleY(1.1);";
    posters[index].style = "transform: scaleY(0.9) translateY(-10px);";
    infos[index].style = "  transform: scaleY(0.9) translateY(1em);";
    dispatch(selectVideo(video));

    for (let i = 0; i < elements.length; i++) {
      if (i != index) {
        elements[i].style = "border: none;";
        posters[i].style = "z-index: 2;";
        infos[i].style = " translateY(1em);";
      }
    }
  };

  const getTitle = () => {
    switch (viewType) {
      case 1:
        return <p>{video.title}</p>;
      case 2:
        return (
          <>
            <p>{video.series}</p>
            <p>- Season {video.season}</p>
          </>
        );
    }
  };

  return (
    <div className={styles.container} onClick={markSelected}>
      <div className={styles.poster}>
        <img
          src={`file:///${selectedSource}//${video.poster}`}
          onError={(event) =>
            (event.target.src = require("../../assets/images/placeholder.jpg").default)
          }
          onLoad={(event) => (event.target.style.display = "inline-block")}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.top}>
          <div className={styles.year}>
            <p>{video.year}</p>
          </div>
          <div className={styles.languages}>
            {video.german ? <span className={styles.german}></span> : ""}
            {video.english ? <span className={styles.english}></span> : ""}
          </div>
          <div className={styles.runtime}>
            <p>{video.runtime} min</p>
          </div>
        </div>
        <div className={styles.title}>{getTitle()}</div>
      </div>
    </div>
  );
};

export default VideoCard;
