var app = require('express')();
var basicAuth = require('express-basic-auth');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const functions = require('firebase-functions');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(basicAuth({
  users: { 'admin': 'secret'}
}));

app.get('/', function(req, res){
    res.send("ciao");
});

app.post('/', function(req, res){
  console.log('POST / ', JSON.stringify(req.body.originalRequest.data));
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
/*{
  "id": "700a3357-6712-43f2-98c5-f481b2e6a51f",
  "timestamp": "2018-03-12T15:01:12.085Z",
  "lang": "it",
  "result": {
    "source": "agent",
    "resolvedQuery": "APRI LA PORTA",
    "speech": "",
    "action": "",
    "actionIncomplete": false,
    "parameters": {
      "Cosa": "porta "
    },
    "contexts": [
      {
        "name": "cosa",
        "parameters": {
          "Cosa.original": "PORTA",
          "Cosa": "porta "
        },
        "lifespan": 5
      }
    ],
    "metadata": {
      "intentId": "649f448c-067d-4e53-88d1-ae34948ec211",
      "webhookUsed": "true",
      "webhookForSlotFillingUsed": "false",
      "intentName": "Porta"
    },
    "fulfillment": {
      "speech": "porta  aperta!",
      "messages": [
        {
          "type": 0,
          "platform": "telegram",
          "speech": "porta  aperta!"
        },
        {
          "type": "simple_response",
          "platform": "google",
          "textToSpeech": "porta  aperta!"
        },
        {
          "type": 0,
          "speech": "porta  aperta!"
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success",
    "webhookTimedOut": false
  },
  "sessionId": "d72233a0-ce0a-437c-b6e0-2558ac8c3031"
}*/