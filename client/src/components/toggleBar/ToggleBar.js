import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./ToggleBar.module.css";
import { toggleType } from "../../features/view";
import { selectVideo } from "../../features/video";
import { selectGenre } from "../../features/video";

const ToggleBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewType = useSelector((state) => state.view.viewType);

  useEffect(() => {
    dispatch(selectVideo(null));
    dispatch(selectGenre("All"));
  }, [viewType]);

  const changeToScreen = (type) => {
    dispatch(toggleType(type));
    switch (type) {
      case 1:
        navigate("/");
        break;
      case 2:
        navigate("/episodes");
        break;
    }
  };

  return (
    <div className={styles.container}>
      <input
        id="toggleOn"
        className={styles.toggleLeft}
        name="toggle"
        type="radio"
        defaultChecked
      />
      <label
        htmlFor="toggleOn"
        className={styles.btn}
        onClick={() => changeToScreen(1)}
      >
        Movies
      </label>
      <input
        id="toggleOff"
        className={styles.toggleRight}
        name="toggle"
        type="radio"
      />
      <label
        htmlFor="toggleOff"
        className={styles.btn}
        onClick={() => changeToScreen(2)}
      >
        TV Shows
      </label>
    </div>
  );
};

export default ToggleBar;
