const mongoose = require("mongoose");


const connection = () => {
    mongoose.set('strictQuery', true);
    return mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => {
        console.log("database connection succesful");
    }).catch((err) =>{
        console.log("database connection error" + err);
    })
}

module.exports = connection;