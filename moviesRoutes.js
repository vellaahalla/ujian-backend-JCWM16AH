const express = require('express')
const router = express.Router();
const moviesService = require('./service/movies')
const { checkAdmin } = require("./helper/middlewares");


router.get("/movies/get/all", moviesService.getAllMovies);

router.get("/movies/get", moviesService.getMoviesByQuery);

// Add new movie, use token admin (role:1) requested from body
router.post("/movies/add", checkAdmin, moviesService.addNewMovies);

// Udpate status movie, use token admin (role:1) requested from body
router.patch("/movies/edit/:id", checkAdmin, moviesService.updeStatusMovies);

// Add new schedule, use token admin (role:1) requested from body
router.patch("/movies/set/:id", checkAdmin, moviesService.addScheduleMovies);

module.exports = router;