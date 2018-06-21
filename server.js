const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {'Conten-Type': 'text/plain'});
  response.end('hello world');
}).listen(9999);

console.log('Server running at http://localhost:9999/');