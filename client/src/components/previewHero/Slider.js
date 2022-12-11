import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoCard from "../../components/videoCard/VideoCard";
import styles from "./Slider.module.css";
import { useByGenreQuery } from "../../features/apiSlice";

const Slider = () => {
  const [videos, setVideos] = useState([]);
  const type = 1;
  const genre = "All";
  const { data } = useByGenreQuery({ type, genre });
  useEffect(() => {
    var genreVideos = data ?? [];
    setVideos(genreVideos);
  }, [data]);
  return (
    <div className={styles.container}>
      <a className={styles.prev}>&#10094;</a>
      <div className={styles.slider}>
        {videos.map((video, index) => (
          <VideoCard video={video} index={index} key={index} />
        ))}
      </div>
      <a className={styles.next}>&#10095;</a>
    </div>
  );
};

export default Slider;
