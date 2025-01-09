const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('characters.db');

// 使用 serialize 方法确保数据库操作按顺序执行
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS character");
    db.run("CREATE TABLE character (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, health INTEGER, attack INTEGER, defense INTEGER, speed INTEGER, energy INTEGER, destiny_id INTEGER, FOREIGN KEY (destiny_id) REFERENCES destiny(id))");

    db.run("DROP TABLE IF EXISTS destiny");
    db.run("CREATE TABLE destiny (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE)");
    const destinyStmt = db.prepare("INSERT INTO destiny (name) VALUES (?)");
    const destinies = ["存护", "记忆", "虚无", "丰饶", "巡猎", "毁灭", "欢愉", "繁育"];
    destinies.forEach(destiny => {
        destinyStmt.run(destiny);
    });
    destinyStmt.finalize();

    const stmt = db.prepare("INSERT INTO character (name, health, attack, defense, speed, energy, destiny_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run("开拓者•毁灭", 1203, 620, 460, 100, 120, 6);
    stmt.finalize();
});

// 关闭数据库连接
db.close();