let express = require("express");
const app = express();
require('dotenv').config();
let bodyParser = require("body-parser");
let path = require("path");
let staticFiles = path.join(__dirname, "public");
let Users = require("./Model/User.model")
let Transfers = require('./Model/Transfer.model')

let connection = require("./db.connection");
connection();

app.set('view-engine', 'ejs');
app.use(express.static(staticFiles));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());



app.get('/',async(req,res)=>{
  res.render('Home.ejs')
})

app.get('/Customers', (req,res)=>{
  res.render('Users.ejs')
})
app.get("/Users", async(req,res)=>{
  let allUsers = await Users.find({})
  res.status(200).json({users: allUsers})
})
app.get("/User/:id", async(req,res)=>{
let UserId = req.params.id;
let User = await Users.findById({_id: UserId})
console.log(User);
res.status(200).render('User.ejs', {User})
})

app.post('/User-add', async(req,res)=>{
  const unit = new Users(req.body)
  await unit.save()
  res.status(200).json({message: 'success'})
})
app.get('/table',async(req,res)=>{
  res.render('TransferTable.ejs')
})
app.get("/TransferHistory",async(req,res)=>{
  let transaction = await Transfers.find({})
  console.log(transaction);
  res.status(200).json({transaction: transaction})
})

app.get("/Transfer/:id", async(req,res)=>{
  const FromId = req.params.id;
  res.status(200).render('TransferPage.ejs', {FromId})
})
app.post("/Transfer/:id", async(req,res)=>{
  let FromId =  req.params.id;
  let amount = parseInt(req.body.Amount)
  let ToID = req.body.id;
  let to = await Users.findById({_id: ToID });
  let from = await Users.findById({_id: FromId })
  if (from.Balance < amount ){
    return res.status(205).json({error : "U dont have that Amount to transfer"})
  }else{  
  let FromNewBalance = from.Balance - amount;
  let ToNewBalance = to.Balance + amount;
  let transferObj = new Transfers({FromID: FromId, FromName: from.Name ,ToID : ToID, ToName: to.Name ,Amount: amount})
  await transferObj.save();
  await Users.findByIdAndUpdate(
    FromId,
    {Balance: FromNewBalance, $push : {OldTransactions: transferObj }, new: true})
  await Users.findByIdAndUpdate(
    ToID,
    {Balance: ToNewBalance, $push : {OldTransactions: transferObj }, new: true})
  
  return res.status(200).json({redirect: "/Customers"})}
})
const port = process.env.PORT || 3000;
app.listen(port, () =>
console.log(`Server is listening on port ${port}.`));