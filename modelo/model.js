var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var maze = new Schema({
  x: Number,
  y: Number,
  maze: Object
});
module.exports = mongoose.model('maze', maze);
