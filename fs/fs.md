# 目录

- 概述
- 异步读取文件
- 同步读取文件
- 写文件
- stat
- 文件是否存在
- 创建目录
- 删除文件
- 读取目录
- 文件重命名
- 监听文件修改
- 追加文件内容
- 文件内容截取

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

```js
const fs = require('fs');

fs.stat('./assets/sample.txt', (err, stat) => {
  if (err) {
    console.log(err);
  } else {
    // 是否是文件：
    console.log('isFile: ' + stat.isFile());
    // 是否是目录：
    console.log('isDirectory: ' + stat.isDirectory());
    if (stat.isFile()) {
      // 文件大小：
      console.log('size: ' + stat.size);
      // 创建时间，Date对象：
      console.log('birth time: ' + stat.birthtime);
      // 修改时间，Date对象：
      console.log('modified time: ' + stat.mtime);
    }
  }
});
```

运行结果如下： 

```js
isFile: true
isDirectory: false
size: 72
birth time: Fri Jun 22 2018 11:39:17 GMT+0800 (CST)
modified time: Fri Jun 22 2018 14:27:53 GMT+0800 (CST)
```

# 6、文件是否存在

`fs.exists()` 已经是 `deprecated` 的状态，可以通过 `fs.access()` 方法来判断文件是否存在。

```js
const fs = require('fs);

fs.access('./assets/sample.txt', function(err) {
  if(err) throw err;
  console.log('sample.txt存在');
});
```

`fs.access()` 除了判断文件是否存在（默认模式），还可以用来判断文件的权限。

# 7、创建目录

异步版本，如果目录存在，会报错

```js
const fs = require('fs);

fs.mkdir('./assets/mkdir.txt', function(err){
  if(err) throw err;
  console.log('目录创建成功');
});
```

同步版本

```js
const fs = require('fs');

fs.mkdirSync('./assets/mkdir.txt');
```

# 8、删除文件

删除文件使用 `fs.unlink()` 方法。

```js
fs.unlink('./assets/mkdir.txt', function(err){
  if(err) throw err;
  console.log('删除文件成功');
})

fs.unlinkSync('./assets/mkdir.txt');
```

但是删除文件需要权限，如果没有权限的话，会报错。

# 9、读取目录

使用 `fs.readDirSync()` 和 `fs.readDir()` 方法可以读取目录。注意：`fs.readdirSync()`只会读一层，所以需要判断文件类型是否目录，如果是，则进行递归遍历。

```js
const fs = require('fs');
const path = require('path');

const getFileInDir = function(dir){
  let results = [];
  let files = fs.readdirSync(dir, 'utf8');

  files.forEach(function(file){
    file = path.resolve(dir, file);

    let stats = fs.statSync(file);
    if (stats.isFile()) {
      results.push(file);
    } else if (stats.isDirectory()){
      results = results.concat(getFileInDir(file));
    }
  });
  return results;
};

let files = getFileInDir('../');
console.log(files);
```

# 10、文件重命名

使用 fs.rename() 方法可以对文件进行重命名。

```js
// fs.rename(oldPath, newPath, callback)
const fs = require('fs');

// 同步
fs.renameSync('./assets/mkdir.txt', './assets/mkdir1.txt');

// 异步
fs.rename('', '', function(err){
  if(err) throw err;
  console.log('重命名成功');
});
```

# 11、监听文件修改

监听文件的方法有两个：`fs.watchFile()` 和 `fs.wath()`。

注意：`fs.watch` 比 `fs.watchFile` 和 `fs.unwatchFile` 更高效。 可能的话，应该使用 `fs.watch` 而不是 `fs.watchFile` 和 `fs.unwatchFile`。

## fs.watch

回调中提供的 `filename` 参数仅在 Linux、macOS、Windows、以及 AIX 系统上支持。 即使在支持的平台中，`filename` 也不能保证提供。 因此，不要以为 `filename` 参数总是在回调中提供，如果它是空的，需要有一定的后备逻辑。

```js
fs.watch('./assets/mkdir1.txt', (eventType, filename) => {
  console.log(`事件类型是：${eventType}`);
  if (filename) {
    console.log(`提供的文件名: ${filename}`);
  } else {
    console.log('未提供文件名');
  }
});
```

## fs.watchFile

回调函数中有两个参数，当前的状态对象和以前的状态对象：

```js
fs.watchFile('./assets/mkdir.txt', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});

// the current mtime is: Tue Jun 26 2018 17:56:37 GMT+0800 (CST)
// the previous mtime was: Tue Jun 26 2018 17:55:32 GMT+0800 (CST)
```

这里的状态对象是 `fs.Stat` 实例。

## 可用性

`fs.watch()` 这个接口并不是在所有的平台行为都一致，并且在某些情况下是不可用的。

例如，当使用虚拟化软件如 Vagrant、Docker 等时，在网络文件系统（NFS、SMB 等）或主文件系统中监视文件或目录可能是不可靠的。

您仍然可以使用基于 `stat` 轮询的 `fs.watchFile()` ，但是这种方法更慢，可靠性也更低。

总之，虽然 `fs.watch()` 比 `fs.watchFile()` 更高效，但是 `fs.watch()` 的可用性不如 `fs.watchFile()`。

# 12、追加文件内容

异步地追加数据到一个文件，如果文件不存在则创建文件。 data 可以是一个字符串或 Buffer。

```js
fs.appendFile('./assets/mkdir.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```

如果 `options` 是一个字符串，则它指定了字符编码。例如：

```js
fs.appendFile('./assets/mkdir.txt', 'data to append', 'utf8', callback);
```

`file` 可能是一个被打开用来追加数据的数字文件描述符（通过 `fs.open()` 或者 `fs.openSync()`）。这样的文件描述符将不会被自动关闭，需要手动关闭。

```js

```