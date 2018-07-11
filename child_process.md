# 目录

- 概述
- 创建子进程的方法
- 子进程的事件

# 1、概述

我们都知道 Node.js 是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于我们在多核 cpu 的系统上创建多个子进程，从而提高性能。

每个子进程总是带有三个流对象：`child.stdin`, `child.stdout` 和 `child.stderr`。他们可能会共享父进程的 `stdio` 流，或者也可以是独立的被导流的流对象。

# 2、创建子进程的方法

创建子进程有四种方法：`spawn`，`exec`，`execFile`, `fork`。

- `child_process.exec()`: 衍生一个 `shell` 并在 `shell` 上运行命令，当完成时会传入 `stdout` 和 `stderr` 到回调函数。
- `child_process.execFile()`: 类似 `child_process.exec()`，但直接衍生命令，且无需先衍生 `shell`。
- `child_process.fork()`: 衍生一个新的 Node.js 进程，并通过建立 IPC 通讯通道来调用指定的模块，该通道允许父进程与子进程之间相互发送信息。
- `child_process.execSync()`: `child_process.exec()` 的同步函数，会阻塞 Node.js 事件循环。
- `child_process.execFileSync()`: c`hild_process.execFile()` 的同步函数，会阻塞 Node.js 事件循环。

## 2.1 spawn

> child_process.spawn(command[, args][, options])   
>  - command <string> : 要运行的命令    
>  - args <Array> : 字符串参数列表。   
>  - options: 选项，其中 `cwd` 可以指定子进程的当前工作目录。`detached` 可以设置 true 或者 false，为 true，则将子进程独立于父进程来运行，父进程结束后，子进程可以继续执行。 `stdio` 用于配置子进程与父进程之间建立的管道

`child_process.spawn()` 方法使用给定的 `command` 和 `args` 中的命令行参数来衍生一个新进程。 如果省略 `args`，则默认为一个空数组。

```js
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});
```

`spawn` 生成的子进程实例，有 `stdout` 和 `stderr` 对象，可以监听数据的输入。

## 2.2 exec

> child_process.exec(command[, options][, callback])  
>  - command <string> : 运行的命令，参数使用空格分隔。
>  - options: 选项。`cwd`: 子进程的当前工作目录。`encoding`: 默认为 `'utf8'`。`maxBuffer`: stdout 或 stderr 允许的最大字节数。默认为 200*1024。如果超过限制，则子进程会被终止。
>  - callback(error, stdout, stderr): 进程终止时调用

`exec` 创建子进程的时候，会衍生一个 `shell` 并在 `shell` 中执行 `command`，且缓冲任何产生的输出。 传入函数的 `command` 字符串会被 `shell` 直接处理。

```js
const { exec } = require('child_process');

exec('find . -type f | wc -l', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`Number of files ${stdout}`);
});
```

## 2.2.1 `spawn` 和 `exec` 方法的相同点：

- 它们都用于开一个子进程执行指定命令。

- 它们都可以自定义子进程的运行环境。

- 它们都返回一个 `ChildProcess` 对象，所以他们都可以取得子进程的标准输入流，标准输出流和标准错误流 。

## 2.2.2 `spawn` 和 `exec` 方法的不同点：

- 接受参数的方式： `spawn` 使用了参数数组，而 `exec` 则直接接在命令后。

- 子进程返回给Node的数据量： `spawn` 没有限制子进程可以返回给Node的数据大小，而 `exec` 则在 `options` 配置对象中有 `maxBuffer` 参数限制，且默认为200K，如果超出，那么子进程将会被杀死，并报错：`Error：maxBuffer exceeded`，虽然可以手动调大 `maxBuffer` 参数，但是并不被推荐。由此可窥见一番Node.js设置这两个API时的部分本意， `spawn` 应用来运行返回大量数据的子进程，如图像处理，文件读取等。而 `exec` 则应用来运行只返回少量返回值的子进程，如只返回一个状态码。

- 回调函数： `exec` 方法相比 `spawn` 方法，多提供了一个回调函数，可以更便捷得获取子进程输出。这与为返回的 `ChildProcess` 对象的 `stdout` 或 `stderr` 监听 `data` 事件来获得输出的区别在于： `data` 事件的方式，会在子进程一有数据时就触发，并把数据返回给Node。而回调函数，则会先将数据缓存在内存中（数据量小于 `maxBuffer` 参数），等待子进程运行完毕后，再调用回调函数，并把最终数据交给回调函数。

因为 `exec` 方法会在将所有的数据缓冲起来，所以有 `maxBuffer` 大小的限制，因此当数据量小，并且需要使用 `shell` 语法来创建子进程的时候，使用 `exec` 方法是个不错的选择。

然而，当数据量比较大的时候，只好选择 `spawn` 方法来创建子进程，这是因为 `spawn` 方法中数据是以 `stream` 的方式来保存的。

## 2.3 execFile

> child_process.execFile(file[, args][, options][, callback])   
> - file <string> : 要运行的可执行文件的名称或路径。   
> - args: 字符串参数列表
> - options: 选项
> - callback(error, stdout, stderr): 当进程终止时调用，并带上输出。

`child_process.execFile()` 函数类似 `child_process.exec()`，除了不衍生一个 `shell`。 而是，指定的可执行的 `file` 被直接衍生为一个新进程，这使得它比 `child_process.exec()` 更高效。

```js
const { execFile } = require('child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
    if(error){
        throw error;
    }
    console.log(stdout);
});
```

## 2.4 fork

> child_process.fork(modulePath[, args][,options])  
>  - modulePath <string> : 要在子进程中运行的模块。  
>  - args <Array> : 字符串参数列表。  
>  - options: 选项

`fork` 方法是 `spawn` 方法的变形的一种形式，也是用来创建进程。二者最大的不同之处在于：`fork` 方法会创建一个内置的通信信道，允许消息在父进程和子进程之间来回传递。以下有个例子：

parent.js 文件中的代码如下：

```js
const {fork} = require('child_process');

const forked = fork('child.js');

forked.on('message', (msg) => {
    console.log('Message from child:',  msg);
});

forked.send({hello: 'world'});
```

child.js 文件中的代码如下：

```js
process.on('message', (msg) => {
    console.log('Message from parent: ' , msg);
});

let counter = 0;

setInterval(() => {
    process.send({counter: counter ++});
}, 1000);
```

运行 node parent.js ，得到如下结果：

```js
Message from parent:  { hello: 'world' }
Message from child: { counter: 0 }
Message from child: { counter: 1 }
Message from child: { counter: 2 }
Message from child: { counter: 3 }
Message from child: { counter: 4 }
...
...
```

在 `parent.js` 中，使用 `fork` 方法创建了一个子进程实例 `forked`，并且指定了子进程的的运行目录为 `child.js` 。给实例 `forked` 绑定了 `message` 事件，当子进程(child.js)中使用 `process.send` 发送数据的时候，会触发 `message` 事件。

同时，父进程向子进程中发送数据的时候，通过 `forked.send` 来进行，参数为一个对象。

# 3、子进程的事件

`ChildProcess` 类的实例是 `EventEmitter`，代表衍生的子进程。

`ChildProcess` 的实例不被直接创建。 而是，使用 `child_process.spawn()`、`child_process.exec()`、`child_process.execFile()` 或 `child_process.fork()` 方法创建 `ChildProcess` 实例。

## 3.1 close 事件

当子进程的 `stdio` 流被关闭时会触发 `'close'` 事件。 这与 `'exit'` 事件不同，因为多个进程可能共享同一 `stdio` 流。

## 3.2 disconnect 事件

在父进程中调用 `subprocess.disconnect()` 或在子进程中调用 `process.disconnect()` 后会触发 `'disconnect'` 事件。 断开后就不能再发送或接收信息，且 s`ubprocess.connected` 属性会被设为 `false`。

## 3.4 message 事件

当一个子进程使用 `process.send()` 发送消息时会触发 `'message'` 事件。

```js
const {fork} = require('child_process');

const forked = fork('child.js');

forked.on('message', (msg) => {
    console.log('Message from child:',  msg);
});

forked.send({hello: 'world'});
```

# 参考资料

[Node.js Child Processes: Everything you need to know](https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a)

[Node.js中spawn与exec的异同比较](https://segmentfault.com/a/1190000002913884)