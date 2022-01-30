const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const movieData = require("./movie data/data.json");
const { json } = require("express");

app.get("/", moviesHandler)
app.get("/favorite", favoriteHandler)
app.get("*", notFoundHandler)


function Movie(title,genre_ids,original_language,original_title){
    this.title = title;
    this.genre_ids = genre_ids;
    this.original_language = original_language;
    this.original_title = original_title;

}

function moviesHandler(req,res){
    return res.status(200).json(movieData);
    
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