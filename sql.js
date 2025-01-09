const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('characters.db');

// 使用 serialize 方法确保数据库操作按顺序执行
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS character");
    db.run("CREATE TABLE character (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, destiny TEXT, health INTEGER, attack INTEGER, defense INTEGER, speed INTEGER, energy INTEGER)");
    const stmt = db.prepare("INSERT INTO character (name, destiny, health, attack, defense, speed, energy) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run("开拓者•毁灭", "毁灭", 1203, 620, 460, 100, 120);
    stmt.finalize();

    db.run("DROP TABLE IF EXISTS light_cone");
    db.run("CREATE TABLE light_cone (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, destiny TEXT, health INTEGER, attack INTEGER, defense INTEGER, description TEXT)");
    const lightConeStmt = db.prepare("INSERT INTO light_cone (name, destiny, health, attack, defense, description) VALUES (?, ?, ?, ?, ?, ?)");
    lightConeStmt.run("在蓝天下", "毁灭", 952, 476, 330, "使装备者攻击力提高【16%/20%/24%/28%/32%】，当装备者消灭敌方目标后，暴击率提高【12%/15%/18%/21%/24%】，持续3回合。");
    lightConeStmt.finalize();
});

// 关闭数据库连接
db.close();