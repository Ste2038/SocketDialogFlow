var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

let UserId,
    Cosa;

let LuceStato = false;

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
  console.log('POST / ', JSON.stringify(req.body));
  UserId = req.body.originalRequest.data.user.userId;
  Cosa = req.body.result.parameters.Cosa;
  io.emit('chatId', JSON.stringify(UserId));
  io.emit('parameters', JSON.stringify(Cosa));
  Cosa = JSON.parse (Cosa);
  if (Cosa == "porta"){
    response = `Porta Aperta`;
    res.send(JSON.stringify({ "speech": response, "displayText": response}));
  }

  else if(Cosa == "luce"){
    if (LuceStato){
      response = `La luce è accesa`;
      res.send(JSON.stringify({ "speech": response, "displayText": response}));
    }
  }
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

socket.on('LuceStat', function(Stato){
  LuceStato = Stato;
  console.log('luce ', LuceStato);
});