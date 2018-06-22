# 目录

- 概述
- createReadStream
- createWriteStream
- pipe

# 1、概述

`stream` 是 Node.js 提供的又一个仅在服务区端可用的模块，目的是支持“流”这种数据结构。

什么是流？流是一种抽象的数据结构。想象水流，当在水管中流动时，就可以从某个地方（例如自来水厂）源源不断地到达另一个地方（比如你家的洗手池）。我们也可以把数据看成是数据流，比如你敲键盘的时候，就可以把每个字符依次连起来，看成字符流。这个流是从键盘输入到应用程序，实际上它还对应着一个名字：标准输入流（stdin）。

如果应用程序把字符一个一个输出到显示器上，这也可以看成是一个流，这个流也有名字：标准输出流（stdout）。流的特点是数据是有序的，而且必须依次读取，或者依次写入，不能像Array那样随机定位。

有些流用来读取数据，比如从文件读取数据时，可以打开一个文件流，然后从文件流中不断地读取数据。有些流用来写入数据，比如向文件写入数据时，只需要把数据不断地往文件流中写进去就可以了。

在Node.js中，流也是一个对象，我们只需要响应流的事件就可以了：`data` 事件表示流的数据已经可以读取了，`end` 事件表示这个流已经到末尾了，没有数据可以读取了，`error` 事件表示出错了。

# 2、createReadStream

从文件流读取文本内容的示例：

```js
const fs = require('fs');

// 打开一个流
let rs = fs.createReadStream('./assets/sample.txt', 'utf-8');

rs.on('data', chunk => {
  console.log('Data:');
  console.log(chunk);
});

rs.on('end', () => {
  console.log('END');
});

rs.on('error', err => {
  console.log('ERROR:' + err);
});

/** 
 * 输出结果：
  Data:
  Node.js内置的fs模块就是文件系统模块，负责读写文件。
  END
 */
```

要注意，`data` 事件可能会有多次，每次传递的 `chunk` 是流的一部分数据。

# 3、createWriteStream

要以流的形式写入文件，只需要不断调用 ``write()` 方法，最后以`end()` 结束：

```js
// 写入流
 let ws1 = fs.createWriteStream('./assets/output1.txt', 'utf-8');
 ws1.write('使用Stream写入文本数据...\n');
 ws1.write('END.');
 ws1.end();

let ws2 = fs.createWriteStream('./assets/output2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();
```

# 4、pipe

就像可以把两个水管串成一个更长的水管一样，两个流也可以串起来。一个 `Readable`流和一个 `Writable` 流串起来后，所有的数据自动从 `Readable` 流进入 `Writable` 流，这种操作叫 `pipe`。

在Node.js中，`Readable` 流有一个 `pipe()` 方法，就是用来干这件事的。

让我们用 `pipe()` 把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，所以，这实际上是一个复制文件的程序：

```js
let rs = fs.createReadStream('sample.txt');
let ws = fs.createWriteStream('./assets/copied.txt');
rs.pipe(ws);

let rs3 = fs.createReadStream('./assets/demo.jpg');
let ws3 = fs.createWriteStream('./assets/a.png');
rs3.pipe(ws3);
```

默认情况下，当 `Readable` 流的数据读取完毕，`end` 事件触发后，将自动关闭 `Writable` 流。如果我们不希望自动关闭 `Writable` 流，需要传入参数：

```js
readable.pipe(writable, { end: false });
```