import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Form.module.css";
import { selectVideo } from "../../features/video";
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
  const selectedSource = useSelector((state) => state.source.source);

  const [useCreateVideo] = useCreateNewMovieMutation();
  const [useUpdateVideo] = useUpdateMovieMutation();
  const [useDeleteVideo] = useDeleteMovieMutation();
  const [useCopyFiles] = useCopyMovieFilesMutation();

  const { data: OMDBData } = useGetOMDBDataQuery({
    title: title,
    year: year,
  });

  useEffect(() => {
    !selectedVideo && OMDBData && setPoster(OMDBData.Poster);
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
        setPoster(
          selectedVideo.poster
            ? selectedSource + "\\" + selectedVideo.poster
            : null
        ),
        setTrailer(
          selectedVideo.trailer
            ? selectedSource + "\\" + selectedVideo.trailer
            : null
        ),
        setGerman(
          selectedVideo.german
            ? selectedSource + "\\" + selectedVideo.german
            : null
        ),
        setEnglish(
          selectedVideo.english
            ? selectedSource + "\\" + selectedVideo.english
            : null
        );
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
    console.log(data.Runtime.slice(0, 3));
    setPoster(data.Poster);
  };

  const createVideo = () => {
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
    copyFiles();
  };

  const updateVideo = () => {
    useUpdateVideo({
      id: selectedVideo.id,
      //
      ...(selectedVideo.title != title ? { title: title } : {}),
      ...(selectedVideo.series != series ? { series: series } : {}),
      ...(selectedVideo.director != director ? { director: director } : {}),
      ...(selectedVideo.genre != genre ? { genre: genre } : {}),
      //
      ...(selectedVideo.year != year ? { year: year } : {}),
      ...(selectedVideo.awards != awards ? { awards: awards } : {}),
      ...(selectedVideo.rating != rating ? { rating: rating } : {}),
      ...(selectedVideo.runtime != runtime ? { runtime: runtime } : {}),
      //
      ...(selectedVideo.actors != actors ? { actors: actors } : {}),
      ...(selectedVideo.plot != plot ? { plot: plot } : {}),
      //
      ...(selectedVideo.poster != poster ? { poster: poster } : {}),
      ...(selectedVideo.trailer != trailer ? { trailer: trailer } : {}),
      ...(selectedVideo.german != german ? { german: german } : {}),
      ...(selectedVideo.english != english ? { english: english } : {}),
    });
    copyFiles();
  };

  const deleteVideo = () => {
    useDeleteVideo(selectedVideo.id);
    dispatch(selectVideo(null));
  };

  const copyFiles = () => {
    useCopyFiles({
      id: selectedVideo ? selectedVideo.id : null,
      poster: poster,
      trailer: trailer,
      german: german,
      english: english,
    });
  };

  const uploadVideo = () => {
    createVideo();
    emptyInput();
  };

  const emptyInput = () => {
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
    uploadVideo: uploadVideo,
    updateVideo: updateVideo,
    deleteVideo: deleteVideo,
  };

  return (
    <div className={styles.container}>
      <div id="movie_form" className={styles.form}>
        <div className={styles.row}>
          <div className={styles.topLeft}>
            <label>
              Title <span className={styles.tag}>(OMDb)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <label>Title of series </label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
            ></input>
            <label>Director</label>
            <input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            ></input>
            <label>Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            ></input>
          </div>

          <div className={styles.topRight}>
            <label>
              Year <span className={styles.tag}>(OMDb)</span>
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            ></input>
            <label>Awards</label>
            <input
              type="number"
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
            ></input>
            <label>Rating</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            ></input>
            <label>Runtime</label>
            <input
              type="number"
              value={runtime}
              onChange={(e) => setRuntime(e.target.value)}
            ></input>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.mid}>
            <label>Actors</label>
            <input
              type="text"
              value={actors}
              onChange={(e) => setActors(e.target.value)}
            ></input>
            <label>Plot</label>
            <textarea
              className={styles.inputPlot}
              type="text"
              value={plot}
              rows="4"
              onChange={(e) => setPlot(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className={styles.row}>
          <label className={styles.poster}>
            <img
              src={
                selectedVideo && poster
                  ? `file:///${selectedSource}//${poster}`
                  : `${poster}`
              }
              onError={(event) =>
                (event.target.src = require("../../assets/images/placeholder.jpg").default)
              }
              onLoad={(event) => (event.target.style.display = "inline-block")}
            />
          </label>
          <div className={styles.bottomRight}>
            <label>Poster</label>
            <div className={styles.line}>
              <input
                id="poster"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                type="text"
                value={
                  selectedVideo && poster
                    ? poster.replace(/^.*[\\\/]/, "")
                    : poster
                }
                onChange={(e) => setPoster(e.target.value)}
              ></input>
              <label className={styles.sourceBtn} htmlFor="poster"></label>
            </div>
            <label>Trailer</label>
            <div className={styles.line}>
              <input
                id="trailer"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                type="text"
                value={
                  selectedVideo && trailer
                    ? trailer.replace(/^.*[\\\/]/, "")
                    : trailer
                }
                onChange={(e) => setTrailer(e.target.value)}
              ></input>
              <label className={styles.sourceBtn} htmlFor="trailer"></label>
            </div>
            <label>Video (german)</label>
            <div className={styles.line}>
              <input
                id="german"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                type="text"
                value={
                  selectedVideo && german
                    ? german.replace(/^.*[\\\/]/, "")
                    : german
                }
                onChange={(e) => setGerman(e.target.value)}
              ></input>
              <label className={styles.sourceBtn} htmlFor="german"></label>
            </div>
            <label>Video (english)</label>
            <div className={styles.line}>
              <input
                id="english"
                type="file"
                hidden
                onChange={(e) => handleFileChange(e)}
              ></input>
              <input
                type="text"
                value={
                  selectedVideo && english
                    ? english.replace(/^.*[\\\/]/, "")
                    : english
                }
                onChange={(e) => setEnglish(e.target.value)}
              ></input>
              <label className={styles.sourceBtn} htmlFor="english"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormMovie;
