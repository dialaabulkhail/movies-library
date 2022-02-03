"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pg = require("pg");

const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

const movieData = require("./movie data/data.json");
const { json } = require("express");

app.get("/", moviesHandler);
app.get("/favorite", favoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);
app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMoviesHandler);
app.put("/update/:id", updateHandler);
app.delete("/delete/:id", deleteHandler)
app.get("getMovie/:id", getMoviebyIdHandler)
app.use("*", notFoundHandler);
app.use(errorHandler);

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function moviesHandler(req, res) {
    let oneMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    return res.status(200).json(oneMovie);
}

function favoriteHandler(req, res) {
    return res.status(200).send("Welcome to Favorite page");
}

function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
    axios.get(url)
        .then((data) => {
            let trending = data.data.results.map(trend => {
                return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)
            });
            res.status(200).send(trending);
        }).catch((error) => {  
            errorHandler(error,req,res);
        })
    }

function searchHandler(req, res) {
    let userSearch = req.query.userSearch;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}&page=2`;
    axios.get(url)
        .then(data => {
            let trending = data.data.results.map(trend => {
                return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)
            })
            res.status(200).send(trending)
        }).catch(error => {
            errorHandler(error, req,res);
        })
}

function addMovieHandler(req, res) {
    const movie = req.body
    let sql = `INSERT INTO addmovie (title, release_date, poster_path, overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values = [movie.title || " ", movie.release_date || " ", movie.poster_path || " ", movie.overview || " "];
    console.log(values);
    client.query(sql, values).then(data => { 
        res.status(200).json(data.rows); 
    }).catch(error => {
        errorHandler(error,req,res)
    });
}

function getMoviesHandler(req,res){
    let sql = `SELECT * FROM addMovie;`;
    client.query(sql).then(data=>{
            res.status(200).json(data.rows);  
            }).catch(error=>{
                errorHandler(error,req,res)
            });
}

function updateHandler(req,res){
const id = req.parmas.id;
const movie = req.body;
let sql = `UPDATE addmovie SET title=$1, release_date=$2, poster_path=$3, overview=$4 WHERE id=$1; RETURNNIG *;`;
let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, id];
client.query(sql, values).then(data=>{
res.status(200).json(data.rows);
}).catch(error=>{
    errorHandler(error,req,res)
});
}

function deleteHandler(req,res){
    const id = req.params.id;
    const sql = `DELETE FROM addmovie WHERE id=${id};`
    client.query(sql).then(()=>{
        res.status(204).json({});
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}

function getMoviebyIdHandler(req,res){
    let sql = `SELECT * FROM addMovie WHERE id=${req.params.id};`;
        client.query(sql).then(data=>{
                res.status(200).json(data.rows);  
                }).catch(error=>{
                    errorHandler(error,req,res)
                });
    
}

function notFoundHandler(req, res) {
    return res.status(404).send("page not found error");
}

function errorHandler(error,req,res) {
    const err = {
        status: 500,
        message: "sorry, something went wrong"
    }
    res.status(500).send(err)
}

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

// client.connect().then(() => {
//     app.listen(PORT, () => {
//         console.log(`listening to port ${PORT}`);
//     })
// })