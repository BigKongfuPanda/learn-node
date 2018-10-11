
# 目录

- 路由
- 中间件
- 错误处理
- RESTful 风格

# 1 路由

## 1.1. app.all()

`app.all()` 方法是对所有的 `http` 方法都有效，例如 `get`，`post`，`put`，`delete` 等。

```js
app.all('/list', function(req, res, next) {
    console.log('');
    next();
});
```

## 1.2. 正则表达式路由路径

路由路径可以使用正则表达式来匹配一类有相同的特点的路径。


字符串模式：

```js
// 匹配 /ab 和 /abcd
app.get('/ab?cd', function(){});

// 匹配 /abe, /abcde
app.get('/ab(cd)?e', function(){});

// 匹配 /abcd, /abbcd, /abbbcd
app.get('/ab+cd', function(){});

// 匹配 /abcd, /abxcd, /abROMDOMcd, /ab123cd
app.get('/ab*cd', function(){});
```

正则表达式：

```js
// 匹配 任何含有 'a' 的字符串
app.get('/a/', function(){});

// 匹配 任何以 'fly' 结尾的字符串
app.get('/.*fly$/', function(){});
```

## 1.3. 路由参数

在路由上面可以传递参数，参数是路由路径的组成部分，参数可以通过 `req.params`对象 来获取。

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

## 1.4. 返回请求的方法

```
res.download()	Prompt a file to be downloaded.
res.end()	End the response process.
res.json()	Send a JSON response.
res.jsonp()	Send a JSON response with JSONP support.
res.redirect()	Redirect a request.
res.render()	Render a view template.
res.send()	Send a response of various types.
res.sendFile()	Send a file as an octet stream.
res.sendStatus()	Set the response status code and send its string representation as the response body.
```

## 1.5. app.route()

可以使用 app.route() 方法来进行链式操作，这样很方便构建 `RESTful` 风格的 API。

```js
app.route('/list')
    .get((req, res) => {
        res.send('get a book');
    })
    .post((req, res) => {
        res.send('add a new book');
    })
    .put((req, res) => {
        res.send('update the book');
    });
```

## 1.6. express.Router()

使用 `express.Router` 类来创建可安装的模块化路由处理程序。`Router` 实例是完整的中间件和路由系统；因此，常常将其称为“微型应用程序”。

以下示例将路由器创建为模块，在其中装入中间件，定义一些路由，然后安装在主应用程序的路径中。

在应用程序目录中创建名为 `birds.js` 的路由器文件，其中包含以下内容：

```js
const express = require('express);
const router = express.Router();

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    next();
});

router.get('/', function(req, res){
    res.send('birds home page');
});

router.get('/about', function(req, res){
    res.send('about birds');
});
```

接着，在应用程序 `app.js` 中装入路由器模块：

```js
const birds = require('./birds');
...
app.use('/birds', birds);
```

## 1.7. app.route() 和 express.Router() 的区别

既然 `express` 已经内置了路由处理的功能，使用 `app.METHOD()` 来处理路由，那为啥还要增加一个路由中间件 `express.Router()` 呢？。

`express.Router()` 目的是中间件和路由的分离的实例。可以将其视为“迷你应用程序”，只能执行中间件和路由功能。“迷你应用程序”背后的想法是，应用程序中的不同路线可能变得相当复杂，你可以从将该逻辑移动到单独的文件中获益。而 `app.js` 的作用是做一些全局的处理，而 `express.Router()` 则可以用来专门处理跟路由相关的功能。

# 2 中间件

## 2.1 编写中间件

中间件函数能够访问请求对象 (`req`)、响应对象 (`res`) 以及应用程序的请求/响应循环中的下一个中间件函数。下一个中间件函数通常由名为 `next` 的变量来表示。

如果当前中间件函数没有结束请求/响应循环，那么它必须调用 `next()`，以将控制权传递给下一个中间件函数。否则，请求将保持挂起状态。

```js
var express = require('express');
var app = express();

// 编写中间件
var myLogger = function (req, res, next) {
  console.log('LOGGED');
  next();
};

// 使用中间件
app.use(myLogger);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000);
```

应用程序每次收到请求时，会在终端上显示消息“LOGGED”。

中间件装入顺序很重要：首先装入的中间件函数也首先被执行。

## 2.2 使用中间件

### `next('route')` 和 `next()`：

- 要跳过路由器中间件堆栈中剩余的中间件函数，请调用 `next('route')` 将控制权传递给下一个路由。 注：`next('route')` 仅在使用 `app.METHOD()` 或 `router.METHOD()` 函数装入的中间件函数中有效。

- `next()` 的作用是，跳到当前路由中间件堆栈中的下一个中间件函数。

```js
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id == 0) next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.render('regular');
});

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function (req, res, next) {
  res.render('special');
});
```

### `app.use(callback)` 和 `router.use(callback)`：

如果像这样，没有路由路径，则任何路径的 `http` 请求都会被执行。

### 错误处理中间件

错误处理中间件函数的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个，专门具有特征符 (`err`, `req`, `res`, `next`)：

```js
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

# 3 错误处理

Express 内置了错误处理程序，使用 `next(err)`，Express 就知道出错了，并把这个错误传递给错误处理模块。为了处理这些错误，需要添加一个中间件，它有4个参数：

```js
app.use((err, req, res, next) => {
  // log the error...
  res.sendStatus(err.httpStatusCode).json(err);
});
```

请在其他 `app.use()` 和路由调用之后，最后定义错误处理中间件，例如：

```js
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(bodyParser());
app.use(methodOverride());
app.use(function(err, req, res, next) {
  // logic
});
```

# 4 RESTful 风格

可以利用 `router.route(path)` 的链式操作来实现 RESTful 风格的api。

```js
const express = require('express');
const router = express.Router();

router.route('/info')
  .post((req, res) => {
    // 新增一条信息
  })
  .get((req, res) => {
    // 获取信息
  })
  .put((req, res) => {
    // 更新一条信息
  });
```

