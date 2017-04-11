// server side code
var sys = require('util'),
    events = require('events');

var messageDispatcher = function() {
    if(false === (this instanceof messageDispatcher)) {
        return new messageDispatcher();
    }
    events.EventEmitter.call(this);
}
sys.inherits(messageDispatcher, events.EventEmitter);

messageDispatcher.prototype.setIo = function(io) {
	this.io = io;
}

messageDispatcher.prototype.sendMessageFromClient = function(id, data) {
    data.clientId = id;
    console.log("flowdebug: messageDispatcher: sendMessageFromClient " +
                id + ": " + JSON.stringify(data));
    this.emit('message', data);
}

messageDispatcher.prototype.sendMessageToClient = function(id, data) {
    console.log("flowdebug: messageDispatcher: sendMessageToClient " +
                id + ": " + JSON.stringify(data));
    var emitter = this.io && this.io.sockets && this.io.sockets.sockets ? this.io.sockets.sockets[id] : null;
    if  (emitter) {
        emitter.emit('message', data);
    }
}

messageDispatcher.prototype.sendMessageToRoom = function(room, message) {
    console.log("flowdebug: messageDispatcher: sendMessageToRoom " +
                room + ": " + JSON.stringify(message));
   this.io.sockets.in(room).emit('message', message);
}

module.exports = new messageDispatcher();
