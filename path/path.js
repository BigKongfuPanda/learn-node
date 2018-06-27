var path = require('path');

// 输出 '/foo/bar/baz/asdf'
let url = path.join('/foo', '../bar', 'baz/asdf', 'quux', '..');
console.log(url);
