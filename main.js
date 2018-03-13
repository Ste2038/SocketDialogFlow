var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
  console.log('POST / ', JSON.stringify(req.body));
  io.emit('chatId', JSON.stringify(req.body.originalRequest.data.user.userId));
  io.emit('parameters', JSON.stringify(req.body.result.parameters.Cosa));
  response = "This is a sample response from your webhook!"
  res.send(JSON.stringify({ "speech": response, "displayText": response}));
});

io.on('connection', function(socket){
  console.log("Qualcuno si è connesso");

  socket.on('chat message', function(msg){
    console.log(msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});