# 目录

- 模块的定义
- 模块包装器
- 模块内部作用域
- module 对象
- 模块导入策略
- module.exports 和 exports 的区别

# 1、模块的定义

在 Node.js 模块系统中，每个文件都被视为独立的模块。

通过 module.exports 或者 exports 来导出所需要导出的变量、对象或者函数。

通过 require() 来导入所需要的模块。


# 2、模块包装器

Node.js 在编译 js 文件的过程中实际完成的步骤有对 js 文件内容进行头尾包装。以 foo.js 为例,包装之后的 foo.js 将会变成以下形式:

```js
// app.js
var circle = require('./circle.js');
console.log('The area of a circle of radius 4 is ' + circle.area(4));

// 包装后的代码
￼(function (exports, require, module, __filename, __dirname) {
  // 模块内部的代码实际在这里
  var circle = require('./circle.js');
  console.log('The area of a circle of radius 4 is ' + circle.area(4));
});
```

通过这样做，Node.js 实现了以下几点：

- 它保持了顶层的变量（用 `var`、`const` 或 `let` 定义）作用在模块范围内，而不是全局对象。
- 它有助于提供一些看似全局的但实际上是模块特定的变量，`exprots`、`require`、`module`、`__filename`、`__dirname` 均为模块内部的变量。


# 3、模块内部作用域

一个文件就是一个模块，在模块内部，存在一个独立的作用域，在该作用域下，存在一些模块特定的变量，不需要手动显式引入，既可以直接使用，如：`exprots`、`require`、`module`、`__filename`、`__dirname`。

## 3.1 __dirname

当前模块的文件夹名称。等同于 `__filename` 的 `path.dirname()` 的值。

示例：运行位于 /Users/mjr目录下的example.js文件：node example.js

```js
console.log(__dirname);
// Prints: /Users/mjr
console.log(path.dirname(__filename));
// Prints: /Users/mjr
```

## 3.2 __filename

当前模块的文件名称---解析后的绝对路径。

在 /Users/mjr 目录下执行 node example.js

```js
console.log(__filename);
// /Users/mjr/example.js

console.log(__dirname);
// /Users/mjr
```

## 3.3 exports

这是一个对于 `module.exports` 的更简短的引用形式

## 3.4 module

对当前模块的引用, `module.exports` 用于指定一个模块所导出的内容，即可以通过 `require()` 访问的内容。

## 3.5 require()

引入模块.

## 3.6 require.cache

被引入的模块将被缓存在这个对象中。从此对象中删除键值对将会导致下一次 `require` 重新加载被删除的模块。

## 3.7 require.main

在命令行，使用 node 命令执行的 js文件所代表的 `module` 对象.

例如执行 `node app.js`

在 app.js 中，打印 `require.main`

```js
console.log(require.main);
```

输出为

```js
Module {
  id: '.',
  exports: {},
  parent: null,
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```

当 Node.js 直接运行一个文件时，`require.main` 会被设为它的 `module`。 这意味着可以通过 `require.main === module` 来判断一个文件是否被直接运行。

对于 foo.js 文件，如果通过 `node foo.js` 运行则为 true，但如果通过 `require('./foo')` 运行则为 false。

因为 `module` 提供了一个 `filename` 属性（通常等同于 `__filename`），所以可以通过检查 `require.main.filename` 来获取当前应用程序的入口点。

## 3.8 require.resolve

使用内部的 `require()` 机制查询模块的位置, 此操作只返回解析后的文件名，不会加载该模块。


# 4、module 对象

在每个模块中，`module` 的自由变量是一个指向表示当前模块的对象的引用。 为了方便,`module.exports` 也可以通过全局模块的 `exports` 对象访问。 `module` 实际上不是全局的，而是每个模块本地的。

## 4.1 module.children

被该模块引用的模块对象

## 4.2 module.exports

对 `module.exports` 的赋值必须立即完成。 不能在任何回调中完成。 以下是无效的：

```js
// x.js
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);

// y.js
const x = require('./x');
console.log(x.a);
```

## 4.3 module.loaded

模块是否已经加载完成（true），或正在加载中（false）。


# 5、模块导入策略

由于 Node.js 中存在 4 类模块（原生模块和3种文件模块），尽管 `require` 方法极其简单，但是内部的加载却是十分复杂的，其加载优先级也各自不同。

## 4.1 从文件模块缓存中加载

尽管原生模块与文件模块的优先级不同，但是都会优先从文件模块的缓存中加载已经存在的模块。

## 4.2 从原生模块加载

原生模块的优先级仅次于文件模块缓存的优先级。`require` 方法在解析文件名之后，优先检查模块是否在原生模块列表中。以 `http` 模块为例，尽管在目录下存在一个 http/http.js/http.node/http.json 文件，`require("http")` 都不会从这些文件中加载，而是从原生模块中加载。

原生模块也有一个缓存区，同样也是优先从缓存区加载。如果缓存区没有被加载过，则调用原生模块的加载方式进行加载和执行。

## 4.3 从文件加载

当文件模块缓存中不存在，而且不是原生模块的时候，Node.js 会解析 `require` 方法传入的参数，并从文件系统中加载实际的文件，这里我们将详细描述查找文件模块的过程，其中，也有一些细节值得知晓。

如果按确切的文件名没有找到模块，则 Node.js 会尝试带上 `.js`、`.json` 或 `.node` 拓展名再加载。`.js` 文件会被解析为 JavaScript 文本文件，`.json` 文件会被解析为 JSON 文本文件。 `.node` 文件会被解析为通过 dlopen 加载的编译后的插件模块。

`require` 方法接受以下几种参数的传递：
- http、fs、path等，原生模块。
- ./mod或../mod，相对路径的文件模块。
- /pathtomodule/mod，绝对路径的文件模块。
- mod，非原生模块的文件模块。当没有以 `'/'`、`'./'` 或 `'../'` 开头来表示文件时，这个模块必须是一个核心模块或加载自 node_modules 目录。

在路径 Y 下执行 `require(X)` 语句执行顺序：

```js
1. 如果 X 是内置模块
   a. 返回内置模块
   b. 停止执行
2. 如果 X 以 '/' 开头
   a. 设置 Y 为文件根路径
3. 如果 X 以 './' 或 '/' or '../' 开头
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. 抛出异常 "not found"

LOAD_AS_FILE(X)
1. 如果 X 是一个文件, 将 X 作为 JavaScript 文本载入并停止执行。
2. 如果 X.js 是一个文件, 将 X.js 作为 JavaScript 文本载入并停止执行。
3. 如果 X.json 是一个文件, 解析 X.json 为 JavaScript 对象并停止执行。
4. 如果 X.node 是一个文件, 将 X.node 作为二进制插件载入并停止执行。

LOAD_INDEX(X)
1. 如果 X/index.js 是一个文件,  将 X/index.js 作为 JavaScript 文本载入并停止执行。
2. 如果 X/index.json 是一个文件, 解析 X/index.json 为 JavaScript 对象并停止执行。
3. 如果 X/index.node 是一个文件,  将 X/index.node 作为二进制插件载入并停止执行。

LOAD_AS_DIRECTORY(X)
1. 如果 X/package.json 是一个文件,
   a. 解析 X/package.json, 并查找 "main" 字段。
   b. let M = X + (json main 字段)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```

# 5、module.exports 和 exports 的区别

`exports` 是 `module` 对象的一个属性，在模块进行初始化的时候，为一个空对象，即 `module.exports = {}`，而 `exports` 是一个变量，其指向 `module.exports` 对象，即 `module.exports === exports`。实际起作用的是 `module.exports`， `exports` 只是一个辅助的变量。模块最终返回module.exports给调用者，而不是exports。

`exports` 所做的事情是收集属性，如果 `module.exports` 当前没有任何属性的话， `exports` 会把这些属性赋予 `module.exports` 。如果 `module.exports` 已经存在一些属性的话，那么 `exports` 中所用的东西都会被忽略。