# 目录

- 概述
- 创建 Buffer 实例
- 判断数据是否为 buffer
- 判断两个 buffer 是否相等
- 写入 buffer: buf.write()
- 读取 buffer: buf.toString()
- 拷贝 buffer: buf.copy()
- 合并 buffer: buf.cancat()
- 切割 buffer: buf.slice()
- 将 buffer 转为 JSON 对象: buf.toJSON()

# 1、概述

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 `Buffer` 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，`Buffer` 类是随 Node 内核一起发布的核心库。`Buffer` 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 `Buffer` 库。原始数据存储在 `Buffer` 类的实例中。一个 `Buffer` 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

# 2、创建 Buffer 实例

创建 `Buffer` 实例有多种办法，但是 v8.0 之后，官方已经不推荐使用 new Buffer() 方法了。可以正常使用的方法有：

- Buffer.alloc(size[, fill[, encoding]])：返回一个指定大小的 `Buffer` 实例，如果没有设置 `fill`，则默认填满 0。
- Buffer.allocUnsafe(size)：返回一个指定大小的 `Buffer` 实例，但是它不会被初始化，所以它可能包含敏感的数据。
- Buffer.allocUnsafeSlow(size)：
- Buffer.from()

## 2.1. Buffer.alloc(size[, fill[, encoding]])

分配一个大小为 size 字节的新建的 `Buffer` 。 如果 `fill` 为 `undefined` ，则该 `Buffer` 会用 0 填充。

参数说明：

- size： 新建的 Buffer 期望的长度, 如果 size 不是一个数值，则抛出 `TypeError` 错误。
- fill： 用来预填充新建的 Buffer 的值。 默认: 0
- encoding： 如果 fill 是字符串，则该值是它的字符编码。 默认: `utf8`

```js
// 创建一个长度为5,且用0填充的Buffer
const buf1 = Buffer.alloc(5);
// 创建一个长度为5，且用a来填充的buffer
const buf2 = Buffer.alloc(5, 'a');

console.log(buf1);
console.log(buf2);

// 输出: <Buffer 00 00 00 00 00>
// 输出: <Buffer 61 61 61 61 61>
```

注意：调用 `Buffer.alloc()` 会明显地比另一个方法 `Buffer.allocUnsafe()` 慢，但是能确保新建的 `Buffer` 实例的内容**不会包含敏感数据**。这是因为 `Buffer.alloc()` 会进行预先的填充，而 `Buffer.allocUnsafe()` 不会预先填充，不进行预先填充的话，可能分配到的内存空间中有之前的数据。

## 2.2 Buffer.allocUnsafe(size)

分配一个大小为 `size` 字节的新建的 `Buffer` 。 如果 `size` 大于 `buffer.constants.MAX_LENGTH` 或小于 0，则抛出 `[RangeError]` 错误。 如果 `size` 为 0，则创建一个长度为 0 的 `Buffer`。

以这种方式创建的 `Buffer` 实例的底层内存是未初始化的。 新创建的 `Buffer` 的内容是未知的，且可能包含敏感数据。 可以使用 `buf.fill(0)` 初始化 `Buffer` 实例为0。

```js
const buf = Buffer.allocUnsafe(10);

// 输出: (内容可能不同): <Buffer a0 8b 28 3f 01 00 00 00 50 32>
console.log(buf);

buf.fill(0);

// 输出: <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf);

```
`Buffer.alloc(size, fill)` 和 `Buffer.allocUnsafe(size).fill(fill)` 的区别：  

`Buffer.alloc(size, fill)` 永远不会使用内部的 `Buffer` 池，但如果 size 小于或等于 Buffer.poolSize 的一半， `Buffer.allocUnsafe(size).fill(fill)` 会使用这个内部的 `Buffer` 池。 当应用程序需要` Buffer.allocUnsafe()` 提供额外的性能时，这个细微的区别是非常重要的。

## 2.3 Buffer.allocUnsafeSlow(size)

与 `Buffer.allocUnsafe(size)` 方法类似，但是有细微差别，可以不用去深究。

## 2.4 Buffer.from()

`Buffer.from()` 方法可以传三种参数，分别为：`array`, `string`, `buffer`。

- `Buffer.from(array)`: 通过一个八位字节的 `array` 创建一个新的 `Buffer` 。
- `Buffer.from(string[, encoding])`: 新建一个包含所给的 JavaScript 字符串 `string` 的 `Buffer` 。 `encoding` 参数指定 `string` 的字符编码，默认为 `utf-8`。
- `Buffer.from(buffer)`: 将传入的 `buffer` 数据拷贝到一个新建的 `Buffer` 实例。

# 3、判断数据是否为 buffer

> Buffer.isBuffer(obj)

如果 `obj` 是一个 `Buffer` ，则返回 `true`，否则返回 `false`。

# 4、判断两个 buffer 是否相等

> buf.equals(otherBuffer)

如果 `buf` 与 `otherBuffer` 具有完全相同的字节，则返回 `true`，否则返回 `false`。

# 5、写入 buffer: buf.write()

> buf.write(string[, offset[, length]][, encoding])

参数说明：
- string: 要写入 `buf` 的字符串
- offset: 开始写入 `string` 前要跳过的字节数。默认：0
- length: 要写入的字节数。默认：buf.length - offset
- encoding: `string` 的字符编码。默认：'utf8'
- 返回值：写入的字节数

根据 `encoding` 的字符编码写入 `string` 到 `buf` 中的 `offset` 位置。 `length` 参数是写入的字节数。 如果 `buf` 没有足够的空间保存整个字符串，则只会写入 `string` 的一部分。 只部分解码的字符不会被写入。

# 6、读取 buffer: buf.toString()

> buf.toString([encoding[, start[, end]]])

参数说明：

- encoding: 解码使用的字符编码。默认：`utf8`
- start: 开始解码的字节偏移量。默认：0
- end： 结束解码的字节偏移量（不包含）。默认：`buf.length`
- 返回值：字符串

根据 `encoding` 指定的字符编码解码 `buf` 成一个字符串。 `start` 和 `end` 可传入用于只解码 `buf` 的一部分。

# 7、拷贝 buffer: buf.copy()

> buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])

拷贝 `buf` 的一个区域的数据到 `target` 的一个区域，即便 `target` 的内存区域与 `buf` 的重叠。

参数说明：

- target:  要拷贝进的 `Buffer` 或 `Uint8Array`
- targetStart: `target` 中开始拷贝进的偏移量。 默认: 0
- sourceStart: `buf` 中开始拷贝的偏移量。 默认: 0
- sourceEnd: `buf` 中结束拷贝的偏移量（不包含）。 默认: `buf.length`

例子：创建两个 Buffer 实例 buf1 与 buf2 ，并拷贝 buf1 中第 16 个至第 19 个字节到 buf2 第 8 个字节起。

```js
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值
  buf1[i] = i + 97;
}

buf1.copy(buf2, 8, 16, 20);

// 输出: !!!!!!!!qrst!!!!!!!!!!!!!
console.log(buf2.toString('ascii', 0, 25));
```

# 8、合并 buffer: Buffer.cancat()

> 类方法：Buffer.concat(list[, totalLength])

参数说明：

- list: 要合并的 `Buffer` 或 `Uint8Array` 实例的数组
- totalLength: 合并时 `list` 中 `Buffer` 实例的总长度

返回一个合并了 `list` 中所有 `Buffer` 实例的新建的 `Buffer` 。

例子：从一个包含三个 `Buffer` 实例的数组创建为一个单一的 `Buffer`。

```js
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

// 输出: 42
console.log(totalLength);

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

// 输出: <Buffer 00 00 00 00 ...>
console.log(bufA);

// 输出: 42
console.log(bufA.length);
```

# 9、切割 buffer: buf.slice()

> buf.slice([start[, end]])

参数说明：

- start: 新建的 `Buffer` 开始的位置，默认：0
- end： 新建的 `Buffer` 结束的位置，默认： `buf.length`

返回一个**指向相同原始内存**的新建的 `Buffer`，但做了偏移且通过 `start` 和 `end` 索引进行裁剪。

**注意，修改这个新建的 `Buffer` 切片，也会同时修改原始的 `Buffer` 的内存，因为这两个对象所分配的内存是重叠的。**

```js
const buf1 = Buffer.allocUnsafe(26);
for (let i = 0; i < 26; i++) {
    buf1[i] = i + 97;
}
const buf2 = buf1.slice(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 输出：abc

// 修改buf1, buf2也会跟着改变
buf1[0] = 33;
// 输出: !bc
console.log(buf2.toString('ascii', 0, buf2.length));

// 修改 buf2, buf1会跟着变化
buf2[0] = 44;
// 输出: ,bcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('ascii', 0, buf1.length));
```

# 10、将 buffer 转为 JSON 对象: buf.toJSON()

> buf.toJSON()

返回 buf 的 JSON 格式。

```js
const buf = Buffer.alloc(3);
console.log(buf.toJSON());
//输出：{ type: 'Buffer', data: [ 0, 0, 0 ] }
```

# 参考资料：

[node.js 官方文档：Buffer - 缓冲器](http://nodejs.cn/api/buffer.html)