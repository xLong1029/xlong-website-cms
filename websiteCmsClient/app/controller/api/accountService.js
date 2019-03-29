'use strict';

const Controller = require('egg').Controller;

class AccountServiceController extends Controller {
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
	
	// 获取后台账户列表
	async getAccList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = {
				id: this.ctx.query.id,
				username: this.ctx.query.username,
				mobile: this.ctx.query.mobile,
				email: this.ctx.query.email,
				type: this.ctx.query.type,
				enabledState: this.ctx.query.enabledState
			};
			// 筛选出不为空的参数
			params = this.ctx.helper.getObjNotEmpyAttr(params);

			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			const sTime =  this.ctx.query.sTime;
			const eTime = this.ctx.query.eTime;
			res = await this.ctx.service.account.getAccList(params, pageNo, pageSize, sTime, eTime);
		}
		this.ctx.body = res;
	}
	// 新增后台账户
	async addAccount() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.user.getUser({username: params.username});
			if(res.code == 200){
				res = { code: 404, data: [], msg: '用户名已存在'};
			}
			else{
				res = await this.ctx.service.account.addAccount(params);
			}
		}
		this.ctx.body = res;
	}
	// 删除后台账户
	async delAccount() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Admin', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用账户
	async setEnableAcc() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Admin', enable, ids);
		}
		this.ctx.body = res;
	}	
	// 获取后台账户详情
	async getAccDetail() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			res = await this.ctx.service.account.getAccDetail({ id });
		}
		this.ctx.body = res;
	}
	// 修改后台账户详情
	async editAccount() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			const params = this.ctx.request.body;
			res = await this.ctx.service.account.editAccount(params, id);
		}
		this.ctx.body = res;
	}
}

module.exports = AccountServiceController;