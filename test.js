const buf1 = Buffer.allocUnsafe(26);
for (let i = 0; i < 26; i++) {
    buf1[i] = i + 97;
}
const buf2 = buf1.slice(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 输出：abc

// 修改buf1, buf2也会跟着改变
buf1[0] = 33;
// 输出: !bc
console.log(buf2.toString('ascii', 0, buf2.length));

buf2[0] = 44;
// 输出: ,bcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('ascii', 0, buf1.length));

const buf3 = Buffer.alloc(3);
console.log(buf3.toJSON());