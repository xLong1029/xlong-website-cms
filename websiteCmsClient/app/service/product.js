'use strict';

const Service = require('egg').Service;
var moment = require('moment');

class ProductService extends Service {
    // 获取产品服务列表
    async getServiceList(params, pageNo, pageSize) {
        const columns = ['id', 'title', 'content', 'summary', 'iconClass', 'caseUrl', 'showIndex', 'createTime', 'isDisable'];
        return this.ctx.service.sqliteDB.GetData('T_ServiceInfo', params, columns, null , null, pageNo, pageSize);
    }
    // 获取产品服务
    async addService(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_ServiceInfo', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改产品服务
    async editService(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_ServiceInfo', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 设置产品服务在首页显示
    async setServiceShowIndex(params, ids) {
        if(params && ids.length){
            return this.ctx.service.sqliteDB.UpdateData('T_ServiceInfo', params, ids);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取案例分类列表
    async getCateList(params, pageNo, pageSize) {
        const columns = ['id', 'categoryName', 'createTime', 'isDisable'];
        return this.ctx.service.sqliteDB.GetData('T_CaseCate', params, columns, null , null, pageNo, pageSize);
    }
    // 获取案例分类
    async addCate(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_CaseCate', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改案例分类
    async editCate(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_CaseCate', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 获取分类名称
    async getCateName(id) {
        if(id){
            return this.ctx.service.sqliteDB.GetData('T_CaseCate', { id }).then(res => {
                let row = res.data[0];
                return { code: 200, data: row };
            }).catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取案例列表
    async getCaseList(params, pageNo, pageSize, sTime, eTime) {
        let sql = `SELECT T_Case.id, T_Case.categoryId, T_Case.title, T_Case.imgUrl, T_Case.isDisable, T_Case.projectLeader, T_Case.viewCount, date(T_Case.createTime) AS createTime, T_Case.content, date(T_Case.finishedTime) AS finishedTime, T_Case.metaKeywords, T_Case.metaDescription, T_CaseCate.categoryName FROM T_Case, T_CaseCate WHERE T_Case.categoryId = T_CaseCate.id`
        if(params.id){
            sql += ` AND T_Case.id = ${params.id}`;
        }
        if(params.categoryId){
            sql += ` AND T_Case.categoryId = ${params.categoryId}`;
        }
        if(params.enabledState){
            sql += ` AND T_Case.isDisable = ${params.enabledState == 2 ? 1 : 0}`;
        }
        // 模糊查询
        if(params.title){
            sql += ` AND T_Case.title LIKE '%${params.title}%'`;   
        }
        // 日期查询
        if(sTime){
            sTime = moment(sTime).format('YYYY-MM-DD HH:mm:ss');
            sql += ` AND T_Case.createTime >= '${sTime}'`;
        }
        if(eTime){
            eTime = moment(sTime).format('YYYY-MM-DD') + '23:59:59';
            sql += ` AND T_Case.createTime <= '${eTime}'`;
        }
        sql += ` ORDER BY T_Case.createTime DESC`;

        return this.ctx.service.sqliteDB.SQLiteQuery(sql).then(res =>{
            if(pageNo && pageSize){
                const resLength = res.data.length;
                if(resLength){
                    let page = {
                        page: parseInt(pageNo),
                        size: parseInt(pageSize),
                        pages: Math.ceil(resLength / pageSize),
                        count: resLength
                    };
                    sql += ` LIMIT ${pageSize} OFFSET ${(pageNo - 1)*pageSize}`
                    return this.ctx.service.sqliteDB.SQLiteQuery(sql).then(res => {
                        return { code: 200, data: res.data, page }
                    }).catch(err => err);
                }
                // 无数据可分页
                else return { code: 200, data: [], page: {} };
            }
            else return { code: 200, data: res.data };
        }).catch(err => err);
    }
    // 获取案例详情
    async getCaseDetail(id) {
        const columns = ['categoryId', 'title', 'imgUrl', 'projectLeader', 'viewCount', 'createTime', 'content', 'finishedTime', 'metaKeywords', 'metaDescription'];

        return this.ctx.service.sqliteDB.GetData('T_Case', { id }, columns).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        })
        .catch(err => err);
    }
    // 新增案例
    async addCase(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_Case', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改案例详情
    async editCase(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Case', params , [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = ProductService;