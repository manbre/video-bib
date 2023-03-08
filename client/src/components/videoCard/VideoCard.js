import React from "react";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoCard.module.css";
import { selectVideo } from "../../features/video";

const VideoCard = ({ video }) => {
  const markedCard = useSelector((state) => state.view.card);
  const viewType = useSelector((state) => state.view.viewType);
  const selectedSource = useSelector((state) => state.source.source);
  const dispatch = useDispatch();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    var elements = document.getElementsByClassName(`${styles.container}`);
    var posters = document.getElementsByClassName(`${styles.poster}`);
    var infos = document.getElementsByClassName(`${styles.info}`);
    if (markedCard !== null && elements[markedCard]) {
      elements[markedCard].style =
        "outline: 4px solid white; transform: scaleY(1.1);";
      posters[markedCard].style = "transform: scaleY(0.9) translateY(-12px);";
      infos[markedCard].style = "  transform: scaleY(0.9) translateY(0.5em);";
      //
      for (let i = 0; i < elements.length; i++) {
        if (i != markedCard) {
          elements[i].style = "border: none;";
          posters[i].style = "z-index: 2;";
          infos[i].style = " translateY(0.5em);";
        }
      }
    }
    if (markedCard == null && isLoaded) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style = "border: none;";
        posters[i].style = "z-index: 2;";
        infos[i].style = " translateY(0.5em);";
      }
    }
  }, [markedCard]);

  const getTitle = () => {
    switch (viewType) {
      case 1:
        return <p>{video.title}</p>;
      case 2:
        return (
          <>
            <p>
              {video.series} - Season {video.season}
            </p>
          </>
        );
    }
  };

  return (
    <div
      className={styles.container}
      onClick={() => dispatch(selectVideo(video))}
    >
      <div className={styles.poster}>
        <img
          src={`file:///${selectedSource}/${video.poster}`}
          onError={(event) =>
            (event.target.src = require("../../assets/images/placeholder.jpg").default)
          }
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.title}>{getTitle()}</div>
        <div className={styles.bottom}>
          <div className={styles.year}>
            <p>{video.year}</p>
          </div>
          <div className={styles.languages}>
            {video.german && <span className={styles.german}></span>}
            {video.english && <span className={styles.english}></span>}
          </div>
          <div className={styles.runtime}>
            <p>{video.runtime} min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
