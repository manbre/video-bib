import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "../screens/homeScreen/Home";
import WatchScreen from "../screens/watchScreen/WatchScreen";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<HomeScreen/>} />
          <Route path="/watch/:isContinue" element={<WatchScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
