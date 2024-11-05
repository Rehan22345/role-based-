const mongoose = require("mongoose");
const schema = mongoose.Schema({
    title :  String,
    subtitle : String,
    description : String,
  
})
const model = mongoose.model("Blogs-model", schema);
module.exports = model