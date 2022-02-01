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
app.use(express.json()); //whenever i read from the body(post) we parse it to json format

const movieData = require("./movie data/data.json");
// const { json } = require("express");

app.get("/", moviesHandler);
app.get("/favorite", favoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);
app.post("/addMovie", addMovieHandler);
// app.get("/getMovies", getMoviesHandler);
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
            res.status(200).json(trending);
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
            res.status(200).json(trending)
        }).catch(error => {
            errorHandler(error, req,res);
        })
}

// function addMovieHandler(req, res) {
//     const movie = req.body
//     let sql = `INSERT INTO addmovie (title, release_date, poster_path, overview) VALUES ($1,$2,$3,$4) RETURNING *;`
//     let values = [movie.title, movie.release_date, movie.poster_path, movie.overview];
//     console.log(values);
//     client.query(sql, values).then(data => { 
//         res.status(200).json(data); 
//     }).catch(error => {
//         errorHandler(error,req,res)
//     });
// }
async function addMovieHandler(req,res){    
 const {title ,release_date, poster_path ,overview}=req.body;   
   let sql = 'INSERT INTO addmovie (title, release_date, poster_path, overview) VALUES ($1, $2, $3, $4)';  
    let safeValues = [title, release_date, poster_path, overview ];   
        let result = await client.query(sql, safeValues);  
    res.send(result); }


// function getMoviesHandler(req,res){
//     let sql = `SELECT * FROM addMovie;`;
//     client.query(sql).then(data=>{
//             res.status(200).json(data.rows);  
//             }).catch(error=>{
//                 errorHandler(error,req,res)
//             });
// }

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


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
})