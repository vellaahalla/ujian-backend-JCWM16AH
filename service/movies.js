const { request } = require('express')
const moviesModel = require('../model/movies')

exports.getAllMovies = async (req, res) => {

    moviesModel.getAllMovies()
        .then((result) => {
            res.json({
                result
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}

exports.getMoviesByQuery = async (req, res) => {
    
    const {status, location, time} = req.query
    console.log(req.query)

    let data = {
        status: req.query.status,
        location: req.query.location,
        time: req.query.time,
        length: Object.keys(req.query).length,
    }
    

    console.log(data)

    moviesModel.getMoviesByQuery(data)
        .then((result) => {
            res.json({
                result
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}

exports.addNewMovies = async (req, res) => {

    const data = {
        name: req.body.name,
        release_date: req.body.release_date,
        release_month: req.body.release_month,
        release_year: req.body.release_year,
        duration_min: req.body.duration_min,
        genre: req.body.genre,
        description: req.body.description
    }

    moviesModel.addNewMovies(data)
        .then((result) => {
            res.json({
                id: result.id,
                ...data
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}

exports.updeStatusMovies = async (req, res) => {

    let data = {
        id: parseInt(req.params.id),
        status: parseInt(req.body.status)
    }

    const idMovies = req.params.id

    moviesModel.updeStatusMovies(data)
        .then((result) => {
            res.json({
                id: idMovies,
                message: 'Changed Status Successfully'
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}

exports.addScheduleMovies = async (req, res) => {

    let data = {
        id: parseInt(req.params.id),
        location_id: req.body.location_id,
        time_id: req.body.time_id 
    }

    const idMovies = req.params.id

    moviesModel.addScheduleMovies(data)
        .then((result) => {
            res.json({
                id: idMovies,
                message: 'Added Schedule Successfully'
            })
        })
        .catch((err) => {
            res.json({
                status: 'error',
                error_message: err
            })
        })
}


