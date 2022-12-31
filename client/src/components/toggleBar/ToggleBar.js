import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ToggleBar.module.css";
import { toggleType } from "../../features/view";
import { selectVideo } from "../../features/video";
import { selectGenre } from "../../features/video";
import { isLoad } from "../../features/view";

const ToggleBar = () => {
  const dispatch = useDispatch();
  const viewType = useSelector((state) => state.view.viewType);

  useEffect(() => {
    var element = document.getElementById("marker");
    switch (viewType) {
      case 1:
        element.style = "margin-right:75px;";
        var series = document.getElementById("series");
        series.style = "color: rgb(var(--primary-text));";
        var movie = document.getElementById("movie");
        movie.style = "color: rgb(var(--back-color))";
        break;
      case 2:
        element.style = "margin-left:75px;";
        var movie = document.getElementById("movie");
        movie.style = "color: rgb(var(--primary-text))";
        var series = document.getElementById("series");
        series.style = "color: rgb(var(--back-color))";
        break;
    }
    dispatch(selectVideo(null));
    dispatch(selectGenre("All"));
  }, [viewType]);

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div id="marker" className={styles.marker}></div>
        <button
          id="movie"
          className={styles.movieButton}
          onClick={() => dispatch(toggleType(1))}
        >
          Movies
        </button>
        <button
          id="series"
          className={styles.seriesButton}
          onClick={() => dispatch(toggleType(2))}
        >
          TV Shows
        </button>
      </div>
    </div>
  );
};

export default ToggleBar;
