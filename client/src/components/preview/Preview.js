import React from "react";
import { useState, useEffect } from "react";
import styles from "./Preview.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardSlider from "../cardSlider/CardSlider";

const Preview = () => {
  const selected = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType);
  const selectedSource = useSelector((state) => state.source.source);
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(true);
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
        setTitle(selected.title);
        setYear(selected.year);
        setDirector(selected.director);
        setGenre(selected.genre);
        setActors(selected.actors);
        setPlot(selected.plot);
        setRuntime(selected.runtime);
        setPoster(selected.poster);
        //
        setTrailer(selected.trailer);
        setRating(selected.rating);
        setAwards(selected.awards);
        break;
      case 2:
        setTitle(selected.title);
        setYear(selected.year);
        setDirector(selected.director);
        setGenre(selected.genre);
        setActors(selected.actors);
        setPlot(selected.plot);
        setRuntime(selected.runtime);
        setPoster(selected.poster);
        break;
    }
  }, [selected]);

  useEffect(() => {
    if (trailer && viewType == 1) {
      const elements = document.getElementsByClassName(`${styles.trailer}`);
      elements[0].muted = true;
      setIsMuted(true);
    }
  }, [selected]);

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

  const playVideo = () => {
    navigate(`/watch/${selected.title}/${selected.german}`);
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
          <div className={styles.btns}>
            <button className={styles.play1Btn}>Continue</button>
            <button className={styles.play2Btn} onClick={() => playVideo()}>
              Play
            </button>
          </div>
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
            muted
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
