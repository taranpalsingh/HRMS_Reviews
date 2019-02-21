console.log("Starting Reviews JS");
const PORT = 3000;

const lodash = require('lodash');
const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');

var app = express();
app.use(bodyParser.json());

var sqlConfig = {
    user: 'sa',
    password: 'P@ssw0rd',
    server: 'localhost',
    database: 'hrm'
}

// GET all
app.get('/',async function (req, res) {

    sql.connect(sqlConfig, function() {

        var request = new sql.Request();
        request.query('select * from Reviews', function(err, recordset) {
            if(err) console.log(err);
            // res.end(JSON.stringify(recordset));
            console.log(recordset.recordset);
            res.send(recordset.recordset);
            sql.close();
        });
    });
});


//login request
// app.post('/login', (req,res) => {
//   console.log(req.body.username);
//   console.log(req.body.password);
//   res.send("OK");
// });
// app.listen(PORT);


//*************    post a new review
app.post('/',  function(req,res){
    // token check
    // role of the user API
     //    myOBJ = {
     //      "ProjectId": 1,
     //      "Content": "Awesome",
     //      "Rating": 8,
     //      "RevieweeId": 4,
     //      "ReviewerId": 6
     // }
    console.log(req.body.Content);
    sql.connect(sqlConfig, function() {

        var request = new sql.Request();
        request.query("Insert into Reviews values( " + req.body.ProjectId + ", \' " + req.body.Content + " \' ," + req.body.Rating + "," + req.body.RevieweeId + "," + req.body.ReviewerId + " );" , function(err, recordset) {
            if(err) console.log(err);
            // res.end(JSON.stringify(recordset));
            console.log("OK");
            sql.close();
        });
    });
    res.send("OK");
});


////*************    get all reviews for RevieweeId
app.get('/reviewee/:id', async function (req,res) {
  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where RevieweeId = ' + req.params.id, function(err, recordset) {
          if(err) console.log(err);
          console.log(recordset.recordset);
          res.send(recordset.recordset);
          sql.close();
      });
  });
});


////*************    get all reviews for ReviewerId
app.get('/reviewer/:id', async function (req,res) {
  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where ReviewerId = ' + req.params.id, function(err, recordset) {
          if(err) console.log(err);
          console.log(recordset.recordset);
          res.send(recordset.recordset);
          sql.close();
      });
  });
});

////*************    get average rating for reviewee
app.get('/ratings/:id', async function (req,res) {
  sql.connect(sqlConfig, function() {

      var request = new sql.Request();
      request.query('Select * from Reviews where RevieweeId = ' + req.params.id, function(err, recordset) {
          if(err) console.log(err);
          result = recordset.recordset;
          console.log(result);
          var avg = 0;
          for(var i=0; i<result.length; i++){
            avg = avg + result[i].Rating;
          }
          avg = avg/result.length;
          console.log("average: "+avg);
          res.send(JSON.parse({avg}));
          sql.close();
      });
  });
});




// app.listen(PORT,() => {
//   console.log('server started on' + PORT);
// });

var server = app.listen(PORT, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});
