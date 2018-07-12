// 工作进程文件 worker.js
const cluster = require('cluster');
const http = require('http');

// cluster.worker 当前子进程
const worker = cluster.worker;

// id 进程编号
console.log('in worker id', worker.id);

// process worker 所在的进程对象
// console.log('in worker process', worker.process);

// isConnected 是否链接到主进程
console.log('worker ' + worker.id + ' connected ' + worker.isConnected());

// send 发送消息
worker.send('first message', function () {
    console.log('first message callback');
})

worker.on('disconnect', function () {
    console.log('worker ' + worker.id + ' disconnect in');
})

worker.on('error', function (err) {
    console.log('worker ' + worker.id + ' error', err);
})

worker.on('exit', function (code, signal) {
    console.log('worker ' + worker.id + ' exit ');
})

worker.on('listening', function (address) {
    console.log('worker ' + worker.id + ' listerner', address);
})

worker.on('message', function (msg) {
    if (msg === 'disconnect') {
        // disconnect 断开链接
        worker.disconnect();

        // 当前进程是否存在
        console.log('worker is dead ' + worker.isDead());
    }
    if (msg === 'kill') {
        // kill 结束进程
        worker.kill();
    }
})

http.createServer(function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8000, '10.15.32.49');