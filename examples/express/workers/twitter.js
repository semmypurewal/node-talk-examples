var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');

var client = redis.createClient();

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

module.exports = null;