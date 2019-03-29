'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ClientServiceController extends Controller {
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

	// 获取友情链接列表
	async getFLinkList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
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
			res = await this.ctx.service.client.getFLinkList(params, pageNo, pageSize, sTime, eTime);
		}
		this.ctx.body = res;
	}
	// 修改友情链接
	async editFLink() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const id = this.ctx.query.id;
			res = await this.ctx.service.client.editFLink(params, id);
		}
		this.ctx.body = res;
	}
	// 新增友情链接
	async addFLink() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.addFLink(params);
		}
		this.ctx.body = res;
	}
	// 删除友情链接
	async delFLink() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_FriendlyLink', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用友情链接
	async setEnableFLink() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_FriendlyLink', enable, ids);
		}
		this.ctx.body = res;
	}
	
    // 获取导航列表
	async getNavList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			res = await this.ctx.service.client.getNavList(params, pageNo, pageSize);
		}
		this.ctx.body = res;
	}
	// 修改导航
	async editNav() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const id = this.ctx.query.id;
			res = await this.ctx.service.client.editNav(params, id);
		}
		this.ctx.body = res;
	}
	// 新增导航
	async addNav() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.addNav(params);
		}
		this.ctx.body = res;
	}
	// 删除导航
	async delNav() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Navigation', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用导航
	async setEnableNav() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Navigation', enable, ids);
		}
		this.ctx.body = res;
	}

	// 获取轮播图
	async getBannerList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const type = this.ctx.query.type;
			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			res = await this.ctx.service.client.getBannerList({ type }, pageNo, pageSize);
		}
		this.ctx.body = res;		
	}
	// 修改轮播图
	async editBanner() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const id = this.ctx.query.id;
			res = await this.ctx.service.client.editBanner(params, id);
		}
		this.ctx.body = res;
	}
	// 新增轮播图
	async addBanner() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.addBanner(params);
		}
		this.ctx.body = res;
	}
	// 删除轮播图
	async delBanner() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Banner', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用轮播图
	async setEnableBanner() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Banner', enable, ids);
		}
		this.ctx.body = res;
	}
	

	// 获取底部信息
	async getFooterInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			res = await this.ctx.service.client.getFooterInfo();
		}
		this.ctx.body = res;
	}
	// 修改底部信息
	async editFooterInfo() {		
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.editFooterInfo(params);
		}
		this.ctx.body = res;
	}

	// 获取站点信息
	async getSiteInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			res = await this.ctx.service.client.getSiteInfo();
		}
		this.ctx.body = res;
	}
	// 修改站点信息
	async editSiteInfo() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.editSiteInfo(params);
		}
		this.ctx.body = res;
	}

	// 获取单页面列表
	async getPageContList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
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
			res = await this.ctx.service.client.getPageContList(params, pageNo, pageSize, sTime, eTime);
		}
		this.ctx.body = res;
	}
	// 删除单页面
	async delPageCont() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_PageContent', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用单页面
	async setEnablePageCont() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_PageContent', enable, ids);
		}
		this.ctx.body = res;
	}
	// 获取单页面详情
	async getPageContDetail() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			res = await this.ctx.service.client.getPageContDetail({ id });
		}
		this.ctx.body = res;
	}
	// 新增单页面
	async addPageCont() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.client.getPageContDetail({ name: params.name });
			if(res.code == 200){
				res = { code: 404, data: [], msg: '链接名称已存在'};
			}
			else{
				params.createAdminId = this.ctx.session.userId;
				res = await this.ctx.service.client.addPageCont(params);
			}
		}
		this.ctx.body = res;
	}
	// 修改单页面
	async editPageCont() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			const params = this.ctx.request.body;

			params.updateAdminId = this.ctx.session.userId;
			params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
			res = await this.ctx.service.client.editPageCont(params, id);
		}
		this.ctx.body = res;
	}
}

module.exports = ClientServiceController;