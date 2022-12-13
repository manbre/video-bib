const sequelize = require("../config/databaseConfig");
const Episodes = require("../models/episodeModel");
//
const https = require("https");
const fs = require("fs");
const location = fs.readFileSync("location.txt", "utf-8");

/**
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Episodes.findAll({}).catch((err) => {
    res.send(err);
  });
  let a = [];
  //get data out of json
  for (let i = 0; i < genres.length; i++) {
    let str = genres[i].genre;
    a.push(str);
  }
  //eliminates ","
  let b = a.toString().split(", ");
  let c = b.toString().split(",");
  //eliminates duplicates and spaces
  let d = [];
  for (let i = 0; i < c.length; i++) {
    let str = c[i];
    if (!d.includes(c[i]) && c[i] != "") {
      d.push(str);
    }
  }
  d.sort();
  res.send(d);
};

/**
 * @req series
 * @res all seasons
 */
const getAllSeasons = async (req, res) => {
  let seasons = await Episodes.findAll({
    group: ["season"],
    order: [[sequelize.literal("series", "season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(seasons);
};

/**
 * @req series
 * @res all seasons (sample episode) by series
 */
const getSeasonsBySeries = async (req, res) => {
  let seasons = await Episodes.findAll({
    group: ["season"],
    where: {
      series: sequelize.where(
        sequelize.col("series"),
        "LIKE",
        "%" + req.params.series + "%"
      ),
    },
    order: [[sequelize.literal("season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(seasons);
};

/**
 * @req series, season
 * @res all episodes by season
 */
const getEpisodesBySeason = async (req, res) => {
  let episodes = await Episodes.findAll({
    where: {
      series: sequelize.where(sequelize.col("series"), req.params.series),
      season: sequelize.where(sequelize.col("season"), req.params.season),
    },
    order: [[sequelize.literal("episode"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(episodes);
};

/**
 * @req genre
 * @res seasons (sample episode) by genre
 */
const getSeasonsByGenre = async (req, res) => {
  let seasons = [];
  if (req.params.genre == "All" || req.params.genre == "0") {
    seasons = await Episodes.findAll({
      group: ["season"],
      order: [[sequelize.literal("series", "season"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else {
    seasons = await Episodes.findAll({
      where: {
        genre: sequelize.where(
          sequelize.col("genre"),
          "LIKE",
          "%" + req.params.genre + "%"
        ),
      },
      group: ["season"],
      order: [[sequelize.literal("series, season"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  }
  res.send(seasons);
};

/**
 * @req id
 * @res one episode by id
 */
const getOneEpisodeById = async (req, res) => {
  let episode = await Episodes.findAll({
    where: {
      id: sequelize.where(sequelize.col("id"), req.params.id),
    },
  }).catch((err) => {
    res.send(err);
  });
  res.send(episode);
};

/**
 * @req episode
 */
const createNewEpisode = async (req, res) => {
  let number = req.body.season < 10 ? 0 : null;
  let series = req.body.series;
  let season = req.body.season;
  let episode = req.body.episode;
  await Episodes.create({
    series: series,
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    actors: req.body.actors,
    //
    year: req.body.year,
    season: season,
    episode: episode,
    runtime: req.body.runtime,
    intro: req.body.intro,
    //
    plot: req.body.plot,
    //
    poster: req.body.poster ? series + "_S" + season + "_poster.jpg" : null,
    german: req.body.german
      ? series + "_" + season + number + episode + "_german.mp4"
      : null,
    english: req.body.english
      ? series + "_" + season + number + episode + "_english.mp4"
      : null,
  })
    .catch((err) => {
      res.send(err);
    })
    .then(() => {
      res.send(
        "episode with title " +
          req.body.title +
          "of series " +
          series +
          " has been inserted."
      );
    });
};

/**
 * @req episode
 */
const updateEpisode = async (req, res) => {
  let number = req.body.season < 10 ? 0 : null;
  let series = req.body.series;
  let season = req.body.season;
  let episode = req.body.episode;
  //
  let title = req.body.title;
  await Episodes.update(
    {
      series: series,
      title: title,
      director: req.body.director,
      genre: req.body.genre,
      actors: req.body.actors,
      //
      year: req.body.year,
      season: season,
      episode: episode,
      runtime: req.body.runtime,
      intro: req.body.intro,
      //
      plot: req.body.plot,
      //
      poster: req.body.poster ? series + "_S" + season + "_poster.jpg" : null,
      german: req.body.german
        ? series + "_" + season + number + episode + "_german.mp4"
        : null,
      english: req.body.english
        ? series + "_" + season + number + episode + "_english.mp4"
        : null,
    },
    {
      where: { id: req.body.id },
    }
  )
    .then(() => {
      res.send({
        message:
          "episode with title" +
          req.body.title +
          "of series " +
          series +
          " has been updated successfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error while updating episode with title " + req.body.title,
      });
      console.log(err);
    });
};

/**
 * @req id
 */
const deleteEpisode = async (req, res) => {
  await Episodes.destroy({ where: { id: req.params.id } }).catch((err) => {
    res.send(err);
  });
  res.send("episode with id " + req.params.id + " has been removed.");
};

/**
 * @req episode
 * @res copy files to directory
 */
const copyEpisodeFiles = async (req, res) => {
  let number = req.body.season < 10 ? 0 : null;
  //
  let series = req.body.series;
  let season = req.body.season;
  let episode = req.body.episode;
  //
  let poster = req.body.poster;
  let german = req.body.german;
  let english = req.body.english;
  //
  if (poster) {
    //download and rename poster from OMDB api
    if (poster.includes("http")) {
      var file = fs.createWriteStream(
        location + "\\" + series + season + number + episode + "_poster.jpg"
      );
      https.get(poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
      });
    } else {
      //copy and rename poster to directory dir
      fs.copyFile(
        poster,
        location + "\\" + series + season + number + episode + "_poster.jpg",
        (err) => {
          if (err) throw err;
          console.log("poster has been copied to directory!");
        }
      );
    }
  }
  if (german) {
    //copy and rename german video to directory dir
    fs.copyFile(
      german,
      location + "\\" + series + season + number + episode + "_german.mp4",
      (err) => {
        if (err) throw err;
        console.log("german has been copied to directory!");
      }
    );
  }
  if (english) {
    //copy and rename german video to directory dir
    fs.copyFile(
      english,
      location + "\\" + series + season + number + episode + "_english.mp4",
      (err) => {
        if (err) throw err;
        console.log("english has been copied to directory!");
      }
    );
  }
};

module.exports = {
  getAllGenres,
  //
  getAllSeasons,
  getSeasonsBySeries,
  getEpisodesBySeason,
  getSeasonsByGenre,
  getOneEpisodeById,
  //
  createNewEpisode,
  updateEpisode,
  deleteEpisode,
  //
  copyEpisodeFiles,
};
