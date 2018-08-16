const zlib = require('zlib');
const fs = require('fs');
const http = require('http');

// 客户端示例
const request = http.get({
    host: 'example.com',
    path: '/',
    port: 80,
    headers: { 'Accept-Encoding': 'gzip,deflate' }
});

request.on('response', response => {
    const output = fs.createWriteStream('example.com_index.html');
    switch (response.headers['content-encoding']) {
        case 'gzip':
            response.pipe(zlib.createGunzip()).pipe(output);
            break;
        case 'deflate':
            response.pipe(zlib.createInflate()).pipe(output);
            break;
        default:
            response.pipe(output);
            break;
    }
});


//服务端的示例。压缩资源给response，必须得判断request的请求头中能够接受的encoding类型
http.createServer((request, response) => {
    const raw = fs.createReadStream('index.html');
    let acceptEncoding = request.headers['accept-encoding'];
    if (!acceptEncoding) {
        acceptEncoding = '';
    }
    // 判断acceptEncoding的类型
    if (/\bdeflate\b/.test(acceptEncoding)) {
        response.writeHead(200, { 'Content-Encoding': 'deflate' });
        raw.pipe(zlib.createDeflate()).pipe(response);
    } else if (/\bgzip\b/.test(acceptEncoding)) {
        response.writeHead(200, { 'Content-Encoding': 'gzip' });
        raw.pipe(zlib.createGzip()).pipe(response);
    } else {
        response.writeHead(200, {});
        raw.pipe(response);
    }
}).listen(3000);
