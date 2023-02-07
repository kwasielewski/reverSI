// app.js
var http = require('http');
var socket = require('socket.io');
var fs = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
const e = require('express');
const { getDefaultSettings } = require('http2');
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
    
    attacker = req.body.nick =="" ? "guest" : req.body.nick
  rooms.set(context.id, {pass:req.body.password, players:1, attacker:attacker, defender:"guest"})
  context['attacker'] = attacker
  res.render('attack', context)
})

app.get('/attack', function(req, res){
  //socket magic
})

app.post('/join', function(req, res){
  console.log("in join")
  cuartito = 0
  idd =-1
  console.log(req.body.identifier)
  if(!req.body.identifier){
    console.log("from list")
    console.log(req.body)
    console.log(req.body.r[0])
    cuartito = rooms.get(parseInt(req.body.r[0]))
    idd = parseInt(req.body.r[0])
  }else{
    cuartito = rooms.get(parseInt(req.body.identifier))
    idd = parseInt(req.body.identifier)
  }
  
  console.log(rooms)
  console.log(cuartito)
  if(!cuartito || cuartito.players == 2){
    console.log("too many players")
    res.render('main', context)
  }else{
    context = {id:idd}
    res.render('password', context);//???
  }
})

app.post('/joinwithpasswd', function(req, res){
  console.log('in joinwith passwd')
  console.log(context)
  cuartito = 0
  idd = -1

  console.log(req.body.identifier)
  cuartito = rooms.get(parseInt(context.id))
  idd = parseInt(context.id)
  pswd = cuartito['pass']
  attacker = cuartito['attacker']
  defender = req.body.nick == "" ? "guest" : req.body.nick
  context['attacker'] = attacker
  context['defender'] = defender
  if(req.body.password == pswd){
    rooms.set(rooms.set(idd, {pass:pswd, players:2, attacker:attacker, defender:defender}))
    res.render('defense', context)
  }else{
    res.render('password', context)
  }
})
app.get('/select', function(req, res){
  avaiblerooms = [...rooms].filter(([k, v])=> v['players']==1)
  numrooms = avaiblerooms.length
  context = {rooms:avaiblerooms, count:numrooms}
  res.render('rooms', context)
})

server.listen(process.env.PORT || 3000);

io.on('connection', function(socket) {
  console.log('client connected:' + socket.id);
  //join
  let idd = "";
  socket.on('joinn', function(data){
    console.log("joining")
    console.log(data.id)
    socket.join(data.id);
    idd = data.id;
  })
  socket.on('attack', function(data) {
    //io.emit('attack', data); // do wszystkich
    socket.to(idd).emit('attack', data);// tylko do połączonego
  })
  socket.on('defense', function(data){
    //io.emit('defense', data)
    data.defender = rooms.get(parseInt(idd))['defender']
    console.log(rooms.get(parseInt(idd)))
    socket.to(idd).emit('defense', data);
  })
});

/*setInterval( function() {
  var date = new Date().toString();
  io.emit( 'message', date.toString() );
}, 1000 );*/

console.log( 'server listens' );
