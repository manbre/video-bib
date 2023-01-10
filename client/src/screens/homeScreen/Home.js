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
import MessageBox from "../../components/messageBox/MessageBox";
import { selectVideo } from "../../features/video";
import { selectNext } from "../../features/video";
import { markCard } from "../../features/view";

import {
  useGetAllEpisodesQuery,
  useGetMoviesByGenreQuery,
  useGetSeasonsByGenreQuery,
  useGetMoviesByTitleQuery,
  useGetSeasonsBySeriesQuery,
} from "../../features/api";

const Home = () => {
  const isEditor = useSelector((state) => state.view.isEditor);
  const viewType = useSelector((state) => state.view.viewType);
  const isLoad = useSelector((state) => state.view.isLoad);
  const selectedSource = useSelector((state) => state.source.source);

  const genre = useSelector((state) => state.video.genre);
  const title = useSelector((state) => state.video.title);
  //
  const selectedVideo = useSelector((state) => state.video.video);
  const dispatch = useDispatch();
  const { data: allMovies } = useGetMoviesByGenreQuery("All");
  const { data: allEpisodes } = useGetAllEpisodesQuery();
  const { data: moviesByGenre } = useGetMoviesByGenreQuery(genre);
  const { data: seasonsByGenre } = useGetSeasonsByGenreQuery(genre);
  const { data: moviesByTitle } = useGetMoviesByTitleQuery(title);
  const { data: seasonsBySeries } = useGetSeasonsBySeriesQuery(title);
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const loader = document.getElementById("loader");
    isLoad
      ? loader && (loader.style = "display: block;")
      : loader && (loader.style = "display: none;");
  }, [isLoad]);

  useEffect(() => {
    let globalIndex =
      selectedVideo &&
      allVideos.findIndex((video) => video.id == selectedVideo.id);
    dispatch(selectNext(allVideos[globalIndex + 1]));
    let localIndex =
      selectedVideo &&
      filteredVideos.findIndex((video) => video.id == selectedVideo.id);
    dispatch(markCard(localIndex));
  }, [selectedVideo]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setAllVideos(allMovies ?? []);
        break;
      case 2:
        setAllVideos(allEpisodes ?? []);
        break;
    }
  }, [viewType, allMovies, allEpisodes]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setFilteredVideos(moviesByGenre ?? []);
        break;
      case 2:
        setFilteredVideos(seasonsByGenre ?? []);
        break;
    }
  }, [viewType, moviesByGenre, seasonsByGenre]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        setFilteredVideos(moviesByTitle ?? []);
        break;
      case 2:
        setFilteredVideos(seasonsBySeries ?? []);
        break;
    }
  }, [moviesByTitle, seasonsBySeries]);

  useEffect(() => {
    var editor = document.getElementById("editor");
    isEditor
      ? (editor.style = "display: block;")
      : (editor.style = "display: none;");
    window.dispatchEvent(new Event("resize"));
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
            <div className={styles.navBars}>
              <SearchBar className={styles.searchBar} />
              <ToggleBar />
            </div>
            <ChipSlider />
          </div>
          <div className={styles.cluster}>
            {filteredVideos.map((video) => (
              <VideoCard video={video} key={video.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
