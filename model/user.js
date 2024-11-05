const mongoose = require("mongoose");
const schema = mongoose.Schema({
    name :  String,
    email :  String,
   password : String,

})
const model = mongoose.model("Users", schema);
module.exports = model