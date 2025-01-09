const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('characters.db');

// 使用 serialize 方法确保数据库操作按顺序执行
db.serialize(() => {
    // 如果 character 表存在，则删除
    db.run("DROP TABLE IF EXISTS character");
    // 创建 character 表
    db.run("CREATE TABLE character (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, health INTEGER, attack INTEGER, defense INTEGER, speed INTEGER, energy INTEGER)");
    // 准备插入语句
    const stmt = db.prepare("INSERT INTO character (name, health, attack, defense, speed, energy) VALUES (?, ?, ?, ?, ?, ?)");
    // 插入角色数据
    stmt.run("开拓者•毁灭", 1203, 620, 460, 100, 120);
    // 完成插入操作
    stmt.finalize();
});

// 关闭数据库连接
db.close();