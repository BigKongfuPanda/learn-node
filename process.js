process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
});

console.log(process.argv[0]);
console.log(process.argv0);
console.log(process.env);