# 目录

- 概述
- 异步读取文件
- 同步读取文件
- 写文件
- stat

# 1、概述

Node.js 内置的 `fs` 模块就是文件系统模块，负责读写文件，提供了异步和同步的方法。

# 2、异步读取文件

## 2.1 异步读取文本文件

```js
const fs = require('fs');

// 读取文本文件
fs.readFile('sample.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    //sample.txt 里面的内容
  }
});
```

异步读取时，传入的回调函数接收两个参数，当正常读取时，`err` 参数为 `null`，`data`参数为读取到的 `String`。当读取发生错误时，`err` 参数代表一个错误对象，`data` 为 `undefined`。这也是 Node.js 标准的回调函数：第一个参数代表错误信息，第二个参数代表结果。

由于 `err` 是否为 `null` 就是判断是否出错的标志，所以通常的判断逻辑总是：

```js
if (err) {
    // 出错了
} else {
    // 正常
}
```

## 2.2 异步读取二进制文件

图片文件就是二进制文件的一种。

```js
const fs = require('fs');

// 读取二进制文件
fs.readFile('demo.jpg', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    // <Buffer ff d8 ff e1 00 18 45 78 69 66 00 00 49 49 2a 00 08 00 00 00 00 00 00 00 00 00 00 00 ff ec 00 11 44 75 63 6b 79 00 01 00 04 00 00 00 32 00 00 ff e1 03 ... >
    console.log(data.length + 'bytes');
    // 302017bytes
  }
});
```

当读取二进制文件时，不传入文件编码时，回调函数的 `data` 参数将返回一个 `Buffer` 对象。在 Node.js 中，`Buffer` 对象就是一个包含零个或任意个字节的数组（注意和Array不同）。

`Buffer` 对象可以和 `String` 作转换，例如，把一个 `Buffer` 对象转换成 `String`：

```js
// Buffer -> String
let text = data.toString('utf-8');
```

或者把一个 `String` 转换成 `Buffer` ：

```js
// String -> Buffer
let buf = Buffer.from(text, 'utf-8');
```

# 3、同步读取文件

除了标准的异步读取模式外，`fs` 也提供相应的同步读取函数。同步读取的函数和异步函数相比，多了一个 `Sync` 后缀，并且不接收回调函数，函数直接返回结果。

```js
const fs = require('fs);
let data = fs.readFileSync('sample.txt', 'utf-8');
```

可见，原异步调用的回调函数的 `data` 被函数直接返回，函数名需要改为 `readFileSync`，其它参数不变。

如果同步读取文件发生错误，则需要用 `try...catch` 捕获该错误：

```js
const fs = require('fs);

try {
  let data = fs.readFileSync('sample.txt', 'utf-8');
} catch (err) {
  // 出错了
}
```

# 4、写文件

将数据写入文件是通过 `fs.writeFile()` 实现的：

```js
const fs = require('fs');

let data = 'Hello, Node.js';

fs.writeFile('output.txt', data, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('ok');
  }
});
```

和 `readFile()` 类似，`writeFile()` 也有一个同步方法，叫 `writeFileSync()`：

```js
const fs = require('fs');

let data = 'Hello, Node.js';

fs.writeFileSync('output.txt', data);
```

# 5、stat

如果我们要获取文件大小，创建时间等信息，可以使用 `fs.stat()`，它返回一个 `Stat` 对象，能告诉我们文件或目录的详细信息：

