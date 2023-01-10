const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");

router.get("/genres", episodeController.getAllGenres);
//
router.get("/", episodeController.getAllSeasons);
router.get("/seasons/:series", episodeController.getSeasonsBySeries);
router.get("/all", episodeController.getAllEpisodes);
//
router.get("/BySeason/:series/:season", episodeController.getEpisodesBySeason);
router.get("/byGenre/:genre", episodeController.getSeasonsByGenre);
//
router.post("/", episodeController.createNewEpisode);
router.put("/", episodeController.updateEpisode);
router.delete("/:id", episodeController.deleteEpisode);
//
router.post("/files", episodeController.copyEpisodeFiles);

module.exports = router;
