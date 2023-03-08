import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./MoviesScreen.module.css";

import ChipSlider from "../../components/chipSlider/ChipSlider";
import Preview from "../../components/preview/Preview";
import PreviewHero from "../../components/previewHero/PreviewHero";
import Editor from "../../components//editor/Editor";
import TopBar from "../../components/topBar/TopBar";
import VideoWall from "../../components/videoWall/VideoWall";

import { selectVideo } from "../../features/video";

import {
  useGetMoviesByGenreQuery,
  useGetMoviesBySearchQuery,
} from "../../features/api";

const MoviesScreen = () => {
  const isEditor = useSelector((state) => state.view.isEditor);
  const isLoad = useSelector((state) => state.view.isLoad);
  const viewType = useSelector((state) => state.view.viewType);

  const selectedSource = useSelector((state) => state.source.source);
  const selectedVideo = useSelector((state) => state.video.video);
  const search = useSelector((state) => state.video.search);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);

  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: moviesByTitle } = useGetMoviesBySearchQuery({
    search: search,
    input: title,
  });

  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    moviesByGenre && setMovies(moviesByGenre ?? []);
  }, [viewType, moviesByGenre]);

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
  }, [isEditor]);

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.content}>
        <div className={styles.center}>
          <div className={styles.header}>
            <div className={styles.light}>
              {viewType == 1 && selectedVideo && !isEditor && (
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
              <div id="editor">
                <Editor />
              </div>
              {selectedVideo && !isEditor ? <Preview /> : <PreviewHero />}
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
