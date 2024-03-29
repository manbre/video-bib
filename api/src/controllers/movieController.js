const sequelize = require("../config/databaseConfig");
const Movies = require("../models/movieModel");
//
const https = require("https");
const fs = require("fs");
var location = fs.readFileSync("location.txt", "utf-8");
/**
 * @res all genres
 */
const getAllGenres = async (req, res) => {
  let genres = await Movies.findAll().catch((err) => {
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
 * @res all movies
 */
const getAllMovies = async (req, res) => {
  let movies = await Movies.findAll({
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
  res.send(movies);
};

/**
 * @req search, input
 * @res movies by search
 */
const getMoviesBySearch = async (req, res) => {
  let movies;
  switch (req.params.search) {
    case "title":
      movies = await Movies.findAll({
        where: {
          title: sequelize.where(
            sequelize.col("title"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
      });
      break;
    case "director":
      movies = await Movies.findAll({
        where: {
          director: sequelize.where(
            sequelize.col("director"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
      });
      break;
    case "actor":
      movies = await Movies.findAll({
        where: {
          actors: sequelize.where(
            sequelize.col("actors"),
            "LIKE",
            "%" + req.params.input + "%"
          ),
        },
        order: [[sequelize.literal("series, year"), "ASC"]],
      }).catch((err) => {
        res.send(err);
      });
      break;
  }
  res.send(movies);
};

/**
 * @req genre
 * @res movies by genre
 */
const getMoviesByGenre = async (req, res) => {
  let movies = [];
  if (req.params.genre == "All" || req.params.genre == "0") {
    movies = await Movies.findAll({
      order: [[sequelize.literal("series, year"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else if (req.params.genre == "Recent") {
    movies = await Movies.findAll({
      limit: 3,
      order: [[sequelize.literal("last_viewed"), "DESC"]],
    }).catch((err) => {
      res.send(err);
    });
  } else {
    movies = await Movies.findAll({
      where: {
        genre: sequelize.where(
          sequelize.col("genre"),
          "LIKE",
          "%" + req.params.genre + "%"
        ),
      },
      order: [[sequelize.literal("series, year"), "ASC"]],
    }).catch((err) => {
      res.send(err);
    });
  }
  res.send(movies);
};

/**
 * @req movie
 */
const createNewMovie = async (req, res) => {
  const latest = await Movies.findOne({
    order: [["id", "DESC"]],
  });
  const id = latest ? latest.id + 1 : 1;
  //
  await Movies.create({
    title: req.body.title,
    series: req.body.series,
    director: req.body.director,
    genre: req.body.genre,
    //
    year: req.body.year,
    awards: req.body.awards,
    rating: req.body.rating,
    runtime: req.body.runtime,
    //
    actors: req.body.actors,
    plot: req.body.plot,
    //
    poster: req.body.poster ? "m" + id + "_poster.jpg" : null,
    trailer: req.body.trailer ? "m" + id + "_trailer.mp4" : null,
    german: req.body.german ? "m" + id + "_german.mp4" : null,
    english: req.body.english ? "m" + id + "_english.mp4" : null,
  })
    .catch((err) => {
      res.status(500).send({
        message: "error while inserting movie with title " + req.body.title,
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message: "movie inserted with title " + req.body.title,
      });
    });
};

/**
 * @req movie
 */
const updateMovie = async (req, res) => {
  await Movies.update(
    {
      ...(req.body.title ? { title: req.body.title } : {}),
      ...(req.body.series ? { series: req.body.series } : {}),
      ...(req.body.director ? { director: req.body.director } : {}),
      ...(req.body.genre ? { genre: req.body.genre } : {}),
      //
      ...(req.body.year ? { year: req.body.year } : {}),
      ...(req.body.awards ? { awards: req.body.awards } : {}),
      ...(req.body.rating ? { rating: req.body.rating } : {}),
      ...(req.body.runtime ? { runtime: req.body.runtime } : {}),
      //
      ...(req.body.actors ? { director: req.body.actors } : {}),
      ...(req.body.plot ? { plot: req.body.plot } : {}),
      //
      ...(req.body.poster ? { poster: "m" + req.body.id + "_poster.jpg" } : {}),
      ...(req.body.trailer
        ? { trailer: "m" + req.body.id + "_trailer.mp4" }
        : {}),
      ...(req.body.german ? { german: "m" + req.body.id + "_german.mp4" } : {}),
      ...(req.body.english
        ? { english: "m" + req.body.id + "_english.mp4" }
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
        message: "error while updating movie with title " + req.body.title,
      });
      res.send(err);
    })
    .then(() => {
      res.status(200).send({
        message:
          "movie with title" +
          req.body.title +
          "has been updated successfully.",
      });
    });
};

/**
 * @req id
 */
const deleteMovie = async (req, res) => {
  await Movies.destroy({ where: { id: req.params.id } }).catch((err) => {
    res.send(err);
  });
  res.status(200).send({
    message: "movie with id " + req.params.id + " has been removed.",
  });
};

/**
 * @req movie
 * @res copy files to directory
 */
const copyMovieFiles = async (req, res) => {
  //
  const latest = await Movies.findOne({
    order: [["id", "DESC"]],
  });
  var id = req.body.id ? req.body.id : latest ? latest.id + 1 : 1;
  var isPosterReady = req.body.poster ? false : true;
  var isTrailerReady = req.body.trailer ? false : true;
  var isGermanReady = req.body.german ? false : true;
  var isEnglishReady = req.body.english ? false : true;
  //
  if (req.body.poster) {
    //download poster from OMDB api to location
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(location + "/m" + id + "_poster.jpg");
      https.get(req.body.poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
        isPosterReady = true;
        console.log("poster ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      });
    } else {
      //copy poster to location
      fs.copyFile(
        req.body.poster,
        location + "/m" + id + "_poster.jpg",
        (err) => {
          if (err) throw err;
          isPosterReady = true;
          console.log("poster ready");
          if (
            isPosterReady &&
            isTrailerReady &&
            isGermanReady &&
            isEnglishReady
          ) {
            res.status(200).send({
              message: "copy files finished",
            });
          }
        }
      );
    }
  }
  //
  if (req.body.trailer) {
    //copy and rename trailer to location
    fs.copyFile(
      req.body.trailer,
      location + "/m" + id + "_trailer.mp4",
      (err) => {
        if (err) throw err;
        isTrailerReady = true;
        console.log("trailer ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
  //
  if (req.body.german) {
    //copy and rename german video to location
    fs.copyFile(
      req.body.german,
      location + "/m" + id + "_german.mp4",
      (err) => {
        if (err) throw err;
        isGermanReady = true;
        console.log("german ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
          res.status(200).send({
            message: "copy files finished",
          });
        }
      }
    );
  }
  //
  if (req.body.english) {
    //copy and rename english video to location
    fs.copyFile(
      req.body.english,
      location + "/m" + id + "_english.mp4",
      (err) => {
        if (err) throw err;
        isEnglishReady = true;
        console.log("english ready");
        if (
          isPosterReady &&
          isTrailerReady &&
          isGermanReady &&
          isEnglishReady
        ) {
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
  getAllMovies,
  getMoviesBySearch,
  getMoviesByGenre,
  //
  createNewMovie,
  updateMovie,
  deleteMovie,
  //
  copyMovieFiles,
};
