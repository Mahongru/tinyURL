//Declare my dependencies
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require ("method-override");
const cookieParser = require("cookie-parser");
const app = express();
//Set configuration
app.set('view engine', 'ejs');
app.set('port', 3000);
app.listen(app.get('port'), () => {
console.log(`Local${app.get('port')} at your service!`);
});
//Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));



//Homepage
app.get("/", (req, res) => {
  res.redirect('homepage');
});
app.get("/homepage", (req, res) => {
  let login = {
    username: req.cookies["username"]
  };
  res.render("home", login)
})


//Create new URL page
app.get("/createURL", (req, res) => {
   let login = {
    username: req.cookies["username"]
  };
  res.render('createURL', login);
});
app.post("/submitURL", (req, res) => {
  let string = generateString()
  urlDatabase[string] = req.body.longURL
  keyObject = Object.keys(urlDatabase)
  res.redirect("http://localhost:3000/url/" + keyObject[keyObject.length - 1]);
});


//Display only the result shorURL + redirect
app.get("/url/:id", (req, res) => {
  let urlObject = { shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] };
  res.render("idURL", urlObject);
});
app.get("/url/long/:id", (req, res) => {
  let link = req.params.id;
  res.redirect(301, "http://www." + link);
})


//List all my URLs
app.get("/myList", (req, res) => {
  let test = {database: urlDatabase,
    shortURL: Object.keys(urlDatabase),
    username: req.cookies["username"]};
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
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] };
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


//Login
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)
  res.redirect("homepage")
})
//Logout
app.post("/logout", (req,res) => {
  res.clearCookie("username")
  res.redirect("/homepage")
})








// things to do
function generateString()
{
    var shortURL = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        shortURL += possible.charAt(Math.floor(Math.random() * possible.length));
    return shortURL;
};
//Database
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
var keyObject = ["b2xVn2","9sm5xK"];
