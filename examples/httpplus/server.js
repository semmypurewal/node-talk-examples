var http = require('http');

var totalElapsedTime = 0;

http.createServer(function (req, res) {
    var response = '<b>Hello from my http server!!</b> <br/>';
    response += '<p>The server has been up for ' + totalElapsedTime + ' seconds</p>';
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(response);
}).listen(3000);

console.log('Server running on port 3000');

setInterval(function() {
    totalElapsedTime += 1;
    console.log('The server has now been up for ' + totalElapsedTime + ' seconds');
}, 1000);