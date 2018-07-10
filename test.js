process.on('exit', function (code) {
    console.log('About to exit with code: ', code);
});

var num = 3;
setInterval(function () {
    num -- ;
    console.log('running');
    if (num == 0) {
        process.exit(1);
    }
}, 100);