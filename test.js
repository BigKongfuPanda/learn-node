const http = require('http');
const url = require('url');

// https.get('https://www.baidu.com', res => {
//     console.log('status code: ', res.statusCode);
//     console.log('headers: ', res.headers);

//     res.on('data', data => {
//         process.stdout.write(data);
//     });
// }).on('error', err => {
//     console.log(err);
// });

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let queryObj = url.parse(req.url, true).query;
    res.end(JSON.stringify(queryObj));
}).listen(3000);