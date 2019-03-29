const Service = require('egg').Service;

class UserService extends Service {
    // 登录
    async login(params) {
        if(params && Object.keys(params).length){
            const columns = ['id', 'type', 'username', 'mobile', 'email', 'realname', 'face'];
            return this.ctx.service.sqliteDB.GetData('T_Admin', params, columns).then(res => {
                if(res.data.length) return { code: 200, data: res.data[0] };
                else return { code: 404, data: [], msg: '用户名或密码不正确' };
            })
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 获取用户资料
    async getUser(params) {
        if(params && Object.keys(params).length){
            const columns = ['id', 'type', 'username', 'mobile', 'email', 'realname', 'face'];
            return this.ctx.service.sqliteDB.GetData('T_Admin', params, columns).then(res => {
                if(res.data.length) return { code: 200, data: res.data[0] };
                else return { code: 404, data: [], msg: '用户验证信息失效，请重新登录' };
            })
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改用户资料
    async editUser(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Admin', params, [id]).then(res => res)
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 验证密码
    async checkPwd(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.GetData('T_Admin', params).then(res => res)
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改密码
    async editPwd(password, id) {
        if(password && id){
            var pwd = this.ctx.helper.cryptPwd(password);
            return this.ctx.service.sqliteDB.UpdateData('T_Admin', { password: pwd }, [id]).then(res => res)
            .catch(err => err);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = UserService;