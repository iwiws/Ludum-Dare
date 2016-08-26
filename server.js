var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

// Setup basic express server
var express = require('express');
var expressServer = express();
var httpServer = require('http').createServer(expressServer);

httpServer.listen(port, ipaddress, function () {
  console.log('Server listening at port %d', port);
});

var io = require('socket.io')(httpServer);


// Routing
expressServer.use(express.static(__dirname + '/public'));

// initialization
var engine = require('./engine.js');
var chatLog = [];

var socketIndex = 0;

// IO functions
io.on('connection', function (socket) {
  // user initialization
  socketIndex++;
  socket.join("room1");
  socket.socketIndex = socketIndex;
  socket.playerName = "Player " + socketIndex;
  console.log("User connected", socket.playerName, " ID ", socket.id);
  
  // send init data
  var displayInitData = engine.getDisplayInitData();
  displayInitData["socketId"] = socket.id;
  socket.emit('displayInitData', displayInitData);
  
  // FUNCTIONS
  
  // player chooses his hero
  socket.on('paf', function (data) {
    console.log("Player", socket.id, " paf : ", data);
  });
  
  // common
  socket.on('disconnect', function () {
    console.log("User left", socket.playerName, " ID ", socket.id);
  });
});

var chatCallback = function (messageObject, socket) {
  if (socket) {
    console.log("CHAT callback to " + socket.id + " : ", messageObject);
    socket.emit('serverChatMessage', messageObject);
  } else {
    console.log("CHAT callback : ", messageObject);
    io.sockets.to("room1").emit('serverChatMessage', messageObject);
  }
};

var loopedBroadcastFunction = function () {
  io.sockets.to("room1").emit('pif', "paf");
};

engine.gameInitialization(loopedBroadcastFunction, chatCallback);
