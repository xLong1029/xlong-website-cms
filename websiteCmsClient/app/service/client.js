'use strict';

const Service = require('egg').Service;

class ClientService extends Service {
    // 获取友情链接列表
    async getFLinkList(params, pageNo, pageSize, sTime, eTime) {
        const columns = ['id', 'name', 'linkUrl', 'target', 'title', 'createTime', 'isDisable'];
        const vaguelyParams = ['name'];
        return this.ctx.service.sqliteDB.GetData('T_FriendlyLink', params, columns, ['createTime'], 'DESC', pageNo, pageSize, sTime, eTime, vaguelyParams);
    }

    // 新增友情链接
    async addFLink(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_FriendlyLink', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 修改友情链接
    async editFLink(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_FriendlyLink', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取导航列表
    async getNavList(params) {
        let parentId = params && params.parentId ? params.parentId : 0;
        return this.ctx.service.sqliteDB.GetData('T_Navigation', params).then(res => {
            let row = [];
            for(let i = 0; i < res.data.length; i++){
                if(res.data[i].parentId == parentId){
                    res.data[i].children = [];
                    for(let j = i + 1; j < res.data.length; j++){
                        if(res.data[i].id == res.data[j].parentId){
                            res.data[i].children.push(res.data[j]);
                        }
                    }
                    row.push(res.data[i]);
                }
            }
            return { code: 200, data: row };
        })
        .catch(err => err);
    }

    // 新增导航
    async addNav(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_Navigation', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 修改导航
    async editNav(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Navigation', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取轮播图
    async getBannerList(params, pageNo, pageSize) {        
        const columns = ['id', 'type', 'sectionType', 'sectionName', 'imgUrl', 'isDisable', 'title', 'linkUrl', 'target'];
        return this.ctx.service.sqliteDB.GetData('T_Banner', params, columns, ['createTime'], 'DESC', pageNo, pageSize);
    }

    // 新增轮播图
    async addBanner(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_Banner', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 修改轮播图
    async editBanner(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Banner', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取底部信息
    async getFooterInfo() {
        let data = {};
        const qrcodeImg = await this.ctx.service.common.getQrcodeImg();
        if(qrcodeImg.code == 200) data.qrcodeImg = qrcodeImg.data.value; 
        else return qrcodeImg;

        const contactWay = await this.ctx.service.common.getContactWay();
        if(contactWay.code == 200) data.contactWay = contactWay.data.value; 
        else return contactWay;

        const companyAddr = await this.ctx.service.common.getCompanyAddr();
        if(companyAddr.code == 200) data.companyAddr = companyAddr.data.value; 
        else return companyAddr;

        return { code: 200, data: data };
    }

    // 修改底部信息
    async editFooterInfo(params) {
        if(params && Object.keys(params).length){
            for(let i in params){
                const res = await this.ctx.service.sqliteDB.UpdateData('T_CommonInfo', { value: params[i] } , null, `key = '${i}'`);
                if(res.code != 200) return res;
            }

            return { code: 200, data: [], msg: '修改成功'}
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取站点信息
    async getSiteInfo() {
        let data = {};

        const logo = await this.ctx.service.common.getLogo();
        if(logo.code == 200) data.logo = logo.data.value; 
        else return logo;

        const companyName = await this.ctx.service.common.getCompanyName();
        if(companyName.code == 200) data.companyName = companyName.data.value; 
        else return companyName;
        
        const website = await this.ctx.service.common.getWebsite();
        if(website.code == 200) data.website = website.data.value; 
        else return website;

        const webRecordInfo = await this.ctx.service.common.getWebRecordInfo();
        if(webRecordInfo.code == 200) data.webRecordInfo = webRecordInfo.data.value; 
        else return webRecordInfo;

        const metaDescription = await this.ctx.service.common.getMetaDescription();
        if(metaDescription.code == 200) data.metaDescription = metaDescription.data.value; 
        else return metaDescription;

        const metaKeywords = await this.ctx.service.common.getMetaKeywords();
        if(metaKeywords.code == 200) data.metaKeywords = metaKeywords.data.value; 
        else return metaKeywords;

        return { code: 200, data: data };
    }

    // 修改站点信息
    async editSiteInfo(params) {
        if(params && Object.keys(params).length){
            for(let i in params){
                const res = await this.ctx.service.sqliteDB.UpdateData('T_CommonInfo', { value: params[i] } , null, `key = '${i}'`);
                if(res.code != 200) return res;
            }

            return { code: 200, data: [], msg: '修改成功'}
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取单页面列表
    async getPageContList(params, pageNo, pageSize, sTime, eTime) {
        const columns = ['id', 'title', 'name', 'showTitle', 'createTime', 'isDisable'];
        const vaguelyParams = ['title', 'name'];
        return this.ctx.service.sqliteDB.GetData('T_PageContent', params, columns, ['createTime'], 'DESC', pageNo, pageSize, sTime, eTime, vaguelyParams).then(res => res).catch(err => err);
    }
    // 获取单页面详情
    async getPageContDetail(params) {
        if(params && Object.keys(params).length){
            const columns = ['name', 'title', 'showTitle', 'createTime', 'content', 'metaKeywords', 'metaDescription'];
            return this.ctx.service.sqliteDB.GetData('T_PageContent', params, columns).then(res => {
                if(res.data.length) return { code: 200, data: res.data[0] };
                else return { code: 404, data: [], msg: '此页面不存在' };
            })
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 新增单页面
    async addPageCont(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_PageContent', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改单页面详情
    async editPageCont(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_PageContent', params , [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = ClientService;