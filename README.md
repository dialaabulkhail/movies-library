# movies-library - version : 00

**Author Name** : Diala Abul-Khail

##WRRC


##Overview

##Getting started
**task12
1- we downloaded dotenv and then typed the next line
require("dotenv").config();
2- download axios and require it
3- add a new file (.env), const the port in your server.js then added to the env
const PORT = process.env.PORT;
4- create a new error handle (app.use(errorHandle)
5- create a new get of trending and search
6- get the API keys and copy the url in a constant and put them in .env file to hide them
7- create a constructor for the trending function with the required info
8- make the trending function and we need to use .then because its considered Promise and will take time, 
call the axois.get(url) and use .then/// here you map the data from the api and .catch/// in catch you call the new error function
9- make the search function using &useSearch in api link after defining it in a constant
and we do the same as trending function
10- we make the 500 error function (with an extra parameter error) and send err object
11- we add listen function 

##Project features