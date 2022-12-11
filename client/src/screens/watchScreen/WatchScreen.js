import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import VideoControl from "../../components/videoControl/VideoControl";
import Player from "react-player";
import { useParams } from "react-router-dom";

import styles from "./WatchScreen.module.css";

const WatchScreen = () => {
  const { videoData } = useParams();
  const { title } = useParams();
  const video = React.createRef();
  const selectedSource = useSelector((state) => state.source.source);

  const [playing, setPlaying] = useState(true);
  const [seek, setSeek] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [timeTotal, setTimeTotal] = useState("00:00:00");
  const [volumeBar, setVolumeBar] = useState(70);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  document.body.onkeypress = function (e) {
    if (e.which == 32) {
      e.preventDefault();
      if (playing) {
        setPlaying(false);
      } else {
        setPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value / 100), setVolumeBar(e.target.value);
  };

  const handleForward = () => {
    setSeek(seek + 10);
    video.current.seekTo(seek + 10);
  };

  const handleRewind = () => {
    setSeek(seek - 10);
    video.current.seekTo(seek - 10);
  };

  const handleOnProgress = (e) => {
    var sec = video.current.getDuration();
    setDuration(sec);
    setSeek(e.playedSeconds);
    setTime(toTime(e.playedSeconds));
    setTimeTotal(toTime(sec));
  };

  const handleSeekChange = (e) => {
    setSeek(e.target.value);
    video.current.seekTo(e.target.value);
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  const toTime = (sec) => {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  };

  return (
    <div className={styles.container}>
      <Player
        className={styles.video}
        url={`file:///${selectedSource}//${videoData}`}
        width="100%"
        height="100%"
        volume={volume}
        muted={isMuted}
        ref={video}
        playing={playing}
        onProgress={handleOnProgress}
      ></Player>
      <VideoControl
        title={title}
        seek={seek}
        time={time}
        timeTotal={timeTotal}
        playing={playing}
        volume={volumeBar}
        duration={duration}
        togglePlay={togglePlay}
        handleSeekChange={handleSeekChange}
        handleVolumeChange={handleVolumeChange}
        handleForward={handleForward}
        handleRewind={handleRewind}
      ></VideoControl>
    </div>
  );
};

export default WatchScreen;
