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
  let genres = await Movies.findAll({}).catch((err) => {
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
  let movies = await Movies.findAll().catch((err) => {
    res.send(err);
  });
  res.send(movies);
};

/**
 * @req title
 * @res movies by title
 */
const getMoviesByTitle = async (req, res) => {
  let movies = await Movies.findAll({
    where: {
      title: sequelize.where(
        sequelize.col("title"),
        "LIKE",
        "%" + req.params.title + "%"
      ),
    },
    order: [[sequelize.literal("series, year"), "ASC"]],
  }).catch((err) => {
    res.send(err);
  });
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
 * @req id
 * @res one movie by id
 */
const getOneMovieById = async (req, res) => {
  let movie = await Movies.findAll({
    where: {
      id: sequelize.where(sequelize.col("id"), req.params.id),
    },
  }).catch((err) => {
    res.send(err);
  });
  res.send(movie);
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
    poster: req.body.poster ? "poster_" + id + ".jpg" : null,
    trailer: req.body.trailer ? "trailer_" + id + ".mp4" : null,
    german: req.body.german ? "german_" + id + ".mp4" : null,
    english: req.body.english ? "english_" + id + ".mp4" : null,
  })
    .catch((err) => {
      res.send(err);
    })
    .then(() => {
      res.send("movie with title " + req.body.title + " has been inserted.");
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
      ...(req.body.poster ? { poster: "poster_" + req.body.id + ".jpg" } : {}),
      ...(req.body.trailer
        ? { trailer: "trailer_" + req.body.id + ".mp4" }
        : {}),
      ...(req.body.german ? { german: "german_" + req.body.id + ".mp4" } : {}),
      ...(req.body.english
        ? { english: "english_" + req.body.id + ".mp4" }
        : {}),
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
      res.send({
        message:
          "movie with title" +
          req.body.title +
          "has been updated successfully.",
      });
    });
};

/**
 * @req id
 * @res delete movie by id
 */
const deleteMovie = async (req, res) => {
  await Movies.destroy({ where: { id: req.params.id } }).catch((err) => {
    res.send(err);
  });
  res.send("movie with id " + req.params.id + " has been removed.");
};

/**
 * @req movie
 * @res copy files to directory
 */
const copyMovieFiles = async (req, res) => {
  const latest = await Movies.findOne({
    order: [["id", "DESC"]],
  });
  const id = req.body.id ? req.body.id : latest ? latest.id + 1 : 1;
  if (req.body.poster) {
    //download poster from OMDB api
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(location + "/poster_" + id + ".jpg");
      https.get(req.body.poster, function (response) {
        response.pipe(file);
        file.on("finish", function () {
          file.close();
        });
      });
    } else {
      //copy and rename poster to directory dir
      fs.copyFile(
        req.body.poster,
        location + "/poster_" + id + ".jpg",
        (err) => {
          if (err) throw err;
          console.log("poster has been copied to location " + location + "!");
        }
      );
    }
  }
  if (req.body.trailer) {
    //copy and rename trailer to directory dir
    fs.copyFile(
      req.body.trailer,
      location + "/trailer_" + id + ".mp4",
      (err) => {
        if (err) throw err;
        console.log("trailer has been copied to location!");
      }
    );
  }
  if (req.body.german) {
    //copy and rename german video to directory dir
    fs.copyFile(req.body.german, location + "/german_" + id + ".mp4", (err) => {
      if (err) throw err;
      console.log("german has been copied to location!");
    });
  }
  if (req.body.english) {
    //copy and rename german video to directory dir
    fs.copyFile(
      req.body.english,
      location + "/english_" + id + ".mp4",
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
  getAllMovies,
  getMoviesByTitle,
  getMoviesByGenre,
  getOneMovieById,
  //
  createNewMovie,
  updateMovie,
  deleteMovie,
  //
  copyMovieFiles,
};
