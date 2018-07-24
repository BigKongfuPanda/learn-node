# 目录

- 概述
- Buffer 类的方法和属性
- buffer 实例的方法和属性

# 1、概述

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 `Buffer` 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，`Buffer` 类是随 Node 内核一起发布的核心库。`Buffer` 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 `Buffer` 库。原始数据存储在 `Buffer` 类的实例中。一个 `Buffer` 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

# 2、Buffer 类的方法和属性

## 2.1 创建 Buffer 实例

创建 `Buffer` 实例有多种办法，但是 v8.0 之后，官方已经不推荐使用 new Buffer() 方法了。可以正常使用的方法有：

- Buffer.alloc(size[, fill[, encoding]])
- Buffer.allocUnsafe(size)
- Buffer.allocUnsafeSlow(size)
- Buffer.from()

### 2.1.1 Buffer.alloc(size[, fill[, encoding]])

分配一个大小为 size 字节的新建的 `Buffer` 。 如果 `fill` 为 `undefined` ，则该 `Buffer` 会用 0 填充。

参数说明：

- size： 新建的 Buffer 期望的长度, 如果 size 不是一个数值，则抛出 `TypeError` 错误。
- fill： 用来预填充新建的 Buffer 的值。 默认: 0
- encoding： 如果 fill 是字符串，则该值是它的字符编码。 默认: `utf8`

```js
const buf1 = Buffer.alloc(5);
const buf2 = Buffer.alloc(5, 'a');

console.log(buf1);
console.log(buf2);

// 输出: <Buffer 00 00 00 00 00>
// 输出: <Buffer 61 61 61 61 61>
```

注意：调用 `Buffer.alloc()` 会明显地比另一个方法 `Buffer.allocUnsafe()` 慢，但是能确保新建的 `Buffer` 实例的内容**不会包含敏感数据**。

### 2.2.2 Buffer.allocUnsafe(size)

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

### 2.2.3 Buffer.allocUnsafeSlow(size)

与 Buffer.allocUnsafe(size) 方法类似，但是有细微差别，可以不用去深究。

### 2.2.4 Buffer.from()

Buffer.from() 方法可以传三种参数，分别为：array, string, buffer

- Buffer.from(array): 通过一个八位字节的 `array` 创建一个新的 `Buffer` 。
- Buffer.from(string[, encoding]): 新建一个包含所给的 JavaScript 字符串 `string` 的 `Buffer` 。 `encoding` 参数指定 `string` 的字符编码，默认为 `utf-8`。
- Buffer.from(buffer): 将传入的 `buffer` 数据拷贝到一个新建的 `Buffer` 实例。



# 3、buffer 实例的方法和属性