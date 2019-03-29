// 启动自定义
class AppBootHook {
    constructor(app) {
      this.app = app;
      
    }

    async didReady() {
        // 应用已经启动完毕
        
        const sqlite3 = require('sqlite3').verbose();
        
        // 连接数据库
        const db = new sqlite3.Database('./app/database/huajian.db', (err) => {
            if (err) {
                console.log('无法连接数据库:', err);
            }
            else{
                console.log('数据库连接成功');
            }
        });

        this.app.db = db;
    }
}

module.exports = AppBootHook;