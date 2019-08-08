
// const port=process.env.PORT || 8000;
// var express = require('express');
// const path = require('path');
// const app = express();

// //var server = express.createServer();
// // express.createServer()  is deprecated. 

// var server = express(); // better instead

//   server.use('/js', express.static(__dirname + '/js'));
//   server.use('/libs', express.static(__dirname + '/libs'));
//   server.use('/style',express.static(__dirname + '/libs/style.css'));
//  server.use('',express.static(__dirname + '/public') );


  
// // server.listen(port, ()=>    console.log("\x1b[33m%s\x1b[0m" ,"Server started at port " + "\x1b[31m"+ port ));



    
'use strict'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')


// app.use(function(req, res, next) {
//     if(!req.secure) {
//       return res.redirect(['https://', req.get('Host'), req.url].join(''));
//     }
//     next();
//   });
app.use('/js', express.static(path.join(__dirname + '/js')))
app.use('/libs', express.static(path.join(__dirname +  '/libs')))
app.use( express.static(path.join(__dirname +  '/public')))
app.use(cors())

module.exports = app