const usage = process.cpuUsage();

console.log(usage);
console.log(process.arch);
console.log(process.platform);

console.log('hello');
process.kill(process.pid, 'SIGHUP');
console.log('world');
