import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ChipSlider.module.css";
import { selectGenre } from "../../features/video";
import { selectVideo } from "../../features/video";
import {
  useGetAllMovieGenresQuery,
  useGetAllEpisodeGenresQuery,
} from "../../features/api";

const ChipSlider = () => {
  const [stepWidth, setStepWidth] = useState([]);
  const [slideList, setSlideList] = useState([]);
  const [scrollWidth, setScrollWidth] = useState([]);
  const [parentWidth, setParentWidth] = useState([]);
  const [overflow, setOverflow] = useState([]);
  const [count, setCount] = useState(1);
  const [lastEventTarget, setLastEventTarget] = useState([]);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();
  const selectedGenre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);
  const isEditor = useSelector((state) => state.view.isEditor);
  const { data: movieGenres } = useGetAllMovieGenresQuery();
  const { data: episodeGenres } = useGetAllEpisodeGenresQuery();

  window.addEventListener("resize", () => {
    var container = document.getElementById("container");
    setParentWidth(container.parentElement.clientWidth);
    var slider = document.getElementById("slider");
    setScrollWidth(slider.scrollWidth + 10);
    setOverflow(slider.scrollWidth - container.parentElement.clientWidth);
  });

/*   useEffect(() => {
    var container = document.getElementById("container");
    setParentWidth(container.parentElement.clientWidth);
    var slider = document.getElementById("slider");
    setScrollWidth(slider.scrollWidth + 10);
    setOverflow(slider.scrollWidth - container.parentElement.clientWidth);
  }, [isEditor]); */

  useEffect(() => {
    switch (viewType) {
      case 1:
        setGenres(movieGenres ?? []);
        break;
      case 2:
        setGenres(episodeGenres ?? []);
        break;
    }
  }, [viewType, movieGenres, episodeGenres]);

  useEffect(() => {
    if (selectedGenre == "All") {
      document.getElementById("all").click();
    }
  }, [selectedGenre]);

  useEffect(() => {
    var container = document.getElementById("container");
    setParentWidth(container.parentElement.clientWidth);
    var slider = document.getElementById("slider");
    setStepWidth(slider.clientWidth);
    var list = document.getElementById("slideWrap");
    setSlideList(list);
    setScrollWidth(slider.scrollWidth + 10);
    setOverflow(slider.scrollWidth - container.parentElement.clientWidth);
    document.getElementById("all").click();
  }, []);

  useEffect(() => {
    if (overflow == 0) {
      var next = document.getElementById("next");
      next.style = "display: none;";
      var prev = document.getElementById("prev");
      prev.style = "display: none;";
    } else if (overflow > 0 && count == 1) {
      var prev = document.getElementById("prev");
      prev.style = "display: none;";
      var next = document.getElementById("next");
      next.style = "display: block;";
    } else if (overflow < 0) {
      var next = document.getElementById("next");
      next.style = "display: none;";
    }
  }, [overflow, count]);

  /**
   * Style selected Chip
   * @param {event} event
   */
  const styleSelectedChip = (event) => {
    lastEventTarget.style =
      "background: rgb(var(--menu-color)); color: rgb(var(primary-text));";
    var chip = event.target;
    chip.style =
      "background: rgb(var(--secondary-text)); color: rgb(var(--menu-color));";
    var genre = chip.innerText;
    setLastEventTarget(chip);
    dispatch(selectVideo(null));
    dispatch(selectGenre(genre));
  };

  const styleOverChip = (event) => {
    event.target != lastEventTarget
      ? (event.target.style = "background: rgb(var(--hover-color));")
      : null;
  };

  const styleOutChip = (event) => {
    event.target != lastEventTarget
      ? (event.target.style = "background: rgb(var(--menu-color));")
      : null;
  };

  const prevSlide = () => {
    var next = document.getElementById("next");
    next.style = "display: block;";
    if (count > 1) {
      setOverflow(overflow + stepWidth + 10);
      let c = count - 2;
      slideList.style.left = "-" + c * stepWidth + "px";
      c++;
      setCount(c);
    } else {
      setOverflow(scrollWidth - parentWidth);
    }
  };

  const nextSlide = () => {
    if (overflow > 0) {
      var prev = document.getElementById("prev");
      prev.style = "display: block;";
      slideList.style.left = "-" + count * stepWidth + "px";
      let c = count + 1;
      setOverflow(overflow - stepWidth - 10);
      setCount(c);
    }
  };

  return (
    <div id="container" className={styles.container}>
      <a id="prev" className={styles.prev} href="#" onClick={prevSlide}>
        &#10094;
      </a>
      <div id="slider" className={styles.slider}>
        <ul id="slideWrap" className={styles.wrap}>
          <button
            id="all"
            className={styles.chip}
            onClick={(e) => styleSelectedChip(e)}
            onMouseOver={(e) => styleOverChip(e)}
            onMouseOut={(e) => styleOutChip(e)}
          >
            All
          </button>
          {genres.map((genre, key) => (
            <button
              className={styles.chip}
              key={key}
              onClick={(e) => styleSelectedChip(e)}
              onMouseOver={(e) => styleOverChip(e)}
              onMouseOut={(e) => styleOutChip(e)}
            >
              {genre}
            </button>
          ))}
        </ul>
      </div>
      <a id="next" className={styles.next} href="#" onClick={nextSlide}>
        &#10095;
      </a>
    </div>
  );
};

export default ChipSlider;
