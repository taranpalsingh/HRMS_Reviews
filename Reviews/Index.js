console.log("Starting Reviews JS");
const PORT = 3000;

const sql = require('mssql');
const lodash = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');

var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var sqlConfig = {
    user: 'sa',
    password: 'Sahil1234',
    server: 'localhost',
    database: 'test_db'
}

// GET all Reviews
app.get('/AllReviews',async function (req, res) {

    // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
    // if(!token){
    //   alert("You are not authorized.");
    //   window.location.href = "Login Page"; // Redirect
    // }
    sql.connect(sqlConfig, function() {

        var request = new sql.Request();
        request.query('select * from Reviews', function(err, recordset) {
            if(err) console.log(err);
            // res.end(JSON.stringify(recordset));
            console.log(recordset.recordset);
            // res.send(recordset.recordset);
            rres.send("OK");
            sql.close();
        });
    });
});




  //*************    post a new review
  app.post('/Review/',  function(req,res){


    // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
    // if(!token){
    //   alert("You are not authorized.");
    //   window.location.href = "Login Page"; // Redirect
    // }

      console.log(req.body.Content);
      sql.connect(sqlConfig, function() {

          var request = new sql.Request();
          request.query("Insert into Reviews values( " + req.body.ProjectId + ", \' " + req.body.Content + " \' ," + req.body.Rating + "," + req.body.RevieweeId + "," + req.body.ReviewerId + " );" , function(err, recordset) {
          if(err) console.log(err);
          res.end("Created");
          sql.close();
          });
      });
      res.send("OK");
  });


////*************    get all reviews for RevieweeId
app.post('/reviewee/', async function (req,res) {

  // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
  // if(!token){
  //   alert("You are not authorized.");
  //   window.location.href = "Login Page"; // Redirect
  // }

  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where ProjectId = ' + req.body.ProjectId + 'and RevieweeId = ' + req.body.RevieweeId , function(err, recordset) {
          if(err) console.log(err);
          console.log(recordset.recordset);
          res.send(recordset.recordset);
          sql.close();
      });
  });
});

app.post('/reviewee/', async function (req,res) {

  // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
  // if(!token){
  //   alert("You are not authorized.");
  //   window.location.href = "Login Page"; // Redirect
  // }

  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where ProjectId = ' + req.body.ProjectId + 'and RevieweeId = ' + req.body.RevieweeId , function(err, recordset) {
          if(err) console.log(err);
          console.log(recordset.recordset);
          res.send(recordset.recordset);
          sql.close();
      });
  });
});




////*************    get average rating for reviewee for a particular Project
app.post('/ratings/', async function (req,res) {
  // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
  // if(!token){
  //   alert("You are not authorized.");
  //   window.location.href = "Login Page"; // Redirect
  // }

  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where RevieweeId = ' + req.body.RevieweeId +'and ProjectId = ' + req.body.ProjectId, function(err, recordset) {
          if(err) console.log(err);
          result = recordset.recordset;
          console.log("average: " + result[0].Rating);
          res.send("average: " +  result[0].Rating);
          sql.close();
      });
    });
});


////*************    get average rating for all employees ADMIN Page
app.post('/Allratings/', async function (req,res) {
  // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
  // if(!token){
  //   alert("You are not authorized.");
  //   window.location.href = "Login Page"; // Redirect
  // }

  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where RevieweeId = ' + req.body.RevieweeId , function(err, recordset) {
          if(err) console.log(err);
          result = recordset.recordset;
          console.log(result);
          var avg = 0;
          if(result.length == 0){
            // alert("Please Enter a valid ID");
            res.send("Please Enter a valid ID");
          }
          for(var i=0; i<result.length; i++){
            avg = avg + result[i].Rating;
          }
          avg = avg / (result.length);
          console.log("average: " + avg);
          res.send("average: " + avg);
          sql.close();
      });
    });
});

app.post('/updateReview/', async function (req,res) {

  // var token = await jwt.verify(req.get('x-auth-token'),config.get('jwtPrivateKey'));
  // if(!token){
  //   alert("You are not authorized.");
  //   window.location.href = "Login Page"; // Redirect
  // }

  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query("update Reviews set Content='"+req.body.Content+"'where ProjectId="+req.body.ProjectId+" and RevieweeId="+req.body.RevieweeId, function(err, recordset) {
          if(err) console.log(err);
          console.log("Updated Record");
          res.send("Record Updated");
          sql.close();
      });
  });
});


var server = app.listen(PORT, function () {

    var host = server.address().address;
    var port = server.address().port;
    console.log("app listening at http://%s:%s", host, port);
});
