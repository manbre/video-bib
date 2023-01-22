import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./VideoWall.module.css";

import VideoCard from "../../components/videoCard/VideoCard";

import { selectNext } from "../../features/video";
import { markCard } from "../../features/view";

import {
  useGetAllMoviesQuery,
  useGetAllEpisodesQuery,
} from "../../features/api";

const VideoWall = ({ filteredVideos }) => {
  const viewType = useSelector((state) => state.view.viewType);
  const selectedVideo = useSelector((state) => state.video.video);

  const dispatch = useDispatch();

  const { data: allMovies } = useGetAllMoviesQuery();
  const { data: allEpisodes } = useGetAllEpisodesQuery();

  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    switch (viewType) {
      case 1:
        allMovies && setAllVideos(allMovies ?? []);
        break;
      case 2:
        allEpisodes && setAllVideos(allEpisodes ?? []);
        break;
    }
  }, [viewType, allMovies, allEpisodes]);

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

  return (
    <div className={styles.container}>
      {filteredVideos.map((video, index) => (
        <VideoCard video={video} key={video.id} index={index} />
      ))}
    </div>
  );
};

export default VideoWall;
