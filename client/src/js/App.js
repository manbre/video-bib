import React from "react";
/* import { Routes, Route } from "react-router-dom"; */
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-loading";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import MoviesScreen from "../screens/moviesScreen/MoviesScreen";
import EpisodesScreen from "../screens/episodesScreen/EpisodesScreen";
import WatchScreen from "../screens/watchScreen/WatchScreen";
import SearchBar from "../components/searchBar/SearchBar";
import ToggleBar from "../components/toggleBar/ToggleBar";

const App = () => {
  const isWatch = useSelector((state) => state.view.isWatch);
  useEffect(() => {
    console.log(isWatch)
    const nav = document.getElementById("nav");
    isWatch
      ? (nav.style = "visibility: hidden;")
      : (nav.style = "visibility: visible;");
  }, [isWatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesScreen />} />
        <Route path="/episodes" element={<EpisodesScreen />} />
        <Route path="/watch/:isContinue" element={<WatchScreen />} />
      </Routes>
      <div id="nav" class="navBar">
        <SearchBar />
        <ToggleBar />
      </div>
    </Router>
  );
};

export default App;
