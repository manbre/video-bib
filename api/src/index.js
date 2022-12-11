const express = require("express");
const sequelize = require("./config/databaseConfig");
const location = require(".//locationTxt");
const omdbAPI = require("./omdbAPI");
/* const bodyParser = require("body-parser"); */

//connect database
sequelize.sync().then(() => console.log("database is ready"));

const app = express();
const PORT = 5000;

//routes
const movieRoute = require("./routes/movieRoute");
const episodeRoute = require("./routes/episodeRoute");

//express middleware
// parses incoming requests with JSON payloads
app.use(express.json());
// parses incoming requests with urlencoded payloads
// extended: true - parsing the URL-encoded data with the querystring library
app.use(express.urlencoded({ extended: false }));
/* app.use(bodyParser.json()); */

app.use("/movies", movieRoute);
app.use("/episodes", episodeRoute);
//
app.use("/location/write/:location", location.writeLocationTxt);
app.use("/location/read", location.readLocationTxt);
//
/* app.use("/omdb/:title", omdbAPI.getOMDBData); */
app.use("/omdb/:title/:year", omdbAPI.getOMDBData);

const onStart = () => {
  console.log(`api is running on port ${PORT}`);
};

app.listen(PORT, onStart);

module.exports = app;
