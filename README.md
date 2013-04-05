This is a set of example programs written for a presentation on Node.js. It includes
a Vagrantfile and a set of Chef cookbooks to build a working development environment
that includes redis and mongodb. You can read more about how to set up the Vagrant
Node.js environment by taking a look at my node-dev-bootstrap project, also available
on github. More about that can be found here:

http://blog.semmy.me/post/45607300220/vagrant-1-1-0-and-node-dev-bootstrap

To get the examples to work, you shouldn't have to use Vagrant -- you can install
Node.js and Redis on your local machine and run them locally.

For the examples that use the Twitter streaming API, you'll need to create an app
on Twitter at dev.twitter.com and then put the necessary credentials in a credentials.js
file in each of the directories. You can read more about how to do this here:

http://blog.semmy.me/post/17390049513/streaming-twitter-with-ntwitter-and-node-js

The preferred order of the examples is:

echo: a really simple echo server in node

http: a really simple http server in node

httpplus: a more interesting http server, illustrating the non-blocking nature of node

twitter: a more striking example, the http server keeps track of all the previous stuff and,
in addition, streams data from twitter

redis: the same twitter/http server, but now it also stores more info in a
redis database

socket.io: now the server also runs a socket.io server on top of the http server
and passes messages to the client when new tweets are found containing the search
terms

express: the previous example, more organized using express and ejs

canvas: the express process hooked up to a canvas pie-chart generator (written by http://github.com/embeepea)





