var express = require("express");
var redis = require('redis');
var bodyParser = require('body-parser');
var jsonparser = bodyParser.json();

var client = redis.createClient(6379, '127.0.0.1', {no_ready_check: true});

var app = express();

app.post('/set',jsonparser,(req,res)=>{
    let data = req.body;
    client.set(data.key,data.val,(err,result)=>{
      if(result){
        console.log(res);
        data.success="true";
        res.status(200).json(data);
      }
      if(err){
        console.log(err);
        res.send(err);
      }
    });

    if(data.exp) client.setex(data.key,data.exp,data.val,(err,result)=>{
      if(err) console.log(err);
    });
});

app.get('/keys/:kp',jsonparser,(req,res)=>{
    let kp = req.params.kp;
    client.keys(kp,(err,keys)=>{ 
      if(keys){
        console.log(keys);
        res.status(200).json(keys);
      }
      if(err){
        console.log(err);
        res.send(err);
      }
    });
});

app.get('/get/:key',(req,res)=>{
  let key = req.params.key;
  client.get(key,(err,val)=>{
    if(val){
      console.log(val);
      res.status(200).json(val);
    }
    if(err){
      console.log(err);
      res.send(err);
    } 
  });
})

app.delete('/del/:key',(req,res)=>{
  let key = req.params.key;
  client.del(key,(err,val)=>{
    if(val){
      console.log(val);
      res.status(200).json(val);
    }
    if(err){
      console.log(err);
      res.send(err);
    } 
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
