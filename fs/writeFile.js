const fs = require('fs');

let data = 'Hello, Node.js';

fs.writeFile('./assets/output.txt', data, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('ok');
  }
});