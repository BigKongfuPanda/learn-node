
// 1. 创建一个WebSocket的服务器实例


const WebSocket = require('ws');

// 引入Server类：
const WebSoketServer = WebSocket.Server;

// 实例化
const wss = new WebSoketServer({
  port: 3000
});

wss.on('connection', function(ws){
  console.log(`[SERVER] connection()`);
  ws.on('message', function(message){
    console.log(`[SERVER] Received: ${message}`);
    ws.send(`ECHO: ${message}`, (err) => {
      if (err) {
        console.log(`[SERVER] error: ${err}`);
      }
    });
  });
});



// 2. 创建WebSocket连接，浏览器端的写法

// 打开一个WebSocket:
var ws = new WebSocket('ws://localhost:3000/test');
// 响应onmessage事件:
ws.onmessage = function(msg) { console.log(msg); };
// 给服务器发送一个字符串:
ws.onopen= function(){ws.send('Hello!');}; 

// 浏览器控制台输出的结果为
// MessageEvent {isTrusted: true, data: "ECHO: Hello!", origin: "ws://localhost:3000", lastEventId: "", source: null, …}