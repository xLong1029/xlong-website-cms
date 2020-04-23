'use strict';

const Controller = require('egg').Controller;

class AccountServiceController extends Controller {	
	// 获取后台账户列表
	async getAccList() {
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

		this.ctx.body = await this.ctx.service.account.getAccList(params, pageNo, pageSize, sTime, eTime);
	}
	// 新增后台账户
	async addAccount() {
		const params = this.ctx.request.body;

		let res = await this.ctx.service.user.getUser({username: params.username});
		if(res.code == 200){
			res = { code: 404, data: [], msg: '用户名已存在'};
		}
		else{
			res = await this.ctx.service.account.addAccount(params);
		}
		this.ctx.body = res;
	}
	// 删除后台账户
	async delAccount() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_Admin', ids);
	}
	// 启用禁用账户
	async setEnableAcc() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Admin', enable, ids);
	}	
	// 获取后台账户详情
	async getAccDetail() {
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.account.getAccDetail({ id });
	}
	// 修改后台账户详情
	async editAccount() {
		const id = this.ctx.query.id;
		const params = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.account.editAccount(params, id);
	}
}

module.exports = AccountServiceController;