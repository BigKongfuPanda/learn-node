const fs = require('fs');
const path = require('path');

fs.open('./assets/mkdir.txt', 'a', (err, fd) => {
  console.log(fd);
  if (err) throw err;
  fs.appendFile(fd, 'data to append', 'utf8', (err) => {
    fs.close(fd, (err) => {
      if (err) throw err;
    });
    if (err) throw err;
  });
});