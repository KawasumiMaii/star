const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const hostname = '127.0.0.1';
const port = 3000;

// 创建数据库连接
const db = new sqlite3.Database('characters.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    // 处理根路由请求，返回 index.html
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File not found');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(content);
            }
        });
    }
    // 处理 /api/characters 请求，获取所有角色名
    else if (req.url === '/api/characters') {
        db.all("SELECT name FROM character", (err, rows) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Database error');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(rows));
            }
        });
    }
    // 处理 /api/character 请求，根据名称获取角色信息
    else if (req.url.startsWith('/api/character?name=')) {
        const characterName = new URL(req.url, `http://${req.headers.host}`).searchParams.get('name');
        // 优化数据库查询，只查询需要的字段
        db.get("SELECT name, health, attack, defense, speed, energy FROM character WHERE name = ?", [characterName], (err, row) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Database error');
            } else if (row) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(row));
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Character not found');
            }
        });
    }
    // 优化静态文件处理
    else {
        const extname = path.extname(req.url);
        const contentTypeMap = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        };
        const contentType = contentTypeMap[extname] || 'application/octet-stream';

        fs.readFile(path.join(__dirname, req.url), (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('File not found');
                } else {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Server error');
                }
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                res.end(content);
            }
        });
    }
});

// 启动服务器
server.listen(port, hostname, () => {
    console.log(`服务器运行在 http://${hostname}:${port}/`);
});

// 关闭服务器时关闭数据库连接
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        process.exit(0);
    });
});