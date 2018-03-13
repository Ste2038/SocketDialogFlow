var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');

let UserId,
    Cosa,
    Ask,
    OnOff;

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
  UserId = JSON.stringify(req.body.originalRequest.data.user.userId);
  Cosa = JSON.stringify(req.body.result.parameters.Cosa);
  Ask = JSON.stringify(req.body.result.parameters.Ask);
  OnOff = JSON.stringify(req.body.result.parameters.OnOff);
  
  if (Cosa == "porta"){
    console.log("PORTA");
    io.emit('chatId', UserId);
    io.emit('parameters', Cosa);
    response = `Porta Aperta`;
    res.send(JSON.stringify({ "speech": response, "displayText": response}));
  }

  else if(Cosa == "luce"){
    if (Ask == '?'){
      if (LuceStato){
        response = `La luce è accesa`;
        res.send(JSON.stringify({ "speech": response, "displayText": response}));
      }
      else {
        response = `La luce è spenta`;
        res.send(JSON.stringify({ "speech": response, "displayText": response}));
      }
    }
    else {
      console.log("Accesa");
      if (LuceStato){
        io.emit('chatId', UserId);
        io.emit('parameters', Cosa); 
        res.send(JSON.stringify({ "speech": "Ho acceso la luce", "displayText": "Ho acceso la luce"}));
      }
      else {
        io.emit('chatId', UserId);
        io.emit('parameters', Cosa);
        res.send(JSON.stringify({ "speech": "Ho spento la luce", "displayText": "Ho spento la luce"}));
      }
      
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
  
  socket.on('LuceStat', function(Stato){
    LuceStato = Stato;
    console.log('luce ', LuceStato);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});

