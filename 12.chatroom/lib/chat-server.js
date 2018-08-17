const socketio = require('socket.io');
let io;
let guestNumber = 1;
const nickName = {};
const namesUsed = [];
const currentRoom = {};
