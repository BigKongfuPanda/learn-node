# 目录

- 获取路径/文件名/拓展名
- 路径组合
- 路径解析
- 获取相对路径

# 1、获取路径/文件名/拓展名

- 获取路径：path.dirname(filepath)
- 获取文件名：path.basename(filepath)
- 获取扩展名：path.extname(filepath)

## 1.1 获取路径 path.dirname()

```js
const path = require('path');

path.dirname('/foo/bar/baz/asdf/quux.js');
// 返回: '/foo/bar/baz/asdf'

path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```

## 1.2 获取文件名 path.basename()

严格意义上来说，`path.basename(filepath)` 只是输出路径的最后一部分，并不会判断是否文件名。

```js
var path = require('path');

// 输出：test.js
console.log( path.basename('/tmp/demo/js/test.js') );

// 输出：test
console.log( path.basename('/tmp/demo/js/test/') );

// 输出：test
console.log( path.basename('/tmp/demo/js/test') );
```

如果只想获取文件名，单不包括文件扩展呢？可以用上第二个参数。

```js
// 输出：test
console.log( path.basename('/tmp/demo/js/test.js', '.js') );
```

## 1.3 获取文件扩展名 path.extname()

```js
var path = require('path');
var filepath = '/tmp/demo/js/test.js';

// 输出：.js
console.log( path.extname(filepath));
```

更详细的规则是如下：（假设 path.basename(filepath) === B ）
- 从B的最后一个 `.` 开始截取，直到最后一个字符。
- 如果B中不存在 `.` ，或者B的第一个字符就是 `.` ，那么返回空字符串。

官方文档上面的例子

```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''
```

# 2、路径组合

- path.join([...paths])
- path.resolve([...paths])

## 2.1 path.join()

`path.join()` 方法使用平台特定的分隔符把全部给定的 `path` 片段连接到一起，并规范化生成的路径，会调用 path.normalize()。

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('/foo', 'bar', 'baz/asdf', 'quux', '.');
// 返回: '/foo/bar/baz/asdf/quux'

path.join('/foo', '/bar', 'baz/asdf', 'quux');
// 返回: '/foo/bar/baz/asdf/quux'

path.join('/foo', '//bar', 'baz/asdf', 'quux');
// 返回: '/foo/bar/baz/asdf/quux'

path.join('/foo', './bar', 'baz/asdf', 'quux');
// 返回: '/foo/bar/baz/asdf/quux'

path.join('/foo', '../bar', 'baz/asdf', 'quux');
// 返回: '/foo/baz/asdf/quux'
```

# 2.2 path.resolve()

`path.resolve()` 方法会把一个路径或路径片段的序列解析为一个 **绝对路径**。

**给定的路径的序列是从右往左被处理的，后面每个 `path` 被依次解析，直到构造完成一个绝对路径。 例如，给定的路径片段的序列为：`/foo`、`/bar`、`baz`，则调用 `path.resolve('/foo', '/bar', 'baz')` 会返回 `/bar/baz`。**

**如果处理完全部给定的 `path` 片段后还未生成一个绝对路径，则当前工作目录会被用上。**

**生成的路径是规范化后的，且末尾的斜杠会被删除，除非路径被解析为根目录。**

长度为零的 `path` 片段会被忽略。

**如果没有传入 `path` 片段，则 `path.resolve()` 会返回当前工作目录的绝对路径。**

```js
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录为 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

# 3、路径解析

- path.normalize(filepath)
- path.parse(filepath)
- path.format(filepath)



# 4、获取相对路径

- path.relative(from, to)

