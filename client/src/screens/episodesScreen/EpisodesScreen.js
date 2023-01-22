import React from "react";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LoadingContext } from "react-router-loading";
import styles from "./EpisodesScreen.module.css";

import ChipSlider from "../../components/chipSlider/ChipSlider";
import Preview from "../../components/preview/Preview";
import PreviewHero from "../../components/previewHero/PreviewHero";
import SideEditor from "../../components/sideEditor/Editor";
import SpinLoader from "../../components/spinLoader/SpinLoader";
import TopBar from "../../components/topBar/TopBar";
import VideoWall from "../../components/videoWall/VideoWall";

import { selectVideo } from "../../features/video";

import {
  useGetSeasonsByGenreQuery,
  useGetSeasonsBySeriesQuery,
} from "../../features/api";

const EpisodesScreen = () => {
  const loadingContext = useContext(LoadingContext);
  const isEditor = useSelector((state) => state.view.isEditor);
  const isLoad = useSelector((state) => state.view.isLoad);

  const selectedVideo = useSelector((state) => state.video.video);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);

  const { data: seasonsByGenre } = useGetSeasonsByGenreQuery(genre);
  const { data: seasonsBySeries } = useGetSeasonsBySeriesQuery(title);

  const dispatch = useDispatch();

  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
  }, [seasons]);

  useEffect(() => {
    seasonsByGenre && setSeasons(seasonsByGenre ?? []);
    loadingContext.done();
  }, [seasonsByGenre]);

  useEffect(() => {
    seasonsBySeries && setSeasons(seasonsBySeries ?? []);
  }, [seasonsBySeries]);

  useEffect(() => {
    const loader = document.getElementById("loader");
    isLoad
      ? loader && (loader.style = "display: block;")
      : loader && (loader.style = "display: none;");
  }, [isLoad]);

  /*   useEffect(() => {
    !isLoading && loadingContext.done();
  }, [isLoading]); */

  useEffect(() => {
    const editor = document.getElementById("editor");
    isEditor
      ? (editor.style = "display: block;")
      : (editor.style = "display: none;");
    window.dispatchEvent(new Event("resize"));
  }, [isEditor]);

  return (
    <div className={styles.container}>
      <TopBar />
{/*       <div id="loader" className={styles.loader}>
        <SpinLoader />
      </div> */}
      <div className={styles.content}>
        <div id="editor">
          <SideEditor />
        </div>
        <div className={styles.center}>
          <div className={styles.header}>
            <div className={styles.light}></div>
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
          <VideoWall filteredVideos={seasons} />
        </div>
      </div>
    </div>
  );
};

export default EpisodesScreen;
