import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchBar.module.css";
import { selectTitle } from "../../features/video";
import { selectGenre } from "../../features/video";

const SearchBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.getElementById("myInput").value = "";
  }, [genre, viewType]);

  useEffect(() => {
    search == ""
      ? genre == "All"
        ? dispatch(selectGenre("0"))
        : dispatch(selectGenre("All"))
      : dispatch(selectTitle(search));
  }, [search]);

  return (
    <div className={styles.container}>
      <input
        className={styles.searchInput}
        id="myInput"
        type="text"
        placeholder="search"
        onKeyUp={(e) => setSearch(e.target.value)}
        onClick={() => dispatch(selectGenre("All"))}
      ></input>
    </div>
  );
};

export default SearchBar;
