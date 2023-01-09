import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./CardSlider.module.css";
import { selectVideo } from "../../features/video";
import { selectNext } from "../../features/video";
import { useGetEpisodeBySeasonQuery } from "../../features/api";

const CardSlider = () => {
  const [episodes, setEpisodes] = useState([]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const source = useSelector((state) => state.source.source);
  const { data: episodesBySeason } = useGetEpisodeBySeasonQuery({
    series: selectedVideo.series,
    season: selectedVideo.season,
  });

  useEffect(() => {
 dispatch(selectNext(episodes[index + 1]));
    console.log(episodes[index + 1]);
  }, [selectedVideo]);

  useEffect(() => {
    setEpisodes(episodesBySeason ?? []);
  }, [episodesBySeason]);

  useEffect(() => {
    selectVideo(episodes[0]);
  }, [episodes]);

  const nextSlide = () => {
    index < episodes.length - 1 ? setIndex(index + 1) : setIndex(0);
    index < episodes.length - 1
      ? dispatch(selectVideo(episodes[index + 1]))
      : dispatch(selectVideo(episodes[0]));
  };

  const prevSlide = () => {
    index > 0 ? setIndex(index - 1) : setIndex(episodes.length - 1);
    index > 0
      ? dispatch(selectVideo(episodes[index - 1]))
      : dispatch(selectVideo(episodes[episodes.length - 1]));
  };

  return (
    <div className={styles.container}>
      <a className={styles.prev} href="#" onClick={() => prevSlide()}>
        &#10094;
      </a>
      <div className={styles.card}>
        <div className={styles.poster}>
          <img
            src={`file:///${source}//${
              episodes[index] ? episodes[index].poster : ""
            }`}
            onError={(event) =>
              (event.target.src = require("../../assets/images/placeholder.jpg").default)
            }
            onLoad={(event) => (event.target.style.display = "inline-block")}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.series}>
            {episodes[index] ? episodes[index].series : ""}
          </div>
          <div className={styles.episode}>
            {episodes[index]
              ? "S " +
                episodes[index].season +
                ", Ep " +
                episodes[index].episode
              : ""}
          </div>
          <div className={styles.counter}>{`${index + 1} / ${
            episodes.length
          }`}</div>
          <div className={styles.languages}>
            {episodes[index] && episodes[index].german ? (
              <span className={styles.german}></span>
            ) : (
              ""
            )}
            {episodes[index] && episodes[index].english ? (
              <span className={styles.english}></span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <a className={styles.next} href="#" onClick={() => nextSlide()}>
        &#10095;
      </a>
    </div>
  );
};

export default CardSlider;
