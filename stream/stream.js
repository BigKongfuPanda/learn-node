const fs = require('fs');

// 打开一个流
let rs = fs.createReadStream('./assets/sample.txt', 'utf-8');

rs.on('data', chunk => {
  console.log('Data:');
  console.log(chunk);
});

rs.on('end', () => {
  console.log('END');
});

rs.on('error', err => {
  console.log('ERROR:' + err);
});

/** 
 * 输出结果：
  Data:
  Node.js内置的fs模块就是文件系统模块，负责读写文件。
  END
 */

 // 写入流
 let ws1 = fs.createWriteStream('./assets/output1.txt', 'utf-8');
 ws1.write('使用Stream写入文本数据...\n');
 ws1.write('END.');
 ws1.end();

let ws2 = fs.createWriteStream('./assets/output2.txt');
ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
ws2.write(new Buffer('END.', 'utf-8'));
ws2.end();

// pipe()

let ws = fs.createWriteStream('./assets/copied.txt');
rs.pipe(ws);

let rs3 = fs.createReadStream('./assets/demo.jpg');
let ws3 = fs.createWriteStream('./assets/a.png');

rs3.pipe(ws3);
