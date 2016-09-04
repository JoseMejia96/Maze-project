var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var maze = new Schema({
  x: String,
  y: String,
  maze: String
});
module.exports = mongoose.model('maze', maze);
