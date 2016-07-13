var multiparty = require('multiparty');
var fs = require('fs');
var pageController = require('./pages/pageController.js');

function saveImage(req, res) {
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    var currentPage = fields.currentPage[0];
    var currentSelection = fields.currentSelection[0];

    // var {path: tempPath, originalFilename} = files.imageFile[0];
    var copyToPath = "../images/" + files.imageFile[0].originalFilename;
    var tempPath = files.imageFile[0].path;
    fs.readFile(tempPath, (err, data) => {
      // make copy of image to new location
      fs.writeFile(copyToPath, data, (err) => {
        var result = pageController.newPanel(currentPage, currentSelection, copyToPath);
        res.send(result);
        // delete temp image
        fs.unlink(tempPath, () => {
          // res.send("File uploaded to: " + copyToPath);
        });
      });
    });
  })
}

module.exports.saveImage = saveImage;
