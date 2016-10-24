'use strict';
const express = require('express');
const bcrypt = require('bcrypt');

module.exports = ( function() {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.redirect('login');
  });
  //Registeration page
  router.get("/register", (req, res) => {
    res.render("register")
  })
  router.post("/register", (req, res) => {

    //Checks exisiting emails
    for (var id in userDB) {
      let user = userDB[id];
      let newEmail = req.body.email;
      if ( newEmail === user.email ) {
        res.redirect(400, 'register')
      }
    }
    //Checks password
    if (req.body.password === "") {
      res.redirect(400, 'register')
    } else {
      let randomID = generateString();
      let password = req.body.password;
      let hashed_password = bcrypt.hashSync(password, 10);
      userDB[randomID] = {
        id: randomID,
        email: req.body.email,
        password: hashed_password
      }
      let emailArray = userDB[randomID]
      res.cookie("userID", userDB[randomID]);
      console.log("successful signup")
      res.redirect("homepage")
    }
  })
  //Login page
  router.get('/login' , (req, res) => {
    //Check if there is a cookie
    if (req.cookies["userID"]) {
      res.redirect('homepage')
    } else {
    res.render("login")
    }
  })
  router.post('/login', (req, res) => {
    if (req.cookies["userID"]) {
      for (var id in userDB) {
        let loginID = userDB[userCookie.id]
        let databaseID = userDB[id];
        if (loginID === databaseID) {
          res.redirect('homepage')
        }
      }
    }

    let email = req.body.email;
    let password = req.body.password;
    //password is null;
    if (password === "") {
      res.redirect(400, 'login')
    }
    //If there is a cookie
    //No cookie, Authenticates login info.
    for (var id in userDB) {
      let user = userDB[id];
      if (email === user.email && (bcrypt.compareSync(password, user.password))) {
        res.cookie('userID', userDB[id])
        res.redirect('homepage')
      } else {
        res.redirect (400, 'login')
      }
    }
  })
  router.post("/logout", (req,res) => {
    res.clearCookie("userID")
    console.log("successful logout")
    res.redirect("login")
  })
  //Homepage
  router.get("/homepage", (req, res) => {
    if (req.cookies["userID"]) {
      let userCookie = req.cookies["userID"];
      let userID = userDB[userCookie.id]
      let userEmail = {
        username: userID.email
      };
      res.render("home", userEmail);
    }
    if (!req.cookies["userID"]){
    res.redirect("login")
    }
  })
  //Create new URL page
  router.get("/createURL", (req, res) => {
    let userCookie = req.cookies["userID"];
    let userID = userDB[userCookie.id]
    let userEmail = {
      username: userID.email
    };
    res.render("createURL", userEmail);
  });
  router.post("/submitURL", (req, res) => {
    let string = generateString()
    urlDatabase[string] = req.body.longURL
    keyObject = Object.keys(urlDatabase)
    res.redirect("http://localhost:3000/url/" + keyObject[keyObject.length - 1]);
  });
  //Display only the result shorURL + redirect
  router.get("/url/:id", (req, res) => {
    let userCookie = req.cookies["userID"];
    let userID = userDB[userCookie.id]
    let urlObject = { shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      username: userID.email};
    res.render("idURL", urlObject);
  });
  router.get("/url/long/:id", (req, res) => {
    let link = req.params.id;
    res.redirect(301, "http://www." + link);
  })
  //List all my URLs
  router.get("/myList", (req, res) => {
    let userCookie = req.cookies["userID"];
    let userID = userDB[userCookie.id]
    let test = {database: urlDatabase,
      shortURL: Object.keys(urlDatabase),
      username: userID.email};
    res.render("myList", test);
  });
  //Delete Link
  router.post("/url/delete/:id", (req, res) => {
    let link = req.params.id;
    delete urlDatabase[link];
    res.redirect("/myList");
  })
  //Edit Link
  router.get("/url/edit/:id", (req, res) => {
    let userCookie = req.cookies["userID"];
    let userID = userDB[userCookie.id]
    let urlObject = { shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      username: userID.email };
    res.render("editURL", urlObject);
  })
  router.post("/url/edit/:id", (req, res) => {
    let urlObject = { shortURL: req.params.id,
      longURL: urlDatabase[req.params.id] };
      console.log("body ----------->" + req.body.longURL)
      console.log("params --------->" + req.params.id)
    urlDatabase[req.params.id] = req.body.longURL;
    res.redirect("/myList");
  })
  return router
})();
function generateString() {
  var shortURL = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 5; i++ )
    shortURL += possible.charAt(Math.floor(Math.random() * possible.length));
  return shortURL;
};
var userDB = {};
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
var keyObject = ["b2xVn2","9sm5xK"];
