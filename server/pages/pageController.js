var Q = require('q');
var Canvas = require('./pageModel.js');
var ObjectId = require('mongoose').Types.ObjectId;

var createPage = Q.nbind(Canvas.Page.create, Canvas.Page);
var findAllPages = Q.nbind(Canvas.Page.find, Canvas.Page);
// var updatePanel = Q.nbind(Canvas.Panel.findOneAndUpdate, Canvas.Panel);
var deletePages = Q.nbind(Canvas.Page.remove, Canvas.Page);

module.exports = {
  allPages: function (req, res, next) {
    findAllPages({})
      .then(function (pages) {
        res.json(pages);
      })
      .fail(function (error) {
        next(error);
      });
  },

  newPage: function (req, res, next) {
    console.log('request body is', req.body);
    createPage(req.body)
      .then(function(createdPage) {
        if (createdPage) {
          res.json(createdPage);
        }
      });
  },

  newPanel: function(currentPage, currentSelection, localPath) {
    localPath = localPath.substr(2);
    console.log('currentPage', currentPage, 'currentSelection', currentSelection, 'localPath', localPath);
    Canvas.Page.update({ 'panels._id': currentSelection }, { '$set': { 'panels.$.path': localPath } }, function(err, numAffected) {
      if (err) {
        console.log(err)
      }
      console.log(numAffected);
    });

  },

  deleteAll: function(req, res) {
    deletePages({}, function(err) {
      console.log(err);
      res.end();
    });
  }
};
