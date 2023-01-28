// app.js
var http = require('http');
var socket = require('socket.io');
var fs = require('fs');
var express = require('express');
var html = fs.readFileSync('./views/main.ejs', 'utf-8');

var app = express();

var server = http.createServer(app);
var io = socket(server);

app.use( express.static('./static'));
app.set( 'views', './views' )

app.get('/', function(req, res) {
  res.setHeader('Content-type', 'text/html');
  res.write(html);
  res.end();
});

app.get('/new', function(req, res) {
  res.setHeader('Content-type', 'text/html');
  res.write(fs.readFileSync('./views/new.ejs', 'utf-8'));
  res.end();
})

server.listen(process.env.PORT || 3000);

io.on('connection', function(socket) {
  console.log('client connected:' + socket.id);
  socket.on('chat message', function(data) {
    io.emit('chat message', data); // do wszystkich
    //socket.emit('chat message', data); tylko do połączonego
  })
});

setInterval( function() {
  var date = new Date().toString();
  io.emit( 'message', date.toString() );
}, 1000 );

console.log( 'server listens' );
