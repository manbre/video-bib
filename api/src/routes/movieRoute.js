const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/genres", movieController.getAllGenres);
//
router.get("/", movieController.getAllMovies);
router.get("/byTitle/:title", movieController.getMoviesByTitle);
router.get("/byGenre/:genre", movieController.getMoviesByGenre);
//
router.post("/", movieController.createNewMovie);
router.put("/", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);
//
router.post("/files", movieController.copyMovieFiles);

module.exports = router;
