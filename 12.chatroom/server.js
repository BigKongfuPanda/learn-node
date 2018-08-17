const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const cache = {};

/**
 * 提供静态文件服务
 * @param {buffer/string} response 响应数据
 * @param {object} cache 缓存对象
 * @param {string} absPath 静态资源的绝对路径
 */
const serveStatic = (response, cache, absPath) => {
    // 检查文件是否缓存在内存中，如果在内存中，就从内存中返回文件
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        // 如果文件没有在缓存中，则从硬盘中读取文件，但是需要先判断文件在硬盘中是否
        fs.access(absPath, (err) => {
            if (err) {
                send404(response);
            } else {
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            }
        });
    }
}

/**
 * 发送文件错误
 * @param {buffer/string} response 响应数据
 */
const send404 = (response) => {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
} 

/**
 * 发送文件数据
 * @param {buffer/string} response 响应数据
 * @param {string} filePath 文件路径
 * @param {buffer/string} fileContents 文件内容
 */
const sendFile = (response, filePath, fileContents) => {
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContents);
}

