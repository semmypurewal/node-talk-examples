var http = require('http');
var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');


function TwitterWorker(terms) {
    var client = redis.createClient();
    
    //get twitter streaming credentials from the twitter file
    var t = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
    });

    var update = function(key) {
	client.incr(key, function(err, result) {
	    if(err) {
		console.log('ERROR: ' + err);
	    } else {
		var message = {key:key, count:result};
		client.publish('update', JSON.stringify(message));
	    }
	});
    };


    //start streaming data from twitter
    t.stream(
	'statuses/filter',
	{ track: terms },
	function(stream) {
            stream.on('data', function(tweet) {
		console.log(tweet.text);
		terms.forEach(function(term)  {
		    if(tweet.text.match(new RegExp(term,'i'))) {
			update(term);
		    }
		});
            });
	}
    );
};

module.exports = TwitterWorker;