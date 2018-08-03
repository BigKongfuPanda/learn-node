const querystring = require('querystring');

const params = {
    name: 'tom',
    native: {
        age: 18,
        location: 'beijing'
    }
};

console.log(querystring.stringify(params));