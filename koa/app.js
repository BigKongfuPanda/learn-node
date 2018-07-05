const Koa = require('koa');

const app = new Koa();

app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>hello koa!</h1>';
});

app.listen(3000);
console.log('app started at port 3000...');

// app.use(async (ctx, next) => {
//     console.log('befor calling next()');
//     ctx.foo = 'hello';
//     await next();
//     console.log('after calling next()');
// });

// app.use(async ctx => {
//     console.log('on response');
//     console.log(ctx.foo);
//     ctx.body = 'hello world';
// });

// app.listen(3000);