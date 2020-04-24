'use strict';

const Service = require('egg').Service;

class AccountService extends Service {
    // 获取后台账户列表
    async getAccList(params, pageNo, pageSize, sTime, eTime) {
        const columns = ['id', 'username', 'realname', 'type',  'mobile', 'email', 'createTime', 'isDisable'];
        const vaguelyParams = ['username'];
        // 替换enabledState为isDisable
        if(params.enabledState){
            params.isDisable = this.ctx.query.enabledState == 2 ? 1 : 0;
            delete params['enabledState'];
        }
        return this.ctx.service.sqliteDB.GetData('T_Admin', params, columns, ['createTime'], 'DESC', pageNo, pageSize, sTime, eTime, vaguelyParams).then(res => res).catch(err => err);
    }
    // 获取后台账户详情
    async getAccDetail(params) {
        if(params && Object.keys(params).length){
            const columns = ['id', 'type', 'username', 'mobile', 'email', 'realname', 'face', 'createTime'];
            return this.ctx.service.sqliteDB.GetData('T_Admin', params, columns).then(res => {
                return { code: 200, data: res.data[0] };
            });
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 新增后台账户
    async addAccount(params) {
        if(params && Object.keys(params).length){
            if(params.password){
                params.password = this.ctx.helper.cryptPwd(params.password);
            }
            else{
                // 默认密码是123456
                params.password = this.ctx.helper.cryptPwd(123456);
            }
            params.type = parseInt(params.type);
            return this.ctx.service.sqliteDB.InsertData('T_Admin', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改后台账户详情
    async editAccount(params, id) {
        if((params && Object.keys(params).length) && id){
            let p = {
                username: params.username,
                realname: params.realname,
                face: params.face,
                type: params.type,
                mobile: params.mobile,
                email: params.email
            }
            if(params.password){
                p.password = this.ctx.helper.cryptPwd(params.password);
            }
            return this.ctx.service.sqliteDB.UpdateData('T_Admin', p , [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = AccountService;