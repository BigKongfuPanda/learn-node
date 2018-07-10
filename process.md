# 目录

- 概述
- 属性
- 方法
- 事件

# 1、概述

`process` 是 `node` 的全局模块，作用比较直观。可以通过它来获得 `node` 进程相关的信息，比如运行 `node` 程序时的命令行参数。或者设置进程相关信息，比如设置环境变量。

# 2、属性

## 2.1 process.argv

`process.argv` 返回一个数组，由启动 Node.js 进程时的命令行参数所组成，第一个元素总是启动 Node.js 进程的可执行文件所在的绝对路径`（process.execPath）`，第二个是脚本文件名，其余元素是脚本文件的参数。

`process-argv.js` 文件中有以下代码：

```js
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});
```

运行以下命令，启动进程：

```js
$ node process-argv.js one two=three four
```

将输出：

```js
0: /usr/local/bin/node
1: /Users/yp-tc-m2504/Documents/practise/node/learn-node/process-argv.js
2: one
3: two=three
4: four
```

## 2.2 process.argv0

保存Node.js启动时传入的 `argv[0]` 参数值的一份只读副本，并非 process.argv[0] 所表示的路径。

`process.argv.js` 代码：
```js
console.log(process.argv[0]);
console.log(process.argv0);
```

执行

```js
$ node process.argv.js
```

输出：

```js
/usr/local/bin/node
node
```

## 2.3 process.env

返回一个包含用户环境信息的对象。

```js
{ 
    TMPDIR: '/var/folders/j0/f67nn3ns65x1zyzs09bbmsxr0000gn/T/',
    XPC_FLAGS: '0x0',
    Apple_PubSub_Socket_Render: '/private/tmp/com.apple.launchd.LGClayNFCA/Render',
    TERM: 'xterm-256color',
    LANG: 'zh_CN.UTF-8',
    SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.4itDLUDYEY/Listeners',
    SECURITYSESSIONID: '186a7',
    XPC_SERVICE_NAME: '0',
    TERM_PROGRAM: 'Apple_Terminal',
    TERM_PROGRAM_VERSION: '400',
    TERM_SESSION_ID: '6757C511-020F-4D22-A3D6-83C973762782',
    SHELL: '/bin/zsh',
    HOME: '/Users/yp-tc-m2504',
    LOGNAME: 'yp-tc-m2504',
    USER: 'yp-tc-m2504',
    PATH: '/Users/yp-tc-m2504/.nvm/versions/node/v8.11.3/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
    SHLVL: '1',
    PWD: '/Users/yp-tc-m2504/Documents/practise/node/learn-node',
    OLDPWD: '/Users/yp-tc-m2504/Documents/practise/node',
    ZSH: '/Users/yp-tc-m2504/.oh-my-zsh',
    PAGER: 'less',
    LESS: '-R',
    LC_CTYPE: 'zh_CN.UTF-8',
    LSCOLORS: 'Gxfxcxdxbxegedabagacad',
    NVM_DIR: '/Users/yp-tc-m2504/.nvm',
    NVM_CD_FLAGS: '-q',
    NVM_BIN: '/Users/yp-tc-m2504/.nvm/versions/node/v8.11.3/bin',
    _: '/Users/yp-tc-m2504/.nvm/versions/node/v8.11.3/bin/node',
    __CF_USER_TEXT_ENCODING: '0x1F5:0x19:0x34' 
}
```

在实际开发中，经常会用到 `process.env` 来设置不同的环境变量，比如在 vue-cli 中，就设置了 `process.env.NODE_ENV = 'production'` 和 `process.env.NODE_ENV = 'development'` 来区分生产环境和开发环境。

## 2.4 process.execArgv

`process.execArgv` 返回值是一个数组，包含的元素为 node.js 进程被启动时，Node.js 特定的命令行选项，这些选项在 `process.argv` 属性返回的数组中不会出现。这些选项在创建子进程时是有用的，因为他们包含了与父进程一样的执行环境信息。

例如：

```js
$ node --harmony script.js --version
```

`process.execArgv` 的结果：

```js
['harmony']
```

`process.argv` 的结果：

```js
['/usr/local/bin/node', 'script.js', '--version']
```

## 2.5 process.stdin && process.stdout

`process.stdin` 和 `process.stdout` 分别代表进程的标准输入和标准输出，输入和输出都是从命令行中进行的。

例如官网的例子，要求用户输入两个数值，然后把二者之和输出到终端。

```js
/*1:声明变量*/
var num1, num2;
/*2：向屏幕输出，提示信息，要求输入num1*/
process.stdout.write('请输入num1的值：');
/*3：监听用户的输入*/
process.stdin.on('data', function (chunk) {
    if (!num1) {
        num1 = Number(chunk);
        /*4：向屏幕输出，提示信息，要求输入num2*/
        process.stdout.write('请输入num2的值：');
    } else {
        num2 = Number(chunk);
        process.stdout.write('结果是：' + (num1 + num2));
    }
});
```

通过命令行运行上面的程序后，会让输入两个数值，然后会输出二者之和，如下所示：

```js
请输入num1的值：1
请输入num2的值：2
结果是：3
```

## 2.6 process.arch

`process.arch` 属性返回一个表示操作系统 CPU 架构的字符串，Node.js 二进制文件是为这些架构编译的。例如 `arm`, `arm64`, `ia32`, `mips`, `mipsel`, `ppc`, `ppc64`, `s390`, `s390x`, `x32`, 或 `x64`。

## 2.7 process.platform

`process.platform` 属性返回字符串，标识 Node.js 进程运行其上的操作系统平台。

## 2.8 process.exitCode

此数值标识进程结束的状态码。需要与 `process.exit([exitCode])` 一起使用。

## 2.9 process.connected

`process.connected` 属性返回的是一个布尔值，代表的是进程间是否连接，如果连接，则返回 `true`，反之为 `false`。

调用 `process.disconnected` 后，`process.connected` 返回为 `false`。

`process.connected` 如果为 `false`，则不能通过 IPC channel 使用 `process.send()` 发送信息。

# 3、 方法

## 3.1 process.nextTick(callback)

`process.nextTick()` 方法将 `callback` 添加到"next tick 队列"。 一旦当前事件轮询队列的任务全部完成，在 next tick 队列中的所有 `callbacks` 会被依次调用，`nextTick` 中的 `calllback` 会优先于所有的 I/O 事件执行，比如 `ajax`，`setTimeout`，`promise.then()`。

- `process.nextTick(callback)` 将 `callback` 放到 node 事件循环的 下一个 tick 里；
- `process.nextTick(callback)` 比 `setTimetout(callback, 0)` 性能高；

## 3.2 process.abort()

`process.abort()` 方法会使 Node.js 进程立即结束，并生成一个 core 文件。

## 3.3 process.cwd()

`process cwd()` 方法返回 Node.js 进程当前工作的目录。

```js
//执行命令
$ node process.js
//输出
/Users/yp-tc-m2504/Documents/practise/node/learn-node
```

## 3.4 process.chdir()

更改 Node.js 进程所执行的目录。参数为 `directory`，表示文件目录，如果失败则抛出异常。

## 3.5 process.exit([code])

`process.exit()` 方法以结束状态码 `code` 指示 Node.js 同步终止进程。 如果 `code` 未提供，此 `exit` 方法要么使用 'success' 状态码 0（一般在 linux 中，0 表示成功状态吗，非 0 表示失败状态码），要么使用 `process.exitCode` 属性值，前提是此属性已被设置。 Node.js在所有'exit'事件监听器都被调用了以后，才会终止进程。

process.exit() 未指定 参数 `code`时：

```js
// 未设置 process.exitCode 的属性值，则使用状态码0
process.exit(); // 使用状态码 0

//设置了 process.exitCode 的属性值，则该属性值
process.exitCode = 1; 
process.exit(); // 使用状态码1
```

如果指定了 `code`，则，执行 Node.js 的 shell 应该会得到结束状态码。即使设置了 `process.exitCode` 属性值，也会被 `process.exit(code)` 中的参数 `code` 所替换，即结束状态码使用指定的参数 `code`。

```js
process.exitCode = 1; // 设置 exitCode
process.exit(2); // 使用状态码2
```

注意：调用 `process.exit()` 会强制进程尽快结束，即使仍然有很多处于等待中的异步操作没有全部执行完成， 包括输出到 `process.stdout` 和 `process.stderr` 的 I/O 操作。

- `process.exit([exitCode])` 可以用来立即退出进程。即使当前有操作没执行完，比如 `process.exit()` 的代码逻辑，或者未完成的异步逻辑。
- 写数据到 `process.stdout` 之后，立即调用 `process.exit()` 是不保险的，因为在 node 里面，往 `stdout` 写数据是非阻塞的，可以跨越多个事件循环。于是，可能写到一半就跪了。比较保险的做法是，通过 `process.exitCode` 设置退出码，然后等进程自动退出。
- 如果程序出现异常，必须退出不可，那么，可以抛出一个未被捕获的 `error` ，来终止进程，这个比 `process.exit()` 安全。

总之： `process.exit()` 接口不太靠谱，使用时请慎重。

一个简单的例子，当满足一定条件时，使用 `process.exit()` 退出当前的进程，并且在进程退出时打印状态码 `code`。

```js
// 监听进程 exit 事件
process.on('exit', function (code) {
    console.log('About to exit with code: ', code);
});

var num = 3;
setInterval(function () {
    num -- ;
    console.log('running');
    if (num == 0) {
        process.exit(1);
    }
}, 100);
```

## 3.6 process.uptime()

`process.uptime()` 方法返回当前 Node.js 进程运行时间秒长。

## 3.7 process.disconnect()

如果 Node.js 进程是从 IPC 频道派生出来的（具体看 `Child Process` 和 `Cluster` 的文档）, `process.disconnect()` 函数会关闭到父进程的 IPC 频道，以允许子进程一旦没有其他链接来保持活跃就优雅地关闭。

调用 `process.disconnect()` 的效果和父进程调用 `ChildProcess.disconnect()` 的一样`ChildProcess.disconnect()`.

如果 Node.js 进程不是从IPC频道派生出来的，那调用 `process.disconnect()` 函数的结果是 `undefined`。

# 4、事件

## 4.1 exit

`exit` 事件会在以下两种情况下被触发：

- 显式调用 `process.exit()` 方法，使得进程即将结束；
- Node.js 事件循环数组中不再有额外的工作，使得 Node.js 进程即将结束。

一旦所有与 `exit` 事件绑定的监听器执行完成，Node.js 的进程会终止。


`exit` 事件监听器的回调函数，只有一个入参，这个参数的值可以是 `process.exitCode` 的属性值，或者是调用 `process.exit()` 方法时传入的 `exitCode` 值。

例如：

```js
process.on('exit', code => {
    console.log(`即将退出，退出码：${code}`);
});
```

**`exit` 事件监听器的回调函数，只允许包含同步操作。**

所有监听器的回调函数被调用后，任何在事件循环数组中排队的工作都会被强制丢弃，然后 Nodje.js 进程会立即结束。 例如在下例中，定时器中的操作永远不会被执行（因为不是同步操作）。

```js
process.on('exit', (code) => {
  setTimeout(() => {
    console.log('该函数不会被执行');
  }, 0);
});
```

## 4.2 beforeExit

当 Node.js 的事件循环数组已经为空，并且没有额外的工作被添加进来，事件 `beforeExit` 会被触发。

如果进程由于显式的原因而将要终止，例如直接调用 `process.exit()` 或抛出未捕获的异常，`beforeExit` 事件不会被触发。

## 4.3 disconnect

如果 Node.js 进程是由 IPC 通道的方式创建的（详见子进程和集群文档），当 IPC 通道关闭时，会触发 `disconnect` 事件。

## 4.4 message

如果 Node.js 进程是由 IPC 通道的方式创建的（详见子进程和集群文档），当子进程收到父进程发送的消息时(消息通过 `childprocess.send()` 发送），会触发 `'message'` 事件。

# 参考资料

[node.js 官网：process - 进程](http://nodejs.cn/api/process.html)

[nodejs-learning-guide：process 模块](https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/process.md)





