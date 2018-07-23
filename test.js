<<<<<<< HEAD
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`输出：${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`错误：${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});
=======
const {fork} = require('child_process');

const forked = fork('child.js');

forked.on('message', (msg) => {
    console.log('Message from child:',  msg);
});

forked.send({hello: 'world'});
>>>>>>> 3a50d4a67614f2b7b7d08cfbc90087acdc0a3ed0
