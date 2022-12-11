import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchBar.module.css";
import { selectTitle } from "../../features/video";
import { selectGenre } from "../../features/video";

const SearchBar = () => {
  const dispatch = useDispatch();
  const genre = useSelector((state) => state.video.genre);
  const viewType = useSelector((state) => state.view.viewType);

  useEffect(() => {
    document.getElementById("myInput").value = "";
  }, [genre, viewType]);

  const getValue = () => {
    let input = document.getElementById("myInput");
    input.value == "" ? dispatch(selectGenre("0")) : null;
    let filter = input.value.toUpperCase();
    dispatch(selectTitle(filter));
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        id="myInput"
        type="text"
        placeholder="search"
        onKeyUp={getValue}
        onClick={() => dispatch(selectGenre("All"))}
      ></input>
    </div>
  );
};

export default SearchBar;
