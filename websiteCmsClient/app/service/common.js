'use strict';

const Service = require('egg').Service;

class CommonService extends Service {
    // 获取公司介绍
    async getCompanyContent() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'companyContent' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }
    // 获取公司简介
    async getCompanyIntro() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'companyIntro' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }
    // 获取公司介绍封面
    async getCompanyImg() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'companyImg' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取底部二维码图片
    async getQrcodeImg() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'qrcodeImg' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取底部联系方式
    async getContactWay() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'contactWay' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取底部公司地址
    async getCompanyAddr() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'companyAddr' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取站点地址
    async getWebsite() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'website' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取备案信息
    async getWebRecordInfo() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'webRecordInfo' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取网站LOGO
    async getLogo() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'logo' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取公司名称
    async getCompanyName() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'companyName' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取站点关键词
    async getMetaKeywords() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'metaKeywords' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取站点描述
    async getMetaDescription() {
        return this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'metaDescription' }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        }).catch(err => err);
    }

    // 获取单页面列表
    async getSinglePageList(params) {
        return this.ctx.service.sqliteDB.GetData('T_PageContent', params);
    }
    // 获取单页面内容
    async getSinglePageContent(id) {
        return this.ctx.service.sqliteDB.GetData('T_PageContent', { id }).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        })
        .catch(err => err);
    }

    // 统计浏览量
    async countView(tableName, id) {
        if(tableName && id){
            let sql = `UPDATE ${tableName} SET viewCount = viewCount + 1 WHERE id = ${id}`;
            return this.ctx.service.sqliteDB.SQLiteQuery(sql);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    
    // 设置启用或者禁用记录
    async setEnableOrDisable(tableName, enable, ids) {
        if(tableName && enable && ids.length){
            // console.log(111,enable);
            let isDisable = enable == 2 ? 1 : 0;
            return this.ctx.service.sqliteDB.UpdateData(tableName, { isDisable }, ids);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 删除记录
    async deleteData(tableName, ids) {
        if(tableName && ids.length){
            return this.ctx.service.sqliteDB.DeleteData(tableName, ids);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = CommonService;