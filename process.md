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

例如官网的例子，要求用户输入两个数值，然后把二者之和输出到终端。

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

通过命令行运行上面的程序后，会让输入两个数值，然后会输出二者之和，如下所示：

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

调用 `process.disconnected` 后，`process.connected` 返回为 `false`。

`process.connected` 如果为 `false`，则不能通过 IPC channel 使用 `process.send()` 发送信息。

# 3、 方法

## 3.1 process.nextTick(fn)


## 3.2 process.abort()

## 3.3 process.cwd()

## 3.4 process.chdir()

## 3.5 process.exit([code])

## 3.6 process.uptime()


## 3.7 process.disconnect()


# 4、事件

## 4.1 exit


## 4.2 beforeExit


## 4.3 disconnect


## 4.4 message





