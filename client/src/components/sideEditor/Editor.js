import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Editor.module.css";
import FormMovie from "./FormMovie";
import FormEpisode from "./FormEpisode";
import MessageBox from "../messageBox/MessageBox";
import { selectSource } from "../../features/source";
import { selectVideo } from "../../features/video";
import {
  useGetLocationQuery,
  useWriteLocationMutation,
} from "../../features/api";

const Editor = () => {
  const [source, setSource] = useState(1);
  const [editorType, setEditorType] = useState(1); // 1 - movie,  2 - tv show
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType); //type selected by toggle
  const selectedSource = useSelector((state) => state.source.source);
  const movieEditor = useRef();
  const episodeEditor = useRef();
  const dispatch = useDispatch();
  const { data: location, isSuccess: isLocation } = useGetLocationQuery();
  const [writeLocation] = useWriteLocationMutation();

  const [dialog, setDialog] = useState({
    message: "",
    isLoading: false,
  });

  const handleDelete = () => {
    handleDialog(
      `Are you sure you want to delete ${selectedVideo.title}?`,
      true
    );
  };

  const handleDialog = (message, isLoading) => {
    setDialog({
      message,
      isLoading,
    });
  };

  const areUSureDelete = (choose) => {
    if (choose) {
      editorType == 1
        ? movieEditor.current.deleteVideo()
        : episodeEditor.current.deleteVideo();
      handleDialog("", false);
    } else {
      handleDialog("", false);
    }
  };

  useEffect(() => {
    setSource(selectedSource);
  }, [selectedSource]);

  useEffect(() => {
    isLocation && dispatch(selectSource(location ?? []));
  }, [location]);

  useEffect(() => {
    const submitBtn = document.getElementById("submit");
    if (selectedVideo) {
      submitBtn.innerHTML = "edit";
      setEditorType(viewType);
    } else {
      submitBtn.innerHTML = "add";
    }
  }, [selectedVideo]);

  useEffect(() => {
    switch (editorType) {
      case 1:
        var movieBtn = document.getElementById("movieBtn");
        movieBtn.style =
          "background-color: rgb(var(--menu-color)); color: rgb(var(--primary-text));";
        var tvShowBtn = document.getElementById("tvShowBtn");
        tvShowBtn.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        break;
      case 2:
        var movieBtn = document.getElementById("movieBtn");
        movieBtn.style =
          "background-color: rgb(var(--back-color)); color: rgb(var(--secondary-text));";
        var tvShowBtn = document.getElementById("tvShowBtn");
        tvShowBtn.style =
          "background-color: rgb(var(--menu-color)); color: rgb(var(--primary-text));";
        break;
    }
    dispatch(selectVideo(null));
  }, [editorType]);

  useEffect(() => {
    setEditorType(viewType);
  }, [viewType]);

  const handleSourceChange = async () => {
    let location = await electron.selectFolder();
    let encodedBtoA = btoa(location); //encode to base64
    writeLocation(encodedBtoA);
    setSource(location);
  };

  return (
    <div className={styles.container}>
      {dialog.isLoading && (
        <MessageBox message={dialog.message} onDialog={areUSureDelete} />
      )}
      <div className={styles.folderChoice}>
        <label>Folder: </label>
        <input
          className={styles.folderInput}
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        ></input>
        <button
          className={styles.folderBtn}
          onClick={() => handleSourceChange()}
        ></button>
      </div>
      <div className={styles.tabBar}>
        <button id="movieBtn" onClick={() => setEditorType(1)}>
          Movie
        </button>
        <button id="tvShowBtn" onClick={() => setEditorType(2)}>
          TV Show
        </button>
      </div>
      {editorType == 1 ? (
        <FormMovie childRef={movieEditor} />
      ) : (
        <FormEpisode childRef={episodeEditor} />
      )}
      <div className={styles.btns}>
        <button
          className={styles.deleteBtn}
          onClick={() => handleDelete()}
        ></button>
        <button
          id="fillBtn"
          className={styles.fillBtn}
          onClick={() =>
            editorType == 1
              ? movieEditor.current.takeOMDBData()
              : episodeEditor.current.takeOMDBData()
          }
        >
          OMDb
        </button>
        <button
          id="submit"
          className={styles.submitBtn}
          onClick={() =>
            selectedVideo
              ? editorType == 1
                ? movieEditor.current.updateVideo()
                : episodeEditor.current.updateVideo()
              : editorType == 1
              ? movieEditor.current.uploadVideo()
              : episodeEditor.current.uploadVideo()
          }
        ></button>
      </div>
    </div>
  );
};

export default Editor;
