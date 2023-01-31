// app.js
var http = require('http');
var socket = require('socket.io');
var fs = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
const e = require('express');
var html = fs.readFileSync('./views/main.ejs', 'utf-8');

var app = express();

var server = http.createServer(app);
var io = socket(server);

app.set('view engine', 'ejs');


let rooms = new Map();
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({resave:true, saveUninitialized:true, secret:'sdfgzdfh'}))
app.use( express.static('./static'));
app.set( 'views', './views' )

//główny ekran
app.get('/', function(req, res) {
  context = {id:''};
  console.log("in main")
  console.log(req.context)
  console.log(res.context)
  res.setHeader('Content-type', 'text/html');
  //res.write(html);
  //res.end();
  res.render("main", context)
});

//tworzenie nowego pokoju
app.get('/new', function(req, res) {
  console.log("in new")
  res.setHeader('Content-type', 'text/html');
  context = {}
  if(!req.context){
    context = {id:0}
    context.id = (Math.floor(Math.random()*1000)+1)
  }else{
    context = req.context
  }
  //res.write(fs.readFileSync('./views/new.ejs', 'utf-8'));
  //res.end();

  res.idd = context.id
  res.render("new", context)
})

app.post('/create', function(req, res){
  console.log("in create")
    //console.log(context.id)
    //console.log(context.password)
    console.log(req.body)
    console.log(context.id)
  rooms.set(context.id, {pass:req.body.password, players:1})
  res.render('attack', context)
})

app.get('/attack', function(req, res){
  //socket magic
})

app.post('/join', function(req, res){
  console.log("in join")
  
  console.log(req.body.identifier)
  cuartito = rooms.get(parseInt(req.body.identifier))
  console.log(rooms)
  console.log(cuartito)
  if(!cuartito){
    res.render('main', context)
  }else{
    context = {id:parseInt(req.body.identifier)}
    res.render('password', context);//???
  }
})

app.post('/joinwithpasswd', function(req, res){
  console.log('in joinwith passwd')
  console.log(context)
  if(req.body.password == rooms.get(parseInt(context.id))['pass']){
    res.render('defense', context)
  }else{
    res.render('password', context)
  }
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
