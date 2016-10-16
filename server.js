//Declare my dependencies
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require ("method-override");
// Declare the constants used throughout this file
const app = express();
//Set configuration
app.set('view engine', 'ejs');
app.set('port', 3000);
//Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.get("/", (req, res) => {
  res.redirect('homepage');
});
app.get("/homepage", (req, res) => {
  res.render("home")
})
//Create new URL page
app.get("/createURL", (req, res) => {
  console.log(req);
  res.render('createURL');
});
app.post("/submitURL", (req, res) => {
  let string = generateString()
  urlDatabase[string] = req.body.longURL
  keyObject = Object.keys(urlDatabase)
  res.redirect("http://localhost:3000/url/" + keyObject[keyObject.length - 1]);
});
//Display only the result shorURL with indication to longURL
app.get("/url/:id", (req, res) => {
  let urlObject = { shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("idURL", urlObject);
});
app.get("/url/long/:id", (req, res) => {
  let link = req.params.id;
  res.redirect(301, "http://www." + link);
})


//--------------Done---------------------------
// This page shows all the url in shortform
app.get("/myList", (req, res) => {
  let test = {database: urlDatabase,
    shortURL: Object.keys(urlDatabase)};
  res.render("myList", test);
});
//Delete Link
app.post("/url/delete/:id", (req, res) => {
  let link = req.params.id;
  delete urlDatabase[link];
  res.redirect("/myList");
})
//Edit Link
app.get("/url/edit/:id", (req, res) => {
  let urlObject = { shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("editURL", urlObject);
})
app.post("/url/edit/:id", (req, res) => {
  let urlObject = { shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
    console.log("body ----------->" + req.body.longURL)
    console.log("params --------->" + req.params.id)
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/myList");
})
//--------------lineEnd------------------------




//Database
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

var keyObject = ["b2xVn2","9sm5xK"];


function generateString()
{
    var shortURL = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        shortURL += possible.charAt(Math.floor(Math.random() * possible.length));

    return shortURL;
};


app.listen(app.get('port'), () => {
console.log(`Local${app.get('port')} at your service!`);
});