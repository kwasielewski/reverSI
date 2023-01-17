// app.js
var http = require('http');
var socket = require('socket.io');
var fs = require('fs');
var express = require('express');


var html = fs.readFileSync(process.argv[2], 'utf-8');

var app = express();

var server = http.createServer(app);
var io = socket(server);

app.use( express.static('./static'));

app.get('/', function(req, res) {
  res.setHeader('Content-type', 'text/html');
  res.write(html);
  res.end();
});

server.listen(process.env.PORT || 3000);



setInterval( function() {
  var date = new Date().toString();
  io.emit( 'message', date.toString() );
}, 1000 );

console.log( 'server listens' );
