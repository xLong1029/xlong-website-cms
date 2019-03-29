'use strict';

const Controller = require('egg').Controller;
const ms = require('ms');

class UserServiceController extends Controller {
	// session中token是否存在
	async tokenExist() {
		const sessionToken = this.ctx.session.token;
		const token = this.ctx.request.header.token;
		if(sessionToken && sessionToken == token) return true;
		else{
			// 清空用户信息
			this.ctx.session.user = null;
			return false;
		}
	}

	// 登录
	async login() {		
		const params = this.ctx.request.body;
		// 加密验证用户
		params.password = this.ctx.helper.cryptPwd(params.password);
		let res = await this.ctx.service.user.login(params);
		if(res.code == 200){
			// 随机生成token值存储session
			this.ctx.session.token = this.ctx.helper.getRandString(20);
			this.ctx.session.userId = res.data.id;
			res.data.token = this.ctx.session.token;
		}
		this.ctx.body = res;
	}
	// 验证token并获取用户信息
	async getUserInfo() {
		const token = this.ctx.query.token;
		const sessionToken = this.ctx.session.token;
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		if(sessionToken && sessionToken == token){
			res = await this.ctx.service.user.getUser({ id: this.ctx.session.userId });
			// 延长30分钟过期时间
			this.ctx.session.maxAge = 30 * 60 * 1000;
		}
		else{
			// 清空用户信息
			this.ctx.session.user = null;
		}
		this.ctx.body = res;		
	}
	// 修改个人资料
	async editProfile() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = this.ctx.request.body;
			params = this.ctx.helper.objOmit(params, ['id', 'username', 'type']);
			res = await this.ctx.service.user.editUser(params, this.ctx.session.userId);
		}
		this.ctx.body = res;		
	}

	// 修改密码
	async changePwd() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = this.ctx.request.body;

			// 验证密码
			res = await this.ctx.service.user.checkPwd({
				password: this.ctx.helper.cryptPwd(params.oldPassword),
				id: this.ctx.session.userId
			});
			if(res.code == 200 && res.data.length){
				// 修改密码
				res = await this.ctx.service.user.editPwd(params.newPassword, this.ctx.session.userId);
			}
			else{
				res = { code: 404, msg: '旧密码不正确！请重新输入'};
				this.ctx.body = res;
				return false;
			}			
		}
		this.ctx.body = res;		
	}
}

module.exports = UserServiceController;