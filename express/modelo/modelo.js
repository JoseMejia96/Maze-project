var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var maze = new Schema({
  x: String,
  y: String,
//  maze:{type:String,required:true},
  fecha: { type: Date, default: Date.now }
});
module.exports = mongoose.model('maze', maze);
