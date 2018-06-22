const fs = require('fs');

// 读取文本文件
fs.readFile('./assets/sample.txt', 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    //Node.js内置的fs模块就是文件系统模块，负责读写文件
  }
});

// 读取二进制文件
fs.readFile('./assets/demo.jpg', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
    // <Buffer ff d8 ff e1 00 18 45 78 69 66 00 00 49 49 2a 00 08 00 00 00 00 00 00 00 00 00 00 00 ff ec 00 11 44 75 63 6b 79 00 01 00 04 00 00 00 32 00 00 ff e1 03 ... >
    console.log(data.length + 'bytes');
    // 302017bytes
  }
});