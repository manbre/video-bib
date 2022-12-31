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
    group: ["series", "season"],
    order: [[sequelize.literal("series", "season"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(seasons);
};

/**
 * @req series
 * @res seasons (sample episode) by series
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
      group: ["series", "season"],
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
      group: ["series", "season"],
      order: [[sequelize.literal("series, season"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  }
  res.send(seasons);
};

/**
 * @req episode
 */
const createNewEpisode = async (req, res) => {
  const latest = await Episodes.findOne({
    order: [["id", "DESC"]],
  });
  const id = latest ? latest.id + 1 : 1;
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
    poster: req.body.poster ? "e" + id + "_poster.jpg" : null,
    german: req.body.german ? "e" + id + "_german.mp4" : null,
    english: req.body.english ? "e" + id + "_english.mp4" : null,
  })
    .catch((err) => {
      res.status(500).send({
        message: "error while inserting episode with title " + req.body.title,
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message:
          "episode inserted with title " +
          req.body.title +
          "of series " +
          series,
      });
    });
};

/**
 * @req episode
 */
const updateEpisode = async (req, res) => {
  await Episodes.update(
    {
      ...(req.body.series ? { series: req.body.series } : {}),
      ...(req.body.title ? { title: req.body.title } : {}),
      ...(req.body.director ? { director: req.body.director } : {}),
      ...(req.body.genre ? { genre: req.body.genre } : {}),
      ...(req.body.actors ? { director: req.body.actors } : {}),
      ...(req.body.plot ? { plot: req.body.plot } : {}),
      //
      ...(req.body.year ? { year: req.body.year } : {}),
      ...(req.body.season ? { season: req.body.season } : {}),
      ...(req.body.episode ? { episode: req.body.episode } : {}),
      ...(req.body.runtime ? { runtime: req.body.runtime } : {}),
      ...(req.body.intro ? { intro: req.body.intro } : {}),
      //
      ...(req.body.poster ? { poster: "e" + req.body.id + "_poster.jpg" } : {}),
      ...(req.body.german ? { german: "e" + req.body.id + "_german.mp4" } : {}),
      ...(req.body.english
        ? { english: "e" + req.body.id + "_english.mp4" }
        : {}),
      //
      ...(req.body.elapsed_time ? { elapsed_time: req.body.elapsed_time } : {}),
      ...(req.body.last_viewed ? { last_viewed: req.body.last_viewed } : {}),
    },
    {
      where: { id: req.body.id },
    }
  )
    .catch((err) => {
      res.status(500).send({
        message: "error while updating episode with title " + req.body.title,
      });
      console.log(err);
    })
    .then(() => {
      res.status(200).send({
        message:
          "episode with title" +
          req.body.title +
          "of series " +
          req.body.series +
          " has been updated successfully.",
      });
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
  const latest = await Episodes.findOne({
    order: [["id", "DESC"]],
  });
  var id = req.body.id ? req.body.id : latest ? latest.id + 1 : 1;
  var isPosterReady = req.body.poster ? false : true;
  var isGermanReady = req.body.german ? false : true;
  var isEnglishReady = req.body.english ? false : true;
  //
  if (req.body.poster) {
    //download and rename poster from OMDB api
    if (req.body.poster.includes("http")) {
      var file = fs.createWriteStream(location + "/e" + id + "_poster.jpg");
      https.get(req.body.poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
        isPosterReady = true;
        console.log("poster ready");
        if (isPosterReady && isGermanReady && isEnglishReady) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      });
    } else {
      //copy and rename poster to directory dir
      fs.copyFile(
        req.body.poster,
        location + "/e" + id + "_poster.jpg",
        (err) => {
          if (err) throw err;
          isPosterReady = true;
          console.log("poster ready");
          if (isPosterReady && isGermanReady && isEnglishReady) {
            res.status(200).send({
              message: "copy files finished",
            });
          }
        }
      );
    }
  }
  if (req.body.german) {
    //copy and rename german video to directory dir
    fs.copyFile(
      req.body.german,
      location + "/e" + id + "_german.mp4",
      (err) => {
        if (err) throw err;
        isGermanReady = true;
        console.log("german ready");
        if (isPosterReady && isGermanReady && isEnglishReady) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
  if (req.body.english) {
    //copy and rename german video to directory dir
    fs.copyFile(
      req.body.english,
      location + "/e" + id + "_english.mp4",
      (err) => {
        if (err) throw err;
        isEnglishReady = true;
        console.log("english ready");
        if (isPosterReady && isGermanReady && isEnglishReady) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
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
  //
  createNewEpisode,
  updateEpisode,
  deleteEpisode,
  //
  copyEpisodeFiles,
};
