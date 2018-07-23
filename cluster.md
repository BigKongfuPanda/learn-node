# 目录

- 概述
- cluster 的属性和方法
- cluster 的事件
- worker 的属性和方法
- worker 的事件
- cluster 的实现原理

# 1、概述

Node.js 默认单进程运行，对于多核 CPU 的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置，面对单进程单线程对多核使用不足的问题，前人的经验是启动多进程。理想的状态下每个进程各自利用一个 CPU ，以此实现多核 CPU 的利用。

Master-Worker 模式：`cluster` 模块允许设立一个主进程和若干个 `worker` 进程，由主进程监控和协调 `worker` `进程的运行，worker` 之间采用进程间（IPC）通信交换信息，`cluster` 模块内置一个负载均衡器，协调各个进程之间的负载。这是典型的分布式架构中用于并行处理业务的模式，具备较好的可伸缩性和稳定性。主进程不负责具体的业务处理，而是负责调度或管理工作进程，他是趋向于稳定为。工作进程负责具体的业务处理。

通过 `fork()` 复制的进程都是一个独立的进程，这个进程中有着独立的 V8 实例。 `fork()` 进程是昂贵的。Node 通过事件驱动的方式在单线程上解决了大并发的问题，启动多个进程只是为了充分将 CPU 资源利用起来，而不是为了解决并发问题。

# 2、cluster 的属性和方法

- `cluster.isMaster`：标志是否 `master` 进程，为 `true` 则是。

- `cluster.isWorker`：标志是否 `worker` 进程，为 `true` 则是。

- `cluster.worker`：获得当前的 `worker` 对象，在 `master` 进程中使用无效。

```js
const cluster = require('cluster');

if (cluster.isMaster) {
  console.log('I am master');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

- `cluster.workers`： 获得集群中所有存活的 `worker` 对象。在 `worker` 进程使用无效。

`cluster.workers` 输出后如下面所示，一个例子：

```js
{ '1':
   Worker {
     domain: null,
     _events: { message: [Function] },
     _eventsCount: 1,
     _maxListeners: undefined,
     exitedAfterDisconnect: undefined,
     suicide: [Getter/Setter],
     state: 'none',
     id: 1,
     process:
      ChildProcess {
        domain: null,
        _events: [Object],
        _eventsCount: 5,
        _maxListeners: undefined,
        _closesNeeded: 2,
        _closesGot: 0,
        connected: true,
        signalCode: null,
        exitCode: null,
        killed: false,
        spawnfile: '/usr/local/bin/node',
        _handle: [Object],
        spawnargs: [Array],
        pid: 36921,
        stdin: null,
        stdout: null,
        stderr: null,
        stdio: [Array],
        channel: [Object],
        _channel: [Getter/Setter],
        _handleQueue: null,
        _pendingMessage: null,
        send: [Function],
        _send: [Function],
        disconnect: [Function],
        _disconnect: [Function] } },
  '2':
   Worker {
     domain: null,
     _events: { message: [Function] },
     _eventsCount: 1,
     _maxListeners: undefined,
     exitedAfterDisconnect: undefined,
     suicide: [Getter/Setter],
     state: 'none',
     id: 2,
     process:
      ChildProcess {
        domain: null,
        _events: [Object],
        _eventsCount: 5,
        _maxListeners: undefined,
        _closesNeeded: 2,
        _closesGot: 0,
        connected: true,
        signalCode: null,
        exitCode: null,
        killed: false,
        spawnfile: '/usr/local/bin/node',
        _handle: [Object],
        spawnargs: [Array],
        pid: 36922,
        stdin: null,
        stdout: null,
        stderr: null,
        stdio: [Array],
        channel: [Object],
        _channel: [Getter/Setter],
        _handleQueue: null,
        _pendingMessage: null,
        send: [Function],
        _send: [Function],
        disconnect: [Function],
        _disconnect: [Function] } },
  '3':
   Worker {
     domain: null,
     _events: { message: [Function] },
     _eventsCount: 1,
     _maxListeners: undefined,
     exitedAfterDisconnect: undefined,
     suicide: [Getter/Setter],
     state: 'none',
     id: 3,
     process:
      ChildProcess {
        domain: null,
        _events: [Object],
        _eventsCount: 5,
        _maxListeners: undefined,
        _closesNeeded: 2,
        _closesGot: 0,
        connected: true,
        signalCode: null,
        exitCode: null,
        killed: false,
        spawnfile: '/usr/local/bin/node',
        _handle: [Object],
        spawnargs: [Array],
        pid: 36923,
        stdin: null,
        stdout: null,
        stderr: null,
        stdio: [Array],
        channel: [Object],
        _channel: [Getter/Setter],
        _handleQueue: null,
        _pendingMessage: null,
        send: [Function],
        _send: [Function],
        disconnect: [Function],
        _disconnect: [Function] } },
  '4':
   Worker {
     domain: null,
     _events: { message: [Function] },
     _eventsCount: 1,
     _maxListeners: undefined,
     exitedAfterDisconnect: undefined,
     suicide: [Getter/Setter],
     state: 'none',
     id: 4,
     process:
      ChildProcess {
        domain: null,
        _events: [Object],
        _eventsCount: 5,
        _maxListeners: undefined,
        _closesNeeded: 2,
        _closesGot: 0,
        connected: true,
        signalCode: null,
        exitCode: null,
        killed: false,
        spawnfile: '/usr/local/bin/node',
        _handle: [Object],
        spawnargs: [Array],
        pid: 36924,
        stdin: null,
        stdout: null,
        stderr: null,
        stdio: [Array],
        channel: [Object],
        _channel: [Getter/Setter],
        _handleQueue: null,
        _pendingMessage: null,
        send: [Function],
        _send: [Function],
        disconnect: [Function],
        _disconnect: [Function] } } }
```

- `cluster.fork()`： 创建工作进程 `worker` 。

- `cluster.disconnect([callback])`： 断开所有 `worker` 进程通信。这个方法可以选择添加一个回调参数，当结束时会调用这个回调函数。这个方法只能由主进程调用。

# 3、cluster 的事件

- `fork`： 监听创建 `worker` 进程事件
- `online`： 监听 `worker` 创建成功事件
- `listening`： 监听 `worker` 进程进入监听事件
- `disconnect`： 监听 `worker` 断开事件
- `exit`： 监听 `worker` 退出事件
- `message`：监听 `worker` 进程发送消息事件

## 3.1 fork 事件

当新的工作进程被 `fork` 时， `cluster` 模块将触发 `'fork'` 事件。

```js
cluster.on('fork', (worker) => {
    console.log(worker.id);
});
```

## 3.2 online 事件

当新建一个工作进程后，工作进程应当响应一个 `online` 消息给主进程。当主进程收到 `online` 消息后触发这个事件。 `'fork'` 事件和 `'online'` 事件的不同之处在于，前者是在主进程新建工作进程后触发，而后者是在工作进程运行的时候触发。

```js
cluster.on('online', (worker) => {
  console.log('Yay, the worker responded after it was forked');
});
```

## 3.3 listening 事件

当一个工作进程调用 `listen()` 后，工作进程上的 `server` 会触发 `'listening'` 事件，同时主进程上的 `cluster` 也会被触发 `'listening'` 事件。

事件处理器使用两个参数来执行，其中 `worker` 包含了工作进程对象， `address` 包含了以下连接属性： `address`、 `port` 和 `addressType`。当工作进程同时监听多个地址时，这些参数非常有用。

```js
cluster.on('listening', (worker, address) => {
  console.log(
    `A worker is now connected to ${address.address}:${address.port}`);
});
```

## 3.4 disconnect 事件

在工作进程的 IPC 管道被断开后触发本事件。可能导致事件触发的原因包括：工作进程优雅地退出、被 `kill` 或手动断开连接（如调用`worker.disconnect()`)。

```js
cluster.on('disconnect', (worker) => {
  console.log(`The worker #${worker.id} has disconnected`);
});
```

## 3.5 exit 事件

当任何一个工作进程关闭的时候，`cluster` 模块都将触发 `'exit'` 事件。可以被用来重启工作进程（通过调用.fork()）。

```js
cluster.on('exit', (worker, code, signal) => {
    console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
    cluster.fork();
});
```

## 3.6 message 事件

当 `cluster` 主进程接收任意工作进程发送的消息后被触发。

在Node.js v6.0版本之前，这个事件仅仅接受两个参数：消息和handle，而没有工作进程对象 `worker`。

```js
cluster.on('message', (worker, message, handle) => {
  if (arguments.length === 2) {
    handle = message;
    message = worker;
    worker = undefined;
  }
  // ...
});
```

实例代码：

```js
const cluster = require('cluster');
const http = require('http');
const cpuNums = require('os').cpus().length;
/*process.env.NODE_DEBUG='net';*/
if (cluster.isMaster) {
    for (let i = 0; i < cpuNums; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker${worker.id} exit.`)
    });
    cluster.on('fork', (worker) => {
        console.log(`fork：worker${worker.id}`)
    });

    cluster.on('disconnect', (worker) => {
        console.log(`worker${worker.id} is disconnected.`)
    });
    cluster.on('listening', (worker, addr) => {
        console.log(`worker${worker.id} listening on ${addr.address}:${addr.port}`)
    });
    cluster.on('online', (worker) => {
        console.log(`worker${worker.id} is online now`)
    });

    cluster.on('message', (worker, msg) => {
        console.log(`got the worker${worker.id}'s msg：${msg}`);
    });

    Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].send(`hello worker${id}`);
    });
} else {
    process.on('message', (msg) => {
        console.log('worker' + cluster.worker.id + ' got the master msg：' + msg);
    });
    process.send('hello master, I am worker' + cluster.worker.id);
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world' + cluster.worker.id);
    }).listen(3000, '127.0.0.1');
}
```

输出结果：

```
fork：worker1
fork：worker2
fork：worker3
fork：worker4
worker1 is online now
got the worker1's msg：hello master, I am worker1
worker4 is online now
worker2 is online now
worker3 is online now
worker1 got the master msg：hello worker1
worker1 listening on 127.0.0.1:3000
got the worker4's msg：hello master, I am worker4
got the worker3's msg：hello master, I am worker3
got the worker2's msg：hello master, I am worker2
worker4 got the master msg：hello worker4
worker4 listening on 127.0.0.1:3000
worker2 got the master msg：hello worker2
worker3 got the master msg：hello worker3
worker2 listening on 127.0.0.1:3000
worker3 listening on 127.0.0.1:3000
```

# 4、worker 的属性和方法

在一个主进程中使用 `cluster.workers` 来获取 `worker` 对象；在一个工作进程中，使用 `cluster.worker` 来获取 `worker` 对象。

- `id` 属性，返回当前 `worker` 的 进程编号。
- `process` 属性，返回 `worker` 所在的进程对象。所有的工作进程都是通过 `child_process.fork()` 来创建的，这个方法返回的对象被存储为 `.process` 。在工作进程中， `process` 属于全局对象。
- `send()` 方法，发送一个消息给工作进程或者主进程，参数 `message` 、`callback`。

```js
//这个例子里面，工作进程将主进程发送的消息echo回去。
if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

- `disconnect()` 方法，在一个工作进程中，调用此方法会关闭所有 `server`，并等待这些 `server` 的 `close` 事件执行，然后关闭 IPC 管道。
- `isConnected()` 方法，返回是否链接到主进程。
- `isDead()` 方法，返回工作进程是否被终止。
- `kill([signal])` 方法，`kill` 工作进程。

代码示例：

```js
// 主进程文件 index.js
const os = require('os');
const cluster = require('cluster');

// isMaster 是不是主进程
console.log(cluster.isMaster); // true

// 是不是 worker 工作进程
console.log(cluster.isWorker); // false

// setupMaster 修改 fork 默认行为
cluster.setupMaster({
    exec: 'worker.js' // worker 进程之行文件的路径
})

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        // fork 衍生 worker 子进程
        cluster.fork();
    }
    // workers 活跃的进程
    console.log(cluster.workers);

    cluster.on('fork', function (worker) {
        console.log('fork = ' + worker.id)
    })

    cluster.on('listening', function (worker, address) {
        console.log('worker ' + worker.id + ' listen ' + address.address + ':' + address.port);
    })

    cluster.on('online', function (worker) {
        console.log('worker ' + worker.id + ' online');
    })

    cluster.on('disconnect', function (worker) {
        console.log('disconnected worker ' + worker.id);
    })

    cluster.on('exit', function (worker, code, signal) {
        console.log('exit ' + worker.id + ' code = ' + code + ' signal ' + signal);
    })

    cluster.on('setup', function () {
        console.log('have setup');
    })

    cluster.on('message', function (worker, message, handle) {
        console.log('got message from ' + worker.id + ' message ' + message);

        worker.id === 2 && setTimeout(function () {
            worker.send('disconnect');
        }, 1000)

        worker.id === 3 && setTimeout(function () {
            worker.send('kill');
        }, 1000)
    })
}
```

# 5、worker 的事件

- `listening` 和 `cluster.on('listening')` 事件类似，但针对特定的工作进程。
- `online` 和 `cluster.on('online')` 事件类似，但针对特定的工作进程。
- `disconnect` 事件，主进程和工作进程之间 IPC 通道断开后触发。
- `exit` 事件，当前工作进程退出时触发，回调参数 `code` 退出码、`signal` 进程被 `kill` 时的信号。
- `message` 事件，当前进程接收主进程发送的消息后触发，`message` 消息，`handle` 处理，旧版本没有 `worker` 参数。
- `error` 事件，此事件和 `child_process.fork()` 提供的 `error` 事件相同。

示例代码：

```js
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
```


# 6、cluster 的实现原理

如上代码所示，`master` 是控制进程，`worker` 是执行进程，每个 `worker` 都是使用 `child_process.fork()` 函数创建的，因此 `worker` 与 `master` 之间通过 IPC 进行通信。

当 `worker` 调用用 `server.listen()` 方法时会向 `master` 进程发送一个消息，让它创建一个服务器 `socket` ，做好监听并分享给该 `worker` 。如果 `master` 已经有监听好的 `socket`，就跳过创建和监听的过程，直接分享。换句话说，所有的 `worker` 监听的都是同一个 `socket`，当有新连接进来的时候，由负载均衡算法选出一个 `worker` 进行处理。

但是，在 Node.js 中，已经有 `child_process` 模块，让开发者得以开多个进程，实现每个进程各自利用一个 CPU，以实现多核的利用。

`child_process` 模块给予 Node.js 可以随意创建子进程的能力。因为 `child_process` 类本身是一个 `EventEmitter`，所以进程间通信很容易；且父子进程间通信并不通过网络层，而是在内核中完成，高效。

那为什么还需要 `cluster` 模块呢？岂不是多此一举吗？

但 `child_process` 对于开发者来说，编程模型还是过于复杂，需要操心的细节过多，比如：父进程崩溃了，子进程回收是需要开发者提供代码来处理的——如果开发者只是想单纯利用多核模型，对具体工作进程的控制粒度并没有太多设想，那这种开发模型无疑是令人头疼的。

针对这个问题，Node.js 提供了 `cluster` 模块。`cluster` 简化了父子模型编程模型，只区分：当前进程是不是 `Master`，是 `Master` 就可以 `fork` 子进程，不是那就请行使 `Worker` 职责。至于什么资源的回收，负载的调配，`uncaughtException` 的处理，它自有安排。

本质上， `Cluster` 是 `child_process` 和 `net` 模块的组合应用。它不仅简化了编程模型，还使得共享监听同一端口成为可能。

# 参考资料

[Node.js 官方文档：cluster 集群](http://nodejs.cn/api/cluster.html)

[node.js-learning-guide: cluster 模块](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/cluster.md)

[nodeJS - 8 - process进程 child_process子进程 Cluster 集群](https://blog.csdn.net/mjzhang1993/article/details/78626316)

[Cluster，把多核用起来](https://www.2cto.com/kf/201409/334715.html)
