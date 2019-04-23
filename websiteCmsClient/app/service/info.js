'use strict';

const Service = require('egg').Service;

class InfoService extends Service {
    // 获取公司介绍
    async getCompanyIntro() {
        let data = {};
        const companyImg = await this.ctx.service.common.getCompanyImg();
        if(companyImg.code == 200) data.companyImg = companyImg.data.value; 
        else return companyImg; 

        const companyIntro = await this.ctx.service.common.getCompanyIntro();
        if(companyIntro.code == 200) data.companyIntro = companyIntro.data.value;
        else return companyIntro; 

        const companyContent = await this.ctx.service.common.getCompanyContent();
        if(companyContent.code == 200) data.companyContent = companyContent.data.value;
        else return companyContent;

        return { code: 200, data: data };
    }

    // 修改公司介绍
    async editCompanyIntro(params) {
        if(params && Object.keys(params).length){
            for(let i in params){
                const res = await this.ctx.service.sqliteDB.UpdateData('T_CommonInfo', { value: params[i] } , null, `key = '${i}'`);
                if(res.code != 200) return res;
            }

            return { code: 200, data: [], msg: '修改成功'}
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取团队信息
    async getTeamContent() {
        let data = {};
        const teamIntro = await this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'teamIntro' });
        if(teamIntro.code == 200){
            data.teamIntro = teamIntro.data[0].value;
        }
        else return teamIntro; 

        const teamImg = await this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'teamImg' });
        if(teamImg.code == 200){
            data.teamImg = teamImg.data[0].value;
        }
        else return teamImg; 

        const teamSkills = await this.ctx.service.sqliteDB.GetData('T_CommonInfo', { key: 'teamSkills' });
        if(teamSkills.code == 200){
            if(teamSkills.data[0].value){
                data.teamSkills = JSON.parse(teamSkills.data[0].value);
            }
            else{
                data.teamSkills = [];
            }
        }
        else return teamSkills; 

        return { code: 200, data: data };
    }

    // 修改团队内容
    async editTeamContent(params) {
        if(params && Object.keys(params).length){
            for(let i in params){
                const res = await this.ctx.service.sqliteDB.UpdateData('T_CommonInfo', { value: params[i] } , null, `key = '${i}'`);
                if(res.code != 200) return res;
            }

            return { code: 200, data: [], msg: '修改成功'}            
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 获取联系信息列表
    async getContactList(params) {
        return this.ctx.service.sqliteDB.GetData('T_Contact', params);
    }

    // 新增联系信息
    async addContactInfo(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_Contact', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }

    // 修改联系信息
    async editContactInfo(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Contact', params, [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = InfoService;