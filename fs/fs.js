const fs = require('fs');
const path = require('path');

fs.rmdir('./assets/mkdir.txt', (err) => {
  if (err) {
    throw err;
  }
  console.log('删除成功');
});

