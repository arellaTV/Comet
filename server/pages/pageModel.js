var mongoose = require('mongoose');

var pageSchema = new mongoose.Schema({
  title: String,
  panels: []
});

module.exports = mongoose.model('Page', pageSchema);
