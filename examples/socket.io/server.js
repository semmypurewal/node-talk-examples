var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var io = require('socket.io');
var credentials = require('./credentials.js');

var totalElapsedTime = 0;
var totalTweetsSeen = 0;

//create redis clients (listener can't do normal stuff)
var client = redis.createClient();
var listener = redis.createClient();

//get twitter streaming credentials from the twitter file
var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

//start streaming data from twitter
t.stream(
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
	    console.log(tweet.text);
	    totalTweetsSeen+=1;
	    if(tweet.text.match(/awesome/)) {
		client.incr('awesome', function(err, result) {
		    var message = {key:'awesome',count:result};
		    client.publish('update',JSON.stringify(message));
		});
	    }

	    if(tweet.text.match(/cool/)) {
		client.incr('cool', function(err, result) {
		    var message = {key:'cool',count:result};
		    client.publish('update',JSON.stringify(message));
		});

	    }
        });
    }
);

//set up our http server
var server = http.createServer(function (req, res) {
    var response = '<script src="socket.io/socket.io.js"></script>';
    response += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>';
    response += '<script>var socket = io.connect("localhost");';
    response += 'socket.on("update", function(data) {';
    response += '    $("#"+data.key).html(data.count);';
    response += '});</script>';
    response += '<b>Hello from my http server!!</b> <br/>';
    response += '<p>The server has been up for ' + totalElapsedTime + ' seconds</p>';
    response += '<p>The server has seen ' + totalTweetsSeen + ' tweets</p>';
    response += '<p>Total awesome: <span id="awesome"></span></p>';
    response += '<p>Total cool: <span id="cool"></span></p>';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(response);
}).listen(3000);

console.log('Server running on port 3000');

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    listener.subscribe('update')
    listener.on('message', function(channel, msg) {
	console.log(msg);
	var message = JSON.parse(msg);
	socket.emit('update', { key:message.key, count: message.count });
    });
});

setInterval(function() {
    totalElapsedTime += 1;
    console.log('The server has now been up for ' + totalElapsedTime + ' seconds');
}, 1000);