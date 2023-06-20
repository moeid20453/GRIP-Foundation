let mongoose = require("mongoose");

let TransferSchema = mongoose.Schema({
  FromID: String,
  FromName: String, 
  ToID: String,
  ToName: String,
  Amount: Number
})


let transferModel = mongoose.model("TransferTable", TransferSchema)

module.exports = transferModel