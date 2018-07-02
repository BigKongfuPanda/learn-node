- 概述
- 模块内部的变量
- setImmediate 和 clearImmediate
- setTimeout 和 clearTimeout
- setInterval 和 clearInterval
- console
- process

# 1、概述

在浏览器 JavaScript 中，通常 window 是全局对象， 而 Node.js 中的全局对象是 `global`，所有全局变量（除了 `global` 本身以外）都是 `global` 对象的属性。

在 Node.js 我们可以直接访问到 `global` 的属性，而不需要在应用中包含它。

# 2、模块内部的变量

有些变量看起来在所有模块内部都可以使用，但是实际上不是，他们的作用域只在模块内，这些变量有：
 
- __dirname: 表示当前正在执行的脚本的文件名。它将输出文件所在位置的绝对路径。
- __dirname: 表示当前执行脚本所在的目录。
- exports
- module
- require()

以上五个变量，已经在 module 章节中做了很详细的解释，此处不再赘述。

# 3、setImmediate 和 clearImmediate

预定立即执行的 `callback` 回调函数，它是在 `I/O` 事件的回调之后被触发，也就是在 Node.js 事件循环的当前回合结束时被触发。

当多次调用 `setImmediate()` 时，`callback` 函数会按照它们被创建的顺序依次执行。 

# 4、setTimeout 和 clearTimeout

此处的 setTimeout 和 clearTimeout ，跟 JavaScript中的含义和使用方法是一样的。

需要注意的是，Node.js 不能保证回调被触发的确切时间，也不能保证它们的顺序。 回调会在尽可能接近所指定的时间上调用。**当延时大于 2147483647 或小于 1 时，delay 会被设为 1。**

# 5、 setInterval 和 clearInterval

此处的 setInterval 和 clearInterval ，跟 JavaScript中的含义和使用方法是一样的。

**当延时大于 2147483647 或小于 1 时，delay 会被设为 1。**

# 6、console

console 与 浏览器中控制台输出的用法是一样，只是需要注意的是 console.time 和 console.timeEnd，用于记录当前程序执行的时间的。

```js
// main.js

console.info("程序开始执行：");

var counter = 10;
console.log("计数: %d", counter);

console.time("获取数据");
//
// 执行一些代码
// 
console.timeEnd('获取数据');

console.info("程序执行完毕。")
```

执行 main.js 文件，代码如下所示:

```js
$ node main.js
程序开始执行：
计数: 10
获取数据: 0ms
程序执行完毕
```

# 7、process

