import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { selectVideo } from "../../features/video";
import { isLoad } from "../../features/view";
import { toggleType } from "../../features/view";
import {
  useGetOMDBDataQuery,
  useCreateNewMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  //
  useCopyMovieFilesMutation,
} from "../../features/api";

const FormMovie = (props) => {
  //
  const [title, setTitle] = useState("");
  const [series, setSeries] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  //
  const [year, setYear] = useState("");
  const [awards, setAwards] = useState("");
  const [rating, setRating] = useState("");
  const [runtime, setRuntime] = useState("");
  //
  const [actors, setActors] = useState("");
  const [plot, setPlot] = useState("");
  //
  const [poster, setPoster] = useState("");
  const [trailer, setTrailer] = useState("");
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");
  //
  const dispatch = useDispatch();
  const selectedVideo = useSelector((state) => state.video.video);
  const viewType = useSelector((state) => state.view.viewType); //type selected by toggle
  const isEditor = useSelector((state) => state.view.isEditor);
  const selectedSource = useSelector((state) => state.source.source);

  const [useCreateVideo] = useCreateNewMovieMutation();
  const [useUpdateVideo] = useUpdateMovieMutation();
  const [useDeleteVideo] = useDeleteMovieMutation();
  const [useCopyFiles, { isSuccess: isCopied }] = useCopyMovieFilesMutation();

  const { data: OMDBData, isSuccess: isOMDB } = useGetOMDBDataQuery(
    {
      title: title,
      year: year,
    },
    { skip: isEditor == false }
  );

  useEffect(() => {
    isCopied &&
      dispatch(isLoad(false)) &&
      window.location.reload().then(dispatch(toggleType(1)));
  }, [isCopied]);

  useEffect(() => {
    !selectedVideo && isOMDB && setPoster(OMDBData.Poster);
  }, [OMDBData]);

  useEffect(() => {
    emptyInput();
    if (selectedVideo && viewType == 1) {
      setTitle(selectedVideo.title),
        setSeries(selectedVideo.series),
        setDirector(selectedVideo.director),
        setGenre(selectedVideo.genre),
        setActors(selectedVideo.actors),
        setPlot(selectedVideo.plot),
        //
        setYear(selectedVideo.year),
        setAwards(selectedVideo.awards),
        setRating(selectedVideo.rating),
        setRuntime(selectedVideo.runtime),
        //
        setPoster(selectedVideo.poster),
        setTrailer(selectedVideo.trailer),
        setGerman(selectedVideo.german),
        setEnglish(selectedVideo.english);
    }
  }, [selectedVideo]);

  const takeOMDBData = () => {
    let data = OMDBData;
    setTitle(data.Title.replace(":", " - "));
    setDirector(data.Director);
    setGenre(data.Genre);
    setActors(data.Actors);
    setPlot(data.Plot);
    setYear(data.Year);
    setAwards(
      data.Awards.includes("Oscar") && !data.Awards.includes("Nominated")
        ? data.Awards.substring(3, 6)
        : "0"
    );
    setRating(data.Ratings[1].Value.substring(0, 2));
    setRuntime(data.Runtime.slice(0, 3));
    setPoster(data.Poster);
  };

  const createVideo = () => {
    copyFiles();
    useCreateVideo({
      title: title,
      series: series ? series : title,
      director: director,
      genre: genre,
      actors: actors,
      plot: plot,
      //
      year: year,
      awards: awards,
      rating: rating,
      runtime: runtime,
      //
      poster: poster,
      trailer: trailer,
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
      ...(title != selectedVideo.title ? { title: title } : {}),
      ...(series != selectedVideo.series ? { series: series } : {}),
      ...(director != selectedVideo.director ? { director: director } : {}),
      ...(genre != selectedVideo.genre ? { genre: genre } : {}),
      //
      ...(year != selectedVideo.year ? { year: year } : {}),
      ...(awards != selectedVideo.awards ? { awards: awards } : {}),
      ...(rating != selectedVideo.rating ? { rating: rating } : {}),
      ...(runtime != selectedVideo.runtime ? { runtime: runtime } : {}),
      //
      ...(actors != selectedVideo.actors ? { actors: actors } : {}),
      ...(plot != selectedVideo.plot ? { plot: plot } : {}),
      //
      ...(poster != selectedVideo.poster ? { poster: poster } : {}),
      ...(trailer != selectedVideo.trailer ? { trailer: trailer } : {}),
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
        trailer != selectedVideo.trailer ||
        german != selectedVideo.german ||
        english != selectedVideo.english
      ) {
        dispatch(isLoad(true));
      }
      useCopyFiles({
        id: selectedVideo.id,
        poster: poster != selectedVideo.poster ? poster : null,
        trailer: trailer != selectedVideo.trailer ? trailer : null,
        german: german != selectedVideo.german ? german : null,
        english: english != selectedVideo.english ? english : null,
      });
    } else {
      if (
        poster != null ||
        trailer != null ||
        german != null ||
        english != null
      ) {
        dispatch(isLoad(true));
      }
      useCopyFiles({
        id: null,
        poster: poster,
        trailer: trailer,
        german: german,
        english: english,
      });
    }
  };

  const emptyInput = () => {
    setTitle(""),
      setSeries(""),
      setDirector(""),
      setGenre(""),
      setActors(""),
      setPlot(""),
      //
      setYear(""),
      setAwards(""),
      setRating(""),
      setRuntime(""),
      //
      setPoster(""),
      setTrailer(""),
      setGerman(""),
      setEnglish("");
    //
    let fields = document
      .getElementById("movie_form")
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
      case "trailer":
        setTrailer(e.target.files[0].path);
        break;
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
      <div id="movie_form" className={styles.form}>
        <div className={styles.colText}>
          <div className={styles.row}>
            <div className={styles.inputText}>
              <label>
                Title <span className={styles.tag}>(OMDb)</span>
              </label>
              <input
                className={styles.inputField}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <label>Title of series</label>
              <input
                className={styles.inputField}
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
              ></input>
            </div>
            <div className={styles.inputNumber}>
              <label>Awards</label>
              <input
                className={styles.inputField}
                type="text"
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
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
              <label>Rating</label>
              <input
                className={styles.inputField}
                type="text"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
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

          <div className={styles.inputText}>
            <label>Actors</label>
            <input
              className={styles.inputField}
              type="text"
              value={actors}
              onChange={(e) => setActors(e.target.value)}
            ></input>
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
              <label>Trailer</label>
              <input
                id="trailer"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                className={styles.fileInput}
                type="text"
                value={
                  selectedVideo && trailer
                    ? trailer.replace(/^.*[\\\/]/, "")
                    : trailer
                }
                onChange={(e) => setTrailer(e.target.value)}
              ></input>
            </div>
            {trailer !== "" && trailer !== null ? (
              <label
                className={styles.sourceDeleteBtn}
                onClick={() => setTrailer("")}
              ></label>
            ) : (
              <>
                <label className={styles.sourceBtn} htmlFor="trailer"></label>
                {selectedVideo && selectedVideo.trailer && (
                  <label
                    className={styles.undoneBtn}
                    onClick={() => setTrailer(selectedVideo.trailer)}
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
export default FormMovie;
