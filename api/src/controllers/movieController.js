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
    poster: req.body.poster ? req.body.title + "_poster.jpg" : null,
    trailer: req.body.trailer ? req.body.title + "_trailer.mp4" : null,
    german: req.body.german ? req.body.title + "_german.mp4" : null,
    english: req.body.english ? req.body.title + "_english.mp4" : null,
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
      poster: req.body.poster ? req.body.title + "_poster.jpg" : null,
      trailer: req.body.trailer ? req.body.title + "_trailer.mp4" : null,
      german: req.body.german ? req.body.title + "_german.mp4" : null,
      english: req.body.english ? req.body.title + "_english.mp4" : null,
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
  if (req.body.poster) {
    //download poster from OMDB api
    if (req.body.poster.includes("http")) {
      let file = fs.createWriteStream(
        location + "\\" + req.body.title + "_poster.jpg"
      );
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
        location + "\\" + req.body.title + "_poster.jpg",
        (err) => {
          if (err) throw err;
          console.log("poster has been copied to directory!");
        }
      );
    }
  }
  if (req.body.trailer) {
    //copy and rename trailer to directory dir
    fs.copyFile(
      req.body.trailer,
      location + "\\" + req.body.title + "_trailer.mp4",
      (err) => {
        if (err) throw err;
        console.log("trailer has been copied to directory!");
      }
    );
  }
  if (req.body.german) {
    //copy and rename german video to directory dir
    fs.copyFile(
      req.body.german,
      location + "\\" + req.body.title + "_german.mp4",
      (err) => {
        if (err) throw err;
        console.log("german has been copied to directory!");
      }
    );
  }
  if (req.body.english) {
    //copy and rename german video to directory dir
    fs.copyFile(
      req.body.english,
      location + "\\" + req.body.title + "_english.mp4",
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
