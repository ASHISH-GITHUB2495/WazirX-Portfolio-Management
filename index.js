const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');


const app = express();
var mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const dbUrl = "mongodb://127.0.0.1:27017/tradingTrail";

var paths = { paths: "Home" };
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

//mongodb+srv://AshishYadav:<password>@cluster0.ozrpk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(process.env.MONGODB_URI || dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
app.get('/', (req, res) => {
  res.send("<h1>Express is running smooth</h1>");
});

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', dbUrl);

})

db.on('error', err => {
  console.error('connection error:', err);
  

})

const Bought = {
  coin_name : String,
  AtValue : Number,
  volume : Number,
  date: String,
  time: String

};


const bou = mongoose.model("bou", Bought);

app.get("/filldata", (req, res) => {

  var coin_name = 0;
  
  var atvalue =  parseFloat(req.query.atvalue);
  var volume = parseFloat(req.query.volume);
  var coin_name = req.query.coinname;

  console.log(atvalue+" "+volume+" "+coin_name);

  var today =new Date();
  var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
  var time = today.getHours()%12+":"+today.getMinutes()+":"+today.getSeconds();
  
  const add1 = new bou({
    coin_name : coin_name,
    AtValue : atvalue,
    volume : volume,
    date: date,
    time: time
  })
  const add = [add1];
    bou.insertMany(add, function (err) {
      if (err) {
  
        res.send({msg:"Some Error has occured --- Try again"});
      } else {

        res.send({msg:"Successfully added  --- Add new one"});
      }
    });

})

app.get("/getd", (req, res) => {             //Data inside database
  bou.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      res.send({ code: 0 });
    } else {
       console.log(foundItems);
      res.send({ code: 1, foundItems });
    }
  });

})

app.get("/delData", (req, res) => {  //deleting data from database
    
  var datee = req.query.date;
  var timee =req.query.time;
  
  console.log("requested "+datee+" "+timee);
  
  bou.findOneAndDelete({date: {$eq:datee} , time: {$eq:timee} }, function (err, docs) {
    if (err){
        console.log(err);
        res.send({code:0});
    }
    else{
        console.log("Deleted User : ", docs);
        res.send({code:1});
    }
});

})






app.get('/getNames',(req,res)=>{
 
 console.log("Got request");
   async function fetchData() {             //for options in adding coins
          const response = await fetch("https://api.wazirx.com/api/v2/market-status");
          response
            .json()
            .then((response) => {
             console.log(response);
             res.send(response);
     
          });
        }
        fetchData();
  });
  app.get('/getcurr',(req,res)=>{                        //for current prices 
 
    console.log("Got request");
      async function fetchData() {
             const response = await fetch("https://api.wazirx.com/api/v2/tickers");
             response
               .json()
               .then((response) => {
                console.log(response);
                res.send(response);
        
             });
           }
           fetchData();
     });






































 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Expressis listing on ${port}`);