const fs = require('fs');
const path = require('path');

fs.appendFile('./assets/mkdir.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});

fs.appendFile('./assets/mkdir.txt', 'data to append', 'utf8', callback);

fs.open('', 'a', (err, fd) => {
  if (err) throw err;
  fs.appendFile(fd, 'data to append', 'utf8', )
});