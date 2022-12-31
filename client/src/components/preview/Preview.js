import React from "react";
import { useState, useEffect } from "react";
import styles from "./Preview.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardSlider from "../cardSlider/CardSlider";

const Preview = () => {
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const selectedSource = useSelector((state) => state.source.source);
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  //
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  const [year, setYear] = useState("");
  const [runtime, setRuntime] = useState(0);
  const [poster, setPoster] = useState("");
  //
  const [trailer, setTrailer] = useState("");
  const [rating, setRating] = useState(0);
  const [awards, setAwards] = useState(0);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setTitle(selectedVideo.title);
        setYear(selectedVideo.year);
        setDirector(selectedVideo.director);
        setGenre(selectedVideo.genre);
        setActors(selectedVideo.actors);
        setPlot(selectedVideo.plot);
        setRuntime(selectedVideo.runtime);
        setPoster(selectedVideo.poster);
        //
        setTrailer(selectedVideo.trailer);
        setRating(selectedVideo.rating);
        setAwards(selectedVideo.awards);
        break;
      case 2:
        setTitle(selectedVideo.title);
        setYear(selectedVideo.year);
        setDirector(selectedVideo.director);
        setGenre(selectedVideo.genre);
        setActors(selectedVideo.actors);
        setPlot(selectedVideo.plot);
        setRuntime(selectedVideo.runtime);
        setPoster(selectedVideo.poster);
        break;
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (trailer && viewType == 1) {
      const elements = document.getElementsByClassName(`${styles.trailer}`);
      elements[0].muted = false;
      setIsMuted(false);
    }
  }, [selectedVideo]);

  const toggleMute = () => {
    const elements = document.getElementsByClassName(`${styles.trailer}`);
    if (elements[0].muted) {
      elements[0].muted = false;
      setIsMuted(false);
    } else {
      elements[0].muted = true;
      setIsMuted(true);
    }
  };

  const playVideo = (isContinue) => {
    navigate(`/watch/${isContinue}`);
  };

  const getButtons = () => {
    if (selectedVideo.elapsed_time > 0) {
      return (
        <div className={styles.btns}>
          <button className={styles.play1Btn} onClick={() => playVideo(1)}>
            Continue
          </button>

          <button className={styles.play2Btn} onClick={() => playVideo(0)}>
            Play
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.btns}>
          <button className={styles.play2Btn} onClick={() => playVideo(0)}>
            Play
          </button>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.description}>
          <div className={styles.title}>
            <p>{title}</p>
          </div>
          <div className={styles.numbers}>
            {viewType == 1 ? (
              <div className={styles.rating}>
                {rating > 59 ? (
                  <span className={styles.tomatoes}></span>
                ) : (
                  <span className={styles.rotten}></span>
                )}

                <p>{rating} %</p>
              </div>
            ) : null}
            <div className={styles.runtime}>
              <span className={styles.hourglass}></span>
              <p>{runtime} min</p>
            </div>
            <div className={styles.year}>
              <span className={styles.calendar}></span>
              <p>{year}</p>
            </div>
            {viewType == 1 ? (
              <div className={styles.awards}>
                {awards > 0 ? <span className={styles.oscar}></span> : ""}
                {awards > 0 ? <p>{awards}</p> : ""}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={styles.plot}>{plot}</div>
          <div className={styles.row}>
            <div className={styles.col1}>
              <p>Director</p>
              <p>Actors</p>
              <p>Genre</p>
            </div>
            <div className={styles.col2}>
              <p>{director}</p>
              <p>{actors}</p>
              <p>{genre}</p>
            </div>
          </div>
          {getButtons()}
        </div>
        {viewType == 1 && trailer ? (
          <button
            className={isMuted ? styles.volBtn : styles.muteBtn}
            onClick={() => toggleMute()}
          ></button>
        ) : null}
      </div>
      <div id="wall" className={styles.videoWall}>
        {viewType == 1 && trailer ? (
          <video
            className={styles.trailer}
            autoPlay
            loop
            src={`file:///${selectedSource}//${trailer}`}
          ></video>
        ) : viewType == 1 ? (
          <img
            className={styles.poster}
            src={`file:///${selectedSource}//${poster}`}
            onError={(event) => (event.target.style.display = "none")}
            onLoad={(event) => (event.target.style.display = "inline-block")}
          ></img>
        ) : null}
      </div>
      {viewType == 2 ? <CardSlider /> : ""}
    </div>
  );
};

export default Preview;
