let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  Name: String,
  Email: String,
  Balance: Number,
  OldTransactions: [{
    type: mongoose.Types.ObjectId,
    ref: "TransferTable"
}]
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel