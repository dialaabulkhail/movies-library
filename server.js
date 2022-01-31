"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const PORT = process.env.PORT;

const app = express();
app.use(cors());

const movieData = require("./movie data/data.json");
const { json } = require("express");

app.get("/", moviesHandler)
app.get("/favorite", favoriteHandler)
app.get("/trending", trendingHandler) 
app.get("/search", searchHandler)
app.use("*", notFoundHandler)
app.use(errorHandler)

//add to the link &number=${numberOftrends}
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
let url2 = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=LEGO&page=2`
function Movie(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Trend(id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
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

function trendingHandler(req,res){
    axios.get(url)
    .then((data)=>{
  let trending = data.data.results.map(trend =>{
      return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)
  });
  res.status(200).json(trending);
   }).catch((error)=>{
errorHandler(req,res,errorr);
   })
}

function searchHandler(req,res){
    axios.get(url2)
    .then(data =>{
let trending = data.data.results.map(trend =>{
    return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)
})
    res.status(200).json(trending)
    .catch(error=>{
        errorHandler(req,res,errorr);
    })
})
}

function notFoundHandler(req,res){
    return res.status(404).send("page not found error");
}

function errorHandler(req,res,errorr){
const err = {
    status : 500,
    message : "sorry, something went wrong"
}
res.status(500).send(err)
}

app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
})