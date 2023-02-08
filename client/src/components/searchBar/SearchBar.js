import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchBar.module.css";
import { selectTitle } from "../../features/video";
import { selectSearch } from "../../features/video";
import { selectGenre } from "../../features/video";

const SearchBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);
  const [input, setInput] = useState("");

  useEffect(() => {
    document.getElementById("myInput").value = "";
/*     viewType == 1 && (document.getElementById("mySelect").value = "title"); */
  }, [genre, viewType]);

  useEffect(() => {
    input == ""
      ? genre == "All"
        ? dispatch(selectGenre("0"))
        : dispatch(selectGenre("All"))
      : dispatch(selectTitle(input));
  }, [input]);

  return (
    <div className={styles.container}>
{/*       {viewType == 1 && (
        <div className={styles.searchSelection}>
          <select
            id="mySelect"
            onChange={(e) => dispatch(selectSearch(e.target.value))}
          >
            <option value="title">Title</option>
            <option value="director">Director</option>
            <option value="actor">Actor</option>
          </select>
        </div>
      )} */}
      <input
        className={styles.searchInput}
        id="myInput"
        type="text"
        placeholder="search"
        onKeyUp={(e) => setInput(e.target.value)}
        onClick={() => dispatch(selectGenre("All"))}
      ></input>
    </div>
  );
};

export default SearchBar;
