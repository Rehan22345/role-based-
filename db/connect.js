const mongoose = require('mongoose');
const database_url = 'mongodb+srv://rehanpoudel2:nodejs123@cluster0.cv5ch.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const connectdb = async ()=>{
    await mongoose.connect(database_url);
  console.log("Hello from databse hahhahahahahahahah");
}
module.exports = connectdb;