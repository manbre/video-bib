import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { selectVideo } from "../../features/video";
import { isLoad } from "../../features/view";
import { toggleType } from "../../features/view";
import {
  useGetOMDBDataQuery,
  useCreateNewEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
  //
  useCopyEpisodeFilesMutation,
} from "../../features/api";

const FormEpisode = (props) => {
  const [series, setSeries] = useState("");
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [actors, setActors] = useState("");
  //
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [runtime, setRuntime] = useState("");
  const [intro, setIntro] = useState("");
  //
  const [plot, setPlot] = useState("");
  //
  const [poster, setPoster] = useState("");
  const [theme, setTheme] = useState("");
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");
  //
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const selectedSource = useSelector((state) => state.source.source);
  const viewType = useSelector((state) => state.view.viewType); //type selected by toggle
  const isEditor = useSelector((state) => state.view.isEditor);

  const [useCreateVideo] = useCreateNewEpisodeMutation();
  const [useUpdateVideo] = useUpdateEpisodeMutation();
  const [useDeleteVideo] = useDeleteEpisodeMutation();
  const [useCopyFiles, { isSuccess: isCopied }] = useCopyEpisodeFilesMutation();

  const { data: OMDBData, isSuccess: isOMDB } = useGetOMDBDataQuery(
    {
      title: series,
      year: year,
    },
    { skip: isEditor == false }
  );

  useEffect(() => {
    isCopied &&
      dispatch(isLoad(false)) &&
      /*    window.location.reload().then(dispatch(toggleType(2))); */
      dispatch(toggleType(2));
  }, [isCopied]);

  useEffect(() => {
    !selectedVideo && isOMDB && setPoster(OMDBData.Poster);
  }, [OMDBData]);

  useEffect(() => {
    emptyInput();
    if (selectedVideo && viewType == 2) {
      setSeries(selectedVideo.series),
        setTitle(selectedVideo.title),
        setDirector(selectedVideo.director),
        setGenre(selectedVideo.genre),
        setActors(selectedVideo.actors),
        setPlot(selectedVideo.plot),
        //
        setYear(selectedVideo.year),
        setSeason(selectedVideo.season),
        setEpisode(selectedVideo.episode),
        setRuntime(selectedVideo.runtime),
        setIntro(selectedVideo.intro),
        //
        setPoster(selectedVideo.poster),
        /*   setTheme(selectedVideo.theme), */
        setGerman(selectedVideo.german),
        setEnglish(selectedVideo.english);
    }
  }, [selectedVideo]);

  const takeOMDBData = () => {
    let data = OMDBData;
    setSeries(data.Title.replace(":", " - "));
    setDirector(data.Director);
    setGenre(data.Genre);
    setActors(data.Actors);
    setPlot(data.Plot);
    setYear(data.Year);
    setRuntime(data.Runtime.slice(0, 2));
    setPoster(data.Poster);
  };

  const createVideo = () => {
    copyFiles();
    useCreateVideo({
      series: series,
      title: title,
      director: director,
      genre: genre,
      actors: actors,
      plot: plot,
      //
      year: year,
      season: season,
      episode: episode,
      runtime: runtime,
      intro: intro,
      //
      poster: poster,
      /* theme: theme, */
      german: german,
      english: english,
    });
    emptyInput();
  };

  const updateVideo = () => {
    copyFiles();
    useUpdateVideo({
      id: selectedVideo.id,
      //
      ...(series != selectedVideo.series ? { series: series } : {}),
      ...(title != selectedVideo.title ? { title: title } : {}),
      ...(director != selectedVideo.director ? { director: director } : {}),
      ...(genre != selectedVideo.genre ? { genre: genre } : {}),
      ...(actors != selectedVideo.actors ? { actors: actors } : {}),
      ...(plot != selectedVideo.plot ? { plot: plot } : {}),
      //
      ...(year != selectedVideo.year ? { year: year } : {}),
      ...(season != selectedVideo.season ? { season: season } : {}),
      ...(episode != selectedVideo.episode ? { episode: episode } : {}),
      ...(runtime != selectedVideo.runtime ? { runtime: runtime } : {}),
      ...(intro != selectedVideo.intro ? { intro: intro } : {}),
      //
      ...(poster != selectedVideo.poster ? { poster: poster } : {}),
      /* ...(theme != selectedVideo.theme ? { theme: theme } : {}), */
      ...(german != selectedVideo.german ? { german: german } : {}),
      ...(english != selectedVideo.english ? { english: english } : {}),
    });
    emptyInput();
    dispatch(selectVideo(null));
  };

  const deleteVideo = () => {
    useDeleteVideo(selectedVideo.id);
    dispatch(selectVideo(null));
  };

  const copyFiles = () => {
    if (selectedVideo) {
      if (
        poster != selectedVideo.poster ||
        /*    theme != selectedVideo.theme || */
        german != selectedVideo.german ||
        english != selectedVideo.english
      ) {
        dispatch(isLoad(true));
      }
      useCopyFiles({
        id: selectedVideo.id,
        poster: poster != selectedVideo.poster ? poster : null,
        /*         theme: theme!= selectedVideo.theme ? theme : null, */
        german: german != selectedVideo.german ? german : null,
        english: english != selectedVideo.english ? english : null,
      });
    } else {
      if (poster != null || german != null || english != null) {
        dispatch(isLoad(true));
      }
      useCopyFiles({
        id: null,
        poster: poster,
        /*   theme: theme, */
        german: german,
        english: english,
      });
    }
  };

  const emptyInput = () => {
    setSeries(""),
      setTitle(""),
      setDirector(""),
      setGenre(""),
      setActors(""),
      setPlot(""),
      //
      setYear(""),
      setSeason(""),
      setEpisode(""),
      setRuntime(""),
      setIntro(""),
      //
      setPoster(""),
      /*       setTheme(""), */
      setGerman(""),
      setEnglish("");
    //
    let fields = document
      .getElementById("episode_form")
      .getElementsByTagName("input");
    for (let i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
  };

  const handleFileChange = (e) => {
    switch (e.target.id) {
      case "poster":
        setPoster(e.target.files[0].path);
        break;
      /*      case "theme":
            setTheme(e.target.files[0].path);
            break; */
      case "german":
        setGerman(e.target.files[0].path);
        break;
      case "english":
        setEnglish(e.target.files[0].path);
        break;
    }
  };

  props.childRef.current = {
    takeOMDBData: takeOMDBData,
    uploadVideo: createVideo,
    updateVideo: updateVideo,
    deleteVideo: deleteVideo,
  };

  return (
    <div className={styles.container}>
      <div id="episode_form" className={styles.form}>
        <div className={styles.colText}>
          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>
                TV Show <span className={styles.tag}>(OMDb)</span>
              </label>
              <input
                className={styles.inputField}
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>
                Year <span className={styles.tag}>(OMDb)</span>
              </label>
              <input
                className={styles.inputField}
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              ></input>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Title</label>
              <input
                className={styles.inputField}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>Season</label>
              <input
                className={styles.inputField}
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              ></input>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Director</label>
              <input
                className={styles.inputField}
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>Episode</label>
              <input
                className={styles.inputField}
                type="text"
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
              ></input>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Genre</label>
              <input
                className={styles.inputField}
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>Runtime</label>
              <input
                className={styles.inputField}
                type="text"
                value={runtime}
                onChange={(e) => setRuntime(e.target.value)}
              ></input>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Actors</label>
              <input
                className={styles.inputField}
                type="text"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>Intro</label>
              <input
                className={styles.inputField}
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
              ></input>
            </div>
          </div>
        </div>

        <div className={styles.colArea}>
          <div className={styles.inputText}>
            <label>Plot</label>
            <textarea
              className={styles.inputArea}
              type="text"
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className={styles.colPoster}>
          <label className={styles.poster}>
            <img
              src={
                selectedVideo
                  ? selectedVideo.poster == poster
                    ? `file:///${selectedSource}//${poster}`
                    : poster
                  : poster
              }
              onError={(event) =>
                (event.target.src = require("../../assets/images/placeholder.jpg").default)
              }
              onLoad={(event) => (event.target.style.display = "inline-block")}
            />
          </label>
        </div>

        <div className={styles.colFiles}>
          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Poster</label>
              <input
                id="poster"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                className={styles.fileInput}
                type="text"
                value={
                  selectedVideo && poster
                    ? poster.replace(/^.*[\\\/]/, "")
                    : poster
                }
                onChange={(e) => setPoster(e.target.value)}
              ></input>
            </div>
            {poster !== "" && poster !== null ? (
              <label
                className={styles.sourceDeleteBtn}
                onClick={() => setPoster("")}
              ></label>
            ) : (
              <>
                <label className={styles.sourceBtn} htmlFor="poster"></label>
                {selectedVideo && selectedVideo.poster && (
                  <label
                    className={styles.undoneBtn}
                    onClick={() => setPoster(selectedVideo.poster)}
                  ></label>
                )}
              </>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Theme</label>
              <input
                id="theme"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                className={styles.fileInput}
                type="text"
                value={
                  selectedVideo && theme
                    ? theme.replace(/^.*[\\\/]/, "")
                    : theme
                }
                onChange={(e) => setTheme(e.target.value)}
              ></input>
            </div>
            {theme !== "" && theme !== null ? (
              <label
                className={styles.sourceDeleteBtn}
                onClick={() => setTheme("")}
              ></label>
            ) : (
              <>
                <label className={styles.sourceBtn} htmlFor="theme"></label>
                {selectedVideo && selectedVideo.theme && (
                  <label
                    className={styles.undoneBtn}
                    onClick={() => setTheme(selectedVideo.theme)}
                  ></label>
                )}
              </>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Video (german)</label>
              <input
                id="german"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                className={styles.fileInput}
                type="text"
                value={
                  selectedVideo && german
                    ? german.replace(/^.*[\\\/]/, "")
                    : german
                }
                onChange={(e) => setGerman(e.target.value)}
              ></input>
            </div>
            {german !== "" && german !== null ? (
              <label
                className={styles.sourceDeleteBtn}
                onClick={() => setGerman("")}
              ></label>
            ) : (
              <>
                <label className={styles.sourceBtn} htmlFor="german"></label>
                {selectedVideo && selectedVideo.german && (
                  <label
                    className={styles.undoneBtn}
                    onClick={() => setGerman(selectedVideo.german)}
                  ></label>
                )}
              </>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>Video (english)</label>
              <input
                id="english"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                className={styles.fileInput}
                type="text"
                value={
                  selectedVideo && english
                    ? english.replace(/^.*[\\\/]/, "")
                    : english
                }
                onChange={(e) => setEnglish(e.target.value)}
              ></input>
            </div>
            {english !== "" && english !== null ? (
              <label
                className={styles.sourceDeleteBtn}
                onClick={() => setEnglish("")}
              ></label>
            ) : (
              <>
                <label className={styles.sourceBtn} htmlFor="english"></label>
                {selectedVideo && selectedVideo.english && (
                  <label
                    className={styles.undoneBtn}
                    onClick={() => setEnglish(selectedVideo.english)}
                  ></label>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FormEpisode;
