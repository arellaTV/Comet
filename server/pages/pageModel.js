var mongoose = require('mongoose');

var panelSchema = new mongoose.Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  path: String
});

var pageSchema = new mongoose.Schema({
  title: String,
  panels: [panelSchema]
});

module.exports =  {
  Page: mongoose.model('Page', pageSchema),
  Panel: mongoose.model('Panel', panelSchema)
}
