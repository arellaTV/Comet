// Set up mongoose database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose');

// Set up essential middleware and controller
var bodyParser = require('body-parser');
var pageController = require('./pages/pageController.js');

// Set up express, create app as a new instance of express
var express = require('express');
var app = express();

// Hook up body parsing, and serve the static html files
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));

var multiparty = require('multiparty');
var fs = require('fs');

function saveImage(req, res) {
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    console.log('err', err);
    console.log('fields', fields);
    console.log('files', files.imageFile[0].originalFilename);

    // var {path: tempPath, originalFilename} = files.imageFile[0];
    var copyToPath = "../images/" + files.imageFile[0].originalFilename;
    console.log('copyToPath', copyToPath);
    var tempPath = files.imageFile[0].path;
    console.log('tempPath', tempPath);
    fs.readFile(tempPath, (err, data) => {
      // make copy of image to new location
      fs.writeFile(copyToPath, data, (err) => {
        // delete temp image
        fs.unlink(tempPath, () => {
          res.send("File uploaded to: " + copyToPath);
        });
      });
    });
  })
}

// Set up routes with corresponding request handlers
app.get('/pages', pageController.allPages);
app.post('/pages', pageController.newPage);
app.post('/images', saveImage);

// Initiate the server at port 3000
app.listen(3000, function() {
  console.log("i'm listening to 3000 right nao");
});
