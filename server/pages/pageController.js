var Q = require('q');
var Page = require('./pageModel.js');

var findPage = Q.nbind(Page.findOne, Page);
var createPage = Q.nbind(Page.create, Page);
var findAllPages = Q.nbind(Page.find, Page);
var updatePage = Q.nbind(Page.update, Page);
var deletePages = Q.nbind(Page.remove, Page);

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
        console.log('in here!');
        if (createdPage) {
          res.json(createdPage);
        }
      });
  },

  newPanel: function(currentPage, currentSelection, localPath) {
    // updatePage({ id: currentPage, panels: []})
    console.log(currentPage, currentSelection, localPath);
    findAllPages().elemMatch('panels', {"id": currentSelection});
  },

  deleteAll: function(req, res) {
    deletePages({}, function(err) {
      console.log(err);
      res.end();
    });
  }
};
