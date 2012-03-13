var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<b>Hello from my http server!!</b><br/><p>Node.js is awesome</p>');
}).listen(3000);

console.log('Server running on port 3000');