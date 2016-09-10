var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var maze = new Schema({
  x: Object,
  y: Object,
  maze: Object
});
module.exports = mongoose.model('maze', maze);
