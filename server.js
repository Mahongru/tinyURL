//Declare my dependencies
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require ("method-override");
const cookieParser = require("cookie-parser");
// const authentication = require('./routes/authentication');
const url = require('./routes/url');
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

//Routes
// app.use('/', authentication)
app.use('/' , url)
