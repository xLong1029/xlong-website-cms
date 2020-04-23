/*
 * 功能 : 封装SQLite的增删改查方法。
 * 作者 : 罗永梅（381612175@param {*} qq.com）
 * 日期 : 2019-2-27
 * 版本 : version 1.0
 */
const Service = require('egg').Service;

class SqliteDB_Service extends Service {
    /**
	* [建立SQLite查询]
    * @param {*} sql SQL查询语句
	*/
    async SQLiteQuery(sql) {
        return new Promise((resolve, reject) => {
            console.log('get sql:', sql);
            this.app.db.all(sql, (err, row) => {
                if(err) reject({ code: 404, data: [], msg: err }); 
                else resolve({ code: 200, data: row }); 
            })
        });
    }
    /**
	* [获取分页]
    * @param {*} sql SQL查询语句
    * @param {*} pageNo 当前页码
    * @param {*} pageSize 每页记录条数
	*/
    async GetPage(sql, pageNo, pageSize) {
        return new Promise((resolve, reject) => {
            this.SQLiteQuery(sql).then(res => {
                const resLength = res.data.length;
                if(resLength){
                    let page = {
                        page: parseInt(pageNo),
                        size: parseInt(pageSize),
                        pages: Math.ceil(resLength / pageSize),
                        count: resLength
                    };
                    resolve({ code: 200, data: res.data, page });
                }
                // 无数据可分页
                else resolve({ code: 200, data: [], page: {} });
            }).catch(err => reject(err)); 
        });
    }
    /**
	* [获取数据]
	* @param {*} tableName 表名
	* @param {*} params 传递的查询参数
    * @param {*} columns 返回指定列组
    * @param {*} orderBys 基于指定列组排序
    * @param {*} orderMethod 排序方式[ASC | DESC]
    * @param {*} pageNo 当前页码
    * @param {*} pageSize 返回指定记录条数
    * @param {*} sTime 筛选时间起点
    * @param {*} eTime 筛选时间终点
    * @param {*} vaguelyParams 模糊查询的参数
	*/
    async GetData(tableName, params, columns, orderBys, orderMethod, pageNo, pageSize, sTime, eTime, vaguelyParams) {
        return new Promise((resolve, reject) => {
            // console.log(vaguelyParams);
            let sql = this.ctx.helper.getSQL_SELECT(tableName, params, columns, orderBys, orderMethod, sTime, eTime, vaguelyParams);
            if(pageNo && pageSize){                
                // 获取页码
                this.GetPage(sql, pageNo, pageSize).then(res => {
                    if(res.data.length){
                        const page = res.page;
                        // 获取分页数据
                        // 限制数量
                        sql = this.ctx.helper.getSQL_SELECT(tableName, params, columns, orderBys, orderMethod, sTime, eTime, vaguelyParams, pageSize, (pageNo - 1)*pageSize);
                        this.SQLiteQuery(sql).then(res => resolve({ code: 200, data: res.data, page })).catch(err => reject(err));
                    }
                    else resolve(res);
                }).catch(err => reject(err));
            }
            else{
                
                this.SQLiteQuery(sql).then(res => resolve(res)).catch(err => reject(err));
            }
        });
    }
    /**
	* [更新数据]
	* @param {*} tableName 表名
	* @param {*} params 传递的查询参数对象
    * @param {*} ids 指定记录的id值
    * @param {*} condition 没有id情况下的其他条件
	*/
    async UpdateData(tableName, params, ids, condition) {
        return new Promise((resolve, reject) => {
            const sql = this.ctx.helper.getSQL_UPDATE(tableName, params, ids, condition);
            this.SQLiteQuery(sql).then(res => resolve(res)).catch(err => reject(err));
        });
    }
    /**
	* [删除数据]
	* @param {*} tableName 表名
    * @param {*} ids 指定记录的id值
	*/
    async DeleteData(tableName, ids) {
        return new Promise((resolve, reject) => {
            const sql = this.ctx.helper.getSQL_DELETE(tableName, ids);
            this.SQLiteQuery(sql).then(res => resolve(res)).catch(err => reject(err));
        });
    }
    /**
	* [插入一行数据]
	* @param {*} tableName 表名
	* @param {*} params 传递的查询参数对象
	*/
    async InsertData(tableName, params) {
        return new Promise((resolve, reject) => {
            const sql = this.ctx.helper.getSQL_INSERT(tableName, params);
            this.SQLiteQuery(sql).then(res => resolve(res)).catch(err => reject(err));
        });
    }
}

module.exports = SqliteDB_Service;