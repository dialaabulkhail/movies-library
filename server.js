const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const movieData = require("./movie data/data.json");
const { json } = require("express");

app.get("/", moviesHandler)
app.get("/favorite", favoriteHandler)
app.get("*", notFoundHandler)

function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function moviesHandler(req,res){
    let oneMovie= new Movie(movieData.title, movieData.poster_path, movieData.overview);
    return res.status(200).json(oneMovie);
}

function favoriteHandler(req,res){
    return res.status(200).send("Welcome to Favorite page");
}

function notFoundHandler(req,res){
    return res.status(404).send("page not found error");
}

app.listen(2000, ()=> {
    console.log("everything is ok");
})