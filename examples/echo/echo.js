var net = require('net');

var server = net.createServer(function(socket) {
    console.log('hello world!');

    socket.on('connect', function() {
	console.log('connection made');
    });

    socket.on('data', function(buffer) {
	console.log(buffer.toString());
	socket.write(buffer.toString(), function() {
	    console.log('buffer written!');
	});
    });

    socket.on('close', function() {
	console.log('connection closed');
    });
});

server.listen(3000); //listen on port 300

console.log('listening on port 3000');