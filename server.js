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
        fs.readFile(csvFilePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading CSV file');
                return;
            }
            const characters = parseCSV(data);
            console.log(characters);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(characters.map(c => ({ name: c.name }))));
        });
    }
    // 处理 /api/character 请求，根据名称获取角色信息
    else if (req.url.startsWith('/api/character?name=')) {
        const characterName = new URL(req.url, `http://${req.headers.host}`).searchParams.get('name');
        // 使用 LEFT JOIN 查询角色信息和对应的命途名称
        const query = `SELECT name, destiny, health, attack, defense, speed, energy FROM character WHERE name = ?`;
        db.get(query, [characterName], (err, row) => {
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
    // 处理 /api/lightcones 请求，获取所有光锥名称
    else if (req.url === '/api/lightcones') {
        db.all("SELECT name FROM light_cone", (err, rows) => {
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
    // 处理 /api/lightcone 请求，根据名称获取光锥信息
    else if (req.url.startsWith('/api/lightcone?name=')) {
        const lightConeName = new URL(req.url, `http://${req.headers.host}`).searchParams.get('name');
        const query = `SELECT name, health, destiny, attack, defense, description FROM light_cone WHERE name = ?`;
        db.get(query, [lightConeName], (err, row) => {
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
                res.end('Light cone not found');
            }
        });
    }
    // 处理静态文件请求
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

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        let character = {};
        headers.forEach((header, index) => {
            character[header.trim()] = values[index].trim();
        });
        return character;
    });
}