import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";

import TopBar from "../../components/topBar/TopBar";
import Preview from "../../components/preview/Preview";
import PreviewHero from "../../components/previewHero/PreviewHero";
import SearchBar from "../../components/searchBar/SearchBar";
import ToggleBar from "../../components/toggleBar/ToggleBar";
import ChipSlider from "../../components/chipSlider/ChipSlider";
import VideoCard from "../../components/videoCard/VideoCard";
import SideEditor from "../../components/sideEditor/Editor";
import SpinLoader from "../../components/spinLoader/SpinLoader";
import { selectVideo } from "../../features/video";
import { selectCard } from "../../features/view";

import {
  useGetMoviesByTitleQuery,
  useGetSeasonsBySeriesQuery,
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
} from "../../features/api";

const Home = () => {
  const isEditor = useSelector((state) => state.view.isEditor);
  const viewType = useSelector((state) => state.view.viewType);
  const isLoad = useSelector((state) => state.view.isLoad);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);
  //
  const selectedVideo = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: seasonsByGenre } = useGetSeasonsByGenreQuery(genre);
  const { data: moviesByTitle } = useGetMoviesByTitleQuery(title);
  const { data: seasonsBySeries } = useGetSeasonsBySeriesQuery(title);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loader = document.getElementById("loader");
    isLoad
      ? loader
        ? (loader.style = "display: block;")
        : null
      : loader
      ? (loader.style = "display: none;")
      : null;
  }, [isLoad]);

  useEffect(() => {
    let index = selectedVideo
      ? videos.findIndex((video) => video.id === selectedVideo.id)
      : null;
    dispatch(selectCard(index));
  }, [selectedVideo]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setVideos(moviesByGenre ?? []);
        break;
      case 2:
        setVideos(seasonsByGenre ?? []);
        break;
    }
  }, [viewType, moviesByGenre, seasonsByGenre]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setVideos(moviesByTitle ?? []);
        break;
      case 2:
        setVideos(seasonsBySeries ?? []);
        break;
    }
  }, [moviesByTitle, seasonsBySeries]);

  useEffect(() => {
    var editor = document.getElementById("editor");
    isEditor
      ? (editor.style = "display: block;")
      : (editor.style = "display: none;");
  }, [isEditor]);

  return (
    <div className={styles.container}>
      <TopBar />
      <div id="loader" className={styles.loader}>
        <SpinLoader />
      </div>
      <div className={styles.content}>
        <div id="editor">
          <SideEditor />
        </div>
        <div className={styles.center}>
          <div className={styles.header}>
            <div id="preview" className={styles.preview}>
              {selectedVideo && (
                <button
                  className={styles.closeBtn}
                  onClick={() => dispatch(selectVideo(null))}
                ></button>
              )}
              {selectedVideo ? <Preview /> : <PreviewHero />}
            </div>

            <div className={styles.navigation}>
              <div className={styles.navBars}>
                <SearchBar className={styles.searchBar} />
                <ToggleBar />
              </div>
              <ChipSlider />
            </div>
          </div>

          <div className={styles.cluster}>
            {videos.map((video) => (
              <VideoCard video={video} key={video.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
