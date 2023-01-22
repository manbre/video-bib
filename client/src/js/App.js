import React from "react";
/* import { Routes, Route } from "react-router-dom"; */
import { HashRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-loading";

import MoviesScreen from "../screens/moviesScreen/MoviesScreen";
import EpisodesScreen from "../screens/episodesScreen/EpisodesScreen";
import WatchScreen from "../screens/watchScreen/WatchScreen";
import SearchBar from "../components/searchBar/SearchBar";
import ToggleBar from "../components/toggleBar/ToggleBar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoviesScreen />} />
        <Route path="/episodes" element={<EpisodesScreen />} />
        <Route path="/watch/:isContinue" element={<WatchScreen />} />
      </Routes>
      <div class="navBar">
        <SearchBar />
        <ToggleBar />
      </div>
    </Router>
  );
};

export default App;
