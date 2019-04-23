'use strict';

const Controller = require('egg').Controller;

class AccountServiceController extends Controller {	
	// 获取公司介绍
	async getCompanyIntro() {
		this.ctx.body = await this.ctx.service.info.getCompanyIntro();
	}

	// 修改公司介绍
	async editCompanyIntro() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.info.editCompanyIntro(params);
	}

	// 获取团队信息
	async getTeamContent() {
		this.ctx.body = await this.ctx.service.info.getTeamContent();
	}

	// 修改团队信息
	async editTeamContent() {
		let params = this.ctx.request.body;
		params.teamSkills = JSON.stringify(params.teamSkills);

		this.ctx.body = await this.ctx.service.info.editTeamContent(params);
	}

	// 获取联系信息列表
	async getContactList() {
		this.ctx.body = await this.ctx.service.info.getContactList();
	}

	// 修改联系信息
	async editContactInfo() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.info.editContactInfo(params, id);
	}

	// 新增联系信息
	async addContactInfo() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.info.addContactInfo(params);
	}

	// 删除联系信息
	async delContactInfo() {
		const ids = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.common.deleteData('T_Contact', ids);
	}

	// 启用禁用联系信息
	async setEnableContact() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Contact', enable, ids);
	}
}

module.exports = AccountServiceController;