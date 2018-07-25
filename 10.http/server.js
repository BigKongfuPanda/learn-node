const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 从命令行参数获取root目录，默认是当前目录：
let root = path.resolve(process.argv[2] || '.');

console.log('Static root dir: ' + root);

// 创建服务器
let server = http.createServer((request, response) => {
  // 获取URL的path，类似 '/index.html'
  let pathname = url.parse(request.url).pathname;
  // 获取对应的本地文件路径，类似 '/http/index.html'
  let filepath = path.join(root, pathname);
  // 获取文件状态：
  fs.stat(filepath, (err, stats) => {
    if (!err && stats.isFile()) {
      // 没有出错并且文件存在
      console.log('200 ' + request.url);
      // 发送200响应
      response.writeHead(200);
      // 将文件流导向response
      fs.createReadStream(filepath).pipe(response);
    } else {
      // 出错了或者文件不存在：
      console.log('404 ' + request.url);
      // 发送404响应：
      response.writeHead(404);
      response.end('404 Not Found');
    }
  });
});

server.listen(9999);

console.log('Server is running at localhost:9999/');

