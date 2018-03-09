var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.post('/', function(req, res){
  console.log('POST /');
  io.emit('chat message', 'porta');
});

io.on('connection', function(socket){
  console.log("Qualcuno si è connesso");
  socket.emit('chat message', 'benvenuto');

  socket.on('chat message', function(msg){
    console.log(msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening');
});
//process.env.PORT || 3000
/*
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});*/
