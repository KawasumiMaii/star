# 星穹铁道角色属性查询

本项目用于查询和展示星穹铁道角色的属性信息，包括生命值、攻击力、防御力、速度和能量。

## 项目结构

-   `index.html`: 前端页面，负责展示角色信息和用户交互。
-   `script.js`: 前端 JavaScript 代码，负责获取数据、更新页面和处理用户交互。
-   `server.js`: 后端 Node.js 代码，负责提供 API 接口和处理静态文件。
-   `sql.js`: 数据库初始化脚本，用于创建数据库表和插入初始数据。
-   `package.json`: 项目依赖和脚本配置。
-   `characters.db`: SQLite 数据库文件。

## 功能

-   通过下拉框选择角色，显示该角色的详细属性。
-   支持多个角色的属性查询。

## 使用方法

1. 安装依赖：

    ```bash
    npm install
    ```
2. 初始化数据库：

    ```bash
    node sql.js
    ```
   这将创建 `characters.db` 文件并插入初始数据。
3. 启动服务器：

    ```bash
    npm start
    ```
4. 访问应用：

    在浏览器中打开 `http://localhost:3000`。

## API 接口

-   `/api/characters`: 获取所有角色名称列表。
    -   返回格式：`[{"name": "角色1"}, {"name": "角色2"}, ...]`
-   `/api/character?name=<角色名>`: 根据名称获取角色信息。
    -   返回格式：`{"id": 1, "name": "角色名", "destiny": "毁灭", "health": 1000, "attack": 500, "defense": 400, "speed": 90, "energy": 100}`
-   `/api/light_cones`: 获取所有光锥名称列表。
    -   返回格式：`[{"name": "光锥1"}, {"name": "光锥2"}, ...]`
-   `/api/light_cone?name=<光锥名>`: 根据名称获取光锥信息。
    -   返回格式：`{"id": 1, "name": "光锥名", "destiny": "毁灭", "health": 1000, "attack": 500, "defense": 400, "description": "光锥描述"}`

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT 