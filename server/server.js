// Set up express, create app as a new instance of express
var express = require('express');
var app = express();

// Set up essential middleware and controller
var bodyParser = require('body-parser');
var middleware = require('./middleware.js')
var pageController = require('./pages/pageController.js');

// Set up mongoose database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose');

// Hook up body parsing, and serve the static html files
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));

// Set up routes with corresponding request handlers
app.get('/pages', pageController.allPages);
app.post('/pages', pageController.newPage);
// app.post('/images', middleware.saveImage);
app.post('/deleteAll', pageController.deleteAll);

// Initiate the server at port 3000
app.listen(3000, function() {
  console.log("i'm listening to 3000 right nao");
});
