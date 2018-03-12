var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    //processV1Request(request, response);
  } else if (request.body.queryResult) {
    //processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
  console.log('POST / ', req.body, 'a');
  io.emit('chat message', 'porta');
  io.emit('log', JSON.stringify(req.body));
  
  res.send(req.body);
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

http.listen(process.env.PORT || 3000, function(){
  console.log('listening');
});
//process.env.PORT || 3000
/*
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});*/
