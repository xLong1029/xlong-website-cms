
/*
 * 功能 : 封装一些常用方法
 * 作者 : 罗永梅（381612175@qq.com）
 * 日期 : 2019-2-27
 * 版本 : version 1.0
 */

var crypto = require('crypto');
var moment = require('moment');

module.exports = {
    /**
	* [获取SQL中SELECT语句]
	* @tableName 表名
	* @params 传递的查询参数对象
    * @columns 返回指定列组
    * @orderBys 基于指定列组排序
    * @orderMethod 排序方式[ASC | DESC]
    * @vaguelyParams 需要模糊查询的参数
    * @sTime 筛选时间起点
    * @eTime 筛选时间终点
    * @limitRows 返回的数据数量
    * @limitOffset 从指定位置开始返回数据
	*/
    getSQL_SELECT(tableName, params, columns, orderBys, orderMethod, sTime, eTime, vaguelyParams, limitRows, limitOffset){
        let sql = `SELECT`;
        // 需要返回指定列
        if(columns && columns.length){
            columns.forEach(key => sql += ` ${key},`);
            // 去掉多余的","字符串
            sql = sql.substr(0, sql.length - 1) + ` FROM ${tableName}`;
        }
        else sql += ` * FROM ${tableName}`;
        // 查询指定字段
        if((params && Object.keys(params).length) || sTime || eTime){
            sql += ` WHERE`;
            // 日期查询
            if(sTime){
                sTime = moment(sTime).format('YYYY-MM-DD HH:mm:ss');
                sql += ` createTime >= '${sTime}' AND`;
            }
            if(eTime){
                eTime = moment(eTime).format('YYYY-MM-DD') + ' 23:59:59';
                sql += ` createTime <= '${eTime}' AND`;
            }
            // 其他字段查询
            if(params && Object.keys(params).length){
                // 记录对比次数
                let tagNum = 0;
                for(let i in params){                
                    if(vaguelyParams && tagNum < vaguelyParams.length){
                        let findParam = false;
                        for(let k = 0; k < vaguelyParams.length; k++){
                            if(vaguelyParams[k] == i){
                                sql += ` ${i} LIKE '%${params[i]}%' AND`;
                                tagNum ++;
                                findParam = true;
                                break; // forEach无法使用break
                            }
                        }
                        // 无匹配参数
                        if(!findParam){
                            if(typeof(params[i]) == 'object') sql += ` ${i} = '' AND`;
                            else  sql += ` ${i} = '${params[i]}' AND`;
                        }
                    }
                    else{
                        // console.log(params, vaguelyParams);
                        if(typeof(params[i]) == 'object') sql += ` ${i} = '' AND`;
                        else  sql += ` ${i} = '${params[i]}' AND`;
                    }
                }
            }
            // 去掉多余的" AND"字符串
            sql = sql.substr(0, sql.length - 4);
        }
        // 排序
        if(orderBys && orderBys.length){
            sql += ` ORDER BY`;
            orderBys.forEach(key => sql += ` ${key},`);
            sql = sql.substr(0, sql.length - 1);

            if(orderMethod) sql += ` ${orderMethod}`;
            else sql += ` DESC`;
        }
        // 限制返回记录条数
        if(limitRows){
            sql += ` LIMIT ${limitRows}`;
            if(limitOffset !== null || undefined){
                sql += ` OFFSET ${limitOffset}`;
            }
        }

        return sql;
    },
    /**
    * [获取SQL中UPDATE语句]
	* @tableName 表名
	* @params 传递的查询参数对象
    * @ids 指定记录的id值
    * @condition 其他条件
	*/
    getSQL_UPDATE(tableName, params, ids, condition){
        let sql = `UPDATE ${tableName} SET`;

        for(let i in params){
            if(typeof(params[i]) == 'object') sql += ` ${i} = '',`; 
            else  sql += ` ${i} = '${params[i]}',`;
        }

        if(ids && ids.length){
            sql = sql.substr(0, sql.length - 1) + ` WHERE id in(`;
            ids.forEach(key =>  sql += `${key},`);
            sql = sql.substr(0, sql.length - 1) +')';
        }
        
        else if(condition){
            sql = sql.substr(0, sql.length - 1) + ` WHERE ${condition}`
        }

        return sql;
    },
    /**
    * [获取SQL中DETELE语句]
	* @tableName 表名
    * @ids 指定记录的id值
	*/
    getSQL_DELETE(tableName, ids){
        let sql = `DELETE FROM ${tableName} WHERE id in(`;
        ids.forEach(key => sql += `${key},`);        
        sql = sql.substr(0, sql.length - 1) +')';

        return sql;
    },
    /**
    * [获取SQL中INSERT语句]
	* @tableName 表名
	* @params 传递的查询参数对象
	*/
    getSQL_INSERT(tableName, params){
        let sql = `INSERT INTO ${tableName}`;
        let columns = ' (';
        let value = ' (';
        for(let i in params){
            columns += `${i},`;
            if(i == 'createTime'){
                let now = moment().format('YYYY-MM-DD HH:mm:ss');
                value += `'${now}',`;
            }
            else value += `'${params[i]}',`;
        }
        columns = columns.substr(0, columns.length - 1) + ')';
        value = value.substr(0, value.length - 1) + ')';

        sql = sql + columns + ' VALUES' + value;
        
        // 查询返回自增id
        // sql += `; SELECT last_insert_rowid() FROM ${tableName}`;
        return sql;
    },
    /**
    * [获取参数键值对] 
    * 将{ key: value} 拆分成 obj{ key:[...], value: [...] }
	* @params 参数数组
	*/
    getParams(params){
        return { key: Object.keys(params), value: Object.values(params)};
    },
    /**
    * [判断对象的各个属性是否为空]
	* @obj 对象
	*/
    objAttrAllEmpty (obj){
        let isAllEmpty = true;
        for(let i in obj){            
            if(obj[i]){
                isAllEmpty = false;
                break;
            }
        }
        return isAllEmpty;
    },
    /**
    * [获取对象中不为空的值]
	* @obj 对象
	*/
    getObjNotEmpyAttr (obj){
        let arr = {};
        for(let i in obj){
            if(obj[i]){
                arr[i] = obj[i];
            }
        }
        return arr;
    },
    /**
	* [删除对象指定属性]
	* @obj 对象
	* @uselessKeys 无用的列组
	*/
    objOmit (obj, uselessKeys){
        uselessKeys.forEach(key =>  delete obj[key]);
        return obj;
    },
    /**
	* [随机生成字符串]
	* @start 随机位数开始位置
	* @end 结束位置
	*/
    getRandString(start, end){
        let text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890'];

        let rand = (min, max) => {
            return Math.floor(Math.max(min, Math.random() * (max + 1)));
        }

        let len = end ? rand(start, end) : start;
        let str = '';

        for(let i = 0; i < len ; i++)
        {
            let strpos = rand(0, 2);
            str += text[strpos].charAt(rand(0, text[strpos].length));
        }
        return str;
    },
    // MD5给密码加密
    cryptPwd(password){
        let key = 'XLONG1029';
        let saltPassword = password + ':' + key;    
        let result = crypto.createHash('md5').update(saltPassword).digest('hex');
        return result;
    }
};