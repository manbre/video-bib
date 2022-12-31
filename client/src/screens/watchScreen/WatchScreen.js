import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import VideoControl from "../../components/videoControl/VideoControl";
import Player from "react-player";
import { useParams } from "react-router-dom";

import styles from "./WatchScreen.module.css";

const WatchScreen = () => {
  const { isContinue } = useParams();
  const video = React.createRef();
  const selectedSource = useSelector((state) => state.source.source);
  const selectedVideo = useSelector((state) => state.video.video);
  const selectedAudio = useSelector((state) => state.video.audio);

  const [playing, setPlaying] = useState(true);
  const [seek, setSeek] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const [timeTotal, setTimeTotal] = useState("00:00:00");
  const [volumeBar, setVolumeBar] = useState(70);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);


  useEffect(() => {
    /*      ? handleForward(getConvertedIntro(selectedVideo.intro)) */

    if (isContinue == 1 && selectedVideo) {
      handleForward(selectedVideo.elapsed_time);
    }
  }, []);

  useEffect(() => {
    /*      ? handleForward(getConvertedIntro(selectedVideo.intro)) */

    if (isContinue == 1 && selectedVideo) {
      handleForward(selectedVideo.elapsed_time);
    }
  }, []);

  //only for episode
  const getConvertedIntro = (intro) => {
    let integer = Math.floor(intro);
    let decimal = (intro - integer) / 0.6;
    return (integer + decimal) * 60;
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value / 100), setVolumeBar(e.target.value);
  };

  const handleForward = (sec) => {
    setSeek(seek + sec);
    video.current.seekTo(seek + sec);
  };

  const handleRewind = (sec) => {
    setSeek(seek - sec);
    video.current.seekTo(seek - sec);
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
        url={`file:///${selectedSource}//${
          selectedVideo
            ? selectedAudio == 1
              ? selectedVideo.german
              : selectedAudio == 2
              ? selectedVideo.english
              : ""
            : ""
        }`}
        width="100%"
        height="100%"
        volume={volume}
        muted={isMuted}
        ref={video}
        playing={playing}
        onProgress={handleOnProgress}
      ></Player>
      <VideoControl
        title={selectedVideo ? selectedVideo.title : ""}
        seek={seek}
        time={time}
        timeTotal={timeTotal}
        playing={playing}
        volume={volumeBar}
        duration={duration}
        togglePlay={togglePlay}
        handleSeekChange={handleSeekChange}
        handleVolumeChange={handleVolumeChange}
        handleForward={() => handleForward(10)}
        handleRewind={() => handleRewind(10)}
      ></VideoControl>
    </div>
  );
};

export default WatchScreen;
