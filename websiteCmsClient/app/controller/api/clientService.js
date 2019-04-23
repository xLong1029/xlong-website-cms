'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ClientServiceController extends Controller {
	// 获取友情链接列表
	async getFLinkList() {
		let params = this.ctx.request.body;
		params = {
			id: this.ctx.query.id,
			name: this.ctx.query.name,
			enabledState: this.ctx.query.enabledState,
			target: this.ctx.query.target
		};
		// 筛选出不为空的参数
		params = this.ctx.helper.getObjNotEmpyAttr(params);

		// 替换enabledState为isDisable
		if(params.enabledState){
			params.isDisable = this.ctx.query.enabledState == 2 ? 1 : 0;
			delete params['enabledState'];
		}

		const pageNo = this.ctx.query.pageNo;
		const pageSize = this.ctx.query.pageSize;
		const sTime =  this.ctx.query.sTime;
		const eTime = this.ctx.query.eTime;

		this.ctx.body = await this.ctx.service.client.getFLinkList(params, pageNo, pageSize, sTime, eTime);
	}
	// 修改友情链接
	async editFLink() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.client.editFLink(params, id);
	}
	// 新增友情链接
	async addFLink() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.client.addFLink(params);
	}
	// 删除友情链接
	async delFLink() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_FriendlyLink', ids);
	}
	// 启用禁用友情链接
	async setEnableFLink() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_FriendlyLink', enable, ids);
	}
	
    // 获取导航列表
	async getNavList() {
		const params = this.ctx.request.body;
		const pageNo = this.ctx.query.pageNo;
		const pageSize = this.ctx.query.pageSize;

		this.ctx.body = await this.ctx.service.client.getNavList(params, pageNo, pageSize);
	}
	// 修改导航
	async editNav() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.client.editNav(params, id);		
	}
	// 新增导航
	async addNav() {
		const params = this.ctx.request.body;
		this.ctx.body = await this.ctx.service.client.addNav(params);
	}
	// 删除导航
	async delNav() {
		const ids = this.ctx.request.body;
		this.ctx.body = await this.ctx.service.common.deleteData('T_Navigation', ids);
	}
	// 启用禁用导航
	async setEnableNav() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Navigation', enable, ids);
	}

	// 获取轮播图
	async getBannerList() {
		const type = this.ctx.query.type;
		const pageNo = this.ctx.query.pageNo;
		const pageSize = this.ctx.query.pageSize;

		this.ctx.body = await this.ctx.service.client.getBannerList({ type }, pageNo, pageSize);		
	}
	// 修改轮播图
	async editBanner() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.client.editBanner(params, id);
	}
	// 新增轮播图
	async addBanner() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.client.addBanner(params);
	}
	// 删除轮播图
	async delBanner() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_Banner', ids);
	}
	// 启用禁用轮播图
	async setEnableBanner() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Banner', enable, ids);
	}
	

	// 获取底部信息
	async getFooterInfo() {
		this.ctx.body = await this.ctx.service.client.getFooterInfo();
	}
	// 修改底部信息
	async editFooterInfo() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.client.editFooterInfo(params);
	}

	// 获取站点信息
	async getSiteInfo() {
		this.ctx.body = await this.ctx.service.client.getSiteInfo();
	}
	// 修改站点信息
	async editSiteInfo() {
		const params = this.ctx.request.body;
		this.ctx.body = await this.ctx.service.client.editSiteInfo(params);
	}

	// 获取单页面列表
	async getPageContList() {
		let params = {
			id: this.ctx.query.id,
			name: this.ctx.query.name,
			title: this.ctx.query.title,
			enabledState: this.ctx.query.enabledState,
		};
		// 筛选出不为空的参数
		params = this.ctx.helper.getObjNotEmpyAttr(params);

		// 替换enabledState为isDisable
		if(params.enabledState){
				params.isDisable = this.ctx.query.enabledState == 2 ? 1 : 0;
				delete params['enabledState'];
		}

		const pageNo = this.ctx.query.pageNo;
		const pageSize = this.ctx.query.pageSize;
		const sTime =  this.ctx.query.sTime;
		const eTime = this.ctx.query.eTime;
		this.ctx.body = await this.ctx.service.client.getPageContList(params, pageNo, pageSize, sTime, eTime);
	}
	// 删除单页面
	async delPageCont() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_PageContent', ids);
	}
	// 启用禁用单页面
	async setEnablePageCont() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_PageContent', enable, ids);
	}
	// 获取单页面详情
	async getPageContDetail() {
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.client.getPageContDetail({ id });
	}
	// 新增单页面
	async addPageCont() {
		const params = this.ctx.request.body;

		let res = await this.ctx.service.client.getPageContDetail({ name: params.name });
		if(res.code == 200){
			res = { code: 404, data: [], msg: '链接名称已存在'};
		}
		else{
			params.createAdminId = this.ctx.session.userId;
			res = await this.ctx.service.client.addPageCont(params);
		}
		this.ctx.body = res;
	}
	// 修改单页面
	async editPageCont() {
		const id = this.ctx.query.id;
		const params = this.ctx.request.body;

		params.updateAdminId = this.ctx.session.userId;
		params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		this.ctx.body = await this.ctx.service.client.editPageCont(params, id);
	}
}

module.exports = ClientServiceController;