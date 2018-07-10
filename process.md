# 目录

- 概述
- 属性
- 方法
- 事件

# 1、概述

`process` 是 `node` 的全局模块，作用比较直观。可以通过它来获得 `node` 进程相关的信息，比如运行 `node` 程序时的命令行参数。或者设置进程相关信息，比如设置环境变量。

# 2、属性

## 2.1 process.argv

`process.argv` 返回一个数组，由启动 Node.js 进程时的命令行参数所组成，第一个元素总是启动 Node.js 进程的可执行文件所在的绝对路径`（process.execPath）`，第二个是脚本文件名，其余元素是脚本文件的参数。

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

## 2.4 process.execArgv


## 2.5 process.stdin && process.stdout


## 2.6 process.arch

## 2.7 process.platform

## 2.8 process.exitCode

## 2.9 process.connected


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





