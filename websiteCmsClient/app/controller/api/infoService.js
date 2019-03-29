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
	
	// 获取公司介绍
	async getCompanyIntro() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			res = await this.ctx.service.info.getCompanyIntro();
		}
		this.ctx.body = res;
	}

	// 修改公司介绍
	async editCompanyIntro() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.info.editCompanyIntro(params);
		}
		this.ctx.body = res;
	}

	// 获取团队信息
	async getTeamContent() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			res = await this.ctx.service.info.getTeamContent();
		}
		this.ctx.body = res;
	}

	// 修改团队信息
	async editTeamContent() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			params.teamSkills = JSON.stringify(params.teamSkills);
			res = await this.ctx.service.info.editTeamContent(params);
		}
		this.ctx.body = res;
	}

	// 获取联系信息列表
	async getContactList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			res = await this.ctx.service.info.getContactList();
		}
		this.ctx.body = res;
	}

	// 修改联系信息
	async editContactInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const id = this.ctx.query.id;
			res = await this.ctx.service.info.editContactInfo(params, id);
		}
		this.ctx.body = res;
	}

	// 新增联系信息
	async addContactInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.info.addContactInfo(params);
		}
		this.ctx.body = res;
	}

	// 删除联系信息
	async delContactInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Contact', ids);
		}
		this.ctx.body = res;
	}

	// 启用禁用联系信息
	async setEnableContact() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Contact', enable, ids);
		}
		this.ctx.body = res;
	}
}

module.exports = AccountServiceController;