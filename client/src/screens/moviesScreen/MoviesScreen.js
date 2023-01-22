import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./MoviesScreen.module.css";

import ChipSlider from "../../components/chipSlider/ChipSlider";
import Preview from "../../components/preview/Preview";
import PreviewHero from "../../components/previewHero/PreviewHero";
import SideEditor from "../../components/sideEditor/Editor";
import SpinLoader from "../../components/spinLoader/SpinLoader";
import TopBar from "../../components/topBar/TopBar";
import VideoWall from "../../components/videoWall/VideoWall";

import { selectVideo } from "../../features/video";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesByTitleQuery,
} from "../../features/api";

const MoviesScreen = () => {
  const isEditor = useSelector((state) => state.view.isEditor);
  const isLoad = useSelector((state) => state.view.isLoad);
  const viewType = useSelector((state) => state.view.viewType);

  const selectedSource = useSelector((state) => state.source.source);
  const selectedVideo = useSelector((state) => state.video.video);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: moviesByTitle } = useGetMoviesByTitleQuery(title);

  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [moviesByGenre]);

  useEffect(() => {
    moviesByTitle && setMovies(moviesByTitle ?? []);
  }, [moviesByTitle]);

  useEffect(() => {
    let loader = document.getElementById("loader");
    isLoad
      ? loader && (loader.style = "display: block;")
      : loader && (loader.style = "display: none;");
  }, [isLoad]);

  useEffect(() => {
    let editor = document.getElementById("editor");
    isEditor
      ? (editor.style = "display: block;")
      : (editor.style = "display: none;");
    window.dispatchEvent(new Event("resize"));
  }, [isEditor]);

  return (
    <div className={styles.container}>
      <TopBar />
   {/*    <div id="loader" className={styles.loader}>
        <SpinLoader />
      </div> */}
      <div className={styles.content}>
        <div id="editor">
          <SideEditor />
        </div>
        <div className={styles.center}>
          <div className={styles.header}>
            <div className={styles.light}>
              {viewType == 1 && selectedVideo && (
                <video
                  className={styles.light_trailer}
                  autoPlay
                  loop
                  muted
                  src={`file:///${selectedSource}//${selectedVideo.trailer}`}
                ></video>
              )}
            </div>
            <div className={styles.preview}>
              {selectedVideo && (
                <button
                  className={styles.closeBtn}
                  onClick={() => dispatch(selectVideo(null))}
                ></button>
              )}
              {selectedVideo ? <Preview /> : <PreviewHero />}
            </div>
            <ChipSlider />
          </div>
          <VideoWall filteredVideos={movies} />
        </div>
      </div>
    </div>
  );
};

export default MoviesScreen;
