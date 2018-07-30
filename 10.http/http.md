# 目录

- 概述
- http 服务端
- http 客户端

# 1、概述

我们知道传统的 HTTP 服务器是由 `Aphche` 、 `Nginx` 、 `IIS` 之类的软件来搭建的，但是 `Nodejs` 并不需要， `Nodejs` 提供了 `http` 模块，自身就可以用来构建服务器。`http` 模块内部封装了高效的 `http` 服务器 和 `http` 客户端。 

`http` 模块提供两种使用方式：

- 作为服务端使用时，创建一个 HTTP 服务器，监听 HTTP 客户端请求并返回响应。

- 作为客户端使用时，发起一个 HTTP 客户端请求，获取服务端响应。

# 2、http 服务器

## 2.1 创建 http 服务器

一般是通过 `http.createServer()` 方法来创建一个 `http` 服务器，代码很简单，就那么几行就能实现：

```js
const http = require('http');
http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text-plain'});
    response.end('hello world');
}).listen(3000);
```

上述代码创建了一个服务器，监听了 3000 端口，访问 `localhost: 3000` ，返回的信息是 `hello world`。


## 2.2 请求信息 request 对象

继承于 `http.IncomingMessag` 类，是 `http.server()` 类的 `request` 事件的第一个参数，也即是 `http.createServer(req, res)` 的第一个参数。

HTTP请求本质上是一个数据流，由请求头（headers）和请求体（body）组成。例如以下是一个完整的HTTP请求数据内容。

```
POST / HTTP/1.1
User-Agent: curl/7.26.0
Host: localhost
Accept: */*
Content-Length: 11
Content-Type: application/x-www-form-urlencoded

Hello World
```

可以看到，空行之上是请求头，之下是请求体。HTTP 请求在发送给服务器时，可以认为是按照从头到尾的顺序一个字节一个字节地以数据流方式发送的。而 http 模块创建的 HTTP 服务器在接收到完整的请求头后，就会调用回调函数。

请求对象 resquest 包含有重要的信息：HTTP 版本，请求方法，请求地址，请求头部。

```js
http.createServer((req, res) => {
    console.log('1.请求url：' + req.url);
    console.log('2.请求方法：' + req.method);
    console.log('3.HTTP 版本：' + req.httpVersion);
    console.log('4.请求头：' + JSON.stringify(req.headers));
    res.end('ok');
}).listen(3000);
```

在浏览器中打开 localhost: 3000 地址后，会输出一下内容：

```
1.请 url：/
2.请求方法：GET
3.HTTP 版本：1.1
4.请求头：{"host":"localhost:3000","connection":"keep-alive","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-encoding":"gzip, deflate, br","accept-language":"zh-CN,zh;q=0.9,en;q=0.8","cookie":"_ga=GA1.1.1633526998.1530877254; ___rl__test__cookies=1532081765522"}
```

## 2.3 响应信息 response 对象

继承于 `http.ServerResponse` 类，是 `http.server()` 类的 `request` 事件的第二个参数，也即是 `http.createServer(req, res)` 的第二个参数。

HTTP 响应本质上也是一个数据流，同样由响应头（headers）和响应体（body）组成。例如以下是一个完整的HTTP请求数据内容。

```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 11
Date: Tue, 05 Nov 2013 05:31:38 GMT
Connection: keep-alive

Hello World
```

返回信息对象的内容包括：状态代码/状态描述信息、响应头部、响应主体。

### 2.3.1 设置状态代码、状态描述信息

res 提供了 `res.writeHead()`、`res.statusCode`/`res.statusMessage` 来实现这个目的。

举例，如果想要设置 `200/ok` ，可以

```js
res.writeHead(200, 'ok');
```

也可以

```js
res.stateStatus = 200;
res.statusMessage = 'ok';
```

两者差不多，差异点在于: 

1. `res.writeHead()` 可以提供额外的功能，比如设置响应头部。
2. 当响应头部发送出去后，`res.statusCode/res.statusMessage` 会被设置成已发送出去的 状态代码/状态描述信息。

### 2.3.2 设置响应头部

res 提供了 `res.writeHead()`、`response.setHeader()` 来实现响应头部的设置。

举例，比如想把 `Content-Type` 设置为 `text-plain`，那么可以

```js
// 方法一
res.writeHead(200, 'ok', {
    'Content-Type': 'text-plain'
});

// 方法二
res.setHeader('Content-Type', 'text-plain');
```

两者的差异点在哪里呢？

1. `res.writeHead()` 不单单是设置 `header`。
2. 已经通过 `res.setHeader()` 设置了 `header`，当通过 `res.writeHead()` 设置同名header，`res.writeHead()` 的设置会覆盖之前的设置。

### 2.3.3 设置响应主体

主要用到 `res.write()` 以及 `res.end()` 两个方法。

> response.write(chunk[, encoding][, callback])

- `chunk`：响应主体的内容，可以是 `string`，也可以是 `buffer` 。当为 `string` `时，encoding` 参数用来指明编码方式。（默认是 `utf8` ）
- `encoding`：编码方式，默认是 `utf8`。
- `callback`：

> response.end([data][, encoding][, callback])

该方法会通知服务器，所有响应头和响应主体都已被发送，即服务器将其视为已完成。 每次响应都必须调用 `response.end()` 方法。

如果指定了 `data`，则相当于调用 `response.write(data, encoding)` 之后再调用 `response.end(callback)`。

如果指定了 `callback`，则当响应流结束时被调用。

## 2.4 获取 GET/POST 请求的内容

### 2.4.1 获取 GET 请求的内容

```js
const http = require('http');
const url = require('url');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(JSON.stringify(url.parse(req.url)));
}).listen(3000);
```

在浏览器中打开：http://localhost:3000/user?name=tom&age=15， 返回的结果如下所示：

```js
{
    "protocol":null,
    "slashes":null,
    "auth":null,
    "host":null,
    "port":null,
    "hostname":null,
    "hash":null,
    "search":"?name=tom&age=15",
    "query":"name=tom&age=15",
    "pathname":"/user",
    "path":"/user?name=tom&age=15",
    "href":"/user?name=tom&age=15"
}
```

其中，`query` 是 `GET` 请求的参数，因为 `GET` 请求是没有请求体的，参数都是拼接在 `url` 后面的：

```js
const http = require('http');
const url = require('url');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let queryObj = url.parse(req.url, true).query;
    res.end(JSON.stringify(queryObj));
}).listen(3000);
```

在浏览器中打开：http://localhost:3000/user?name=tom&age=15， 返回的结果如下所示：

```js
{"name":"tom","age":"15"}
```

### 2.4.2 获取 POST 请求的内容

`POST` 请求的内容全部的都在请求体中，`http.ServerRequest` 并没有一个属性内容为请求体，原因是等待请求体传输可能是一件耗时的工作。

比如上传文件，而很多时候我们可能并不需要理会请求体的内容，恶意的 `POST` 请求会大大消耗服务器的资源，所以 node.js 默认是不会解析请求体的，当你需要的时候，需要手动来做。

```js
const http = require('http');

http.createServer(function (request, response) {
    var body = [];

    request.on('data', function (chunk) {
        body.push(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
}).listen(80);
```

# 3、http 客户端

`http` 模块提供了 `http.request()` 和 `http.get()` 两个方法，功能是作为客户端向 `http` 服务器发起请求。

## 3.1 http.request()

首先来看 `http.request()` ，`http.request()` 返回一个 `http.ClientRequest` 类的实例。

> http.request(options[, callback])

- `options` 可以是一个对象、或字符串、或 `URL` 对象。 如果 `options` 是一个字符串，它会被自动使用 `url.parse()` 解析。 如果它是一个 `URL` 对象, 它会被默认转换成一个 `options` 对象。
- 可选的 `callback` 参数会作为单次监听器被添加到 `'response'` 事件。

官网上面的例子：

```js
const postData = querystring.stringify({
  'msg' : 'Hello World!'
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`响应主体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应中已无数据。');
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入数据到请求主体
req.write(postData);
req.end();
```

注意，在例子中调用了 `req.end()`。 **使用 `http.request()` 必须总是调用 `req.end()` 来表明请求的结束，即使没有数据被写入请求主体。**

## 3.2 http.get()

> http.get(options[, callback])

`http.get()` 方法是 `http.request()` 方法的便捷方法。因为大多数请求都是 GET 请求且不带请求主体，所以 Node.js 提供了该便捷方法。

**该方法与 `http.request()` 唯一的区别是它设置请求方法为 `GET` 且自动调用 `req.end()`。**

```js
http.get('http://nodejs.org/dist/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('请求失败。\n' +
                      `状态码: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('无效的 content-type.\n' +
                      `期望 application/json 但获取的是 ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // 消耗响应数据以释放内存
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`错误: ${e.message}`);
});
```

其实 `http` 服务端和 `http` 客户端均有很多事件，但是因为太杂，就不展开去说了。对于 `http` 服务端，最重要的事件就是 `request` 事件，对于 http 客户端，最重要的事件是 `response` 事件。

# 参考资料

- [Node.js 官网文档：http 模块](http://nodejs.cn/api/http.html)
- [nodejs-learning-guide：http 模块](https://github.com/chyingp/nodejs-learning-guide/tree/master/%E6%A8%A1%E5%9D%97)
- [七天学会NodeJS：网络操作](https://nqdeng.github.io/7-days-nodejs/#4)
- [菜鸟教程：node.js GET/POST 请求](https://www.runoob.com/nodejs/node-js-get-post.html)