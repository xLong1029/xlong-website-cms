'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ProductServiceController extends Controller {
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

	// 获取产品服务列表
	async getServiceList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			if(params){
				const pageNo = this.ctx.query.pageNo;
				const pageSize = this.ctx.query.pageSize;
				res = await this.ctx.service.product.getServiceList(params, pageNo, pageSize);
			}
			else res = await this.ctx.service.product.getServiceList();
		}
		this.ctx.body = res;
	}
	// 修改产品服务
	async editService() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			const id = this.ctx.query.id;
			res = await this.ctx.service.product.editService(params, id);
		}
		this.ctx.body = res;
	}
	// 新增产品服务
	async addService() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.product.addService(params);
		}
		this.ctx.body = res;
	}
	// 删除产品服务
	async delService() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_ServiceInfo', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用产品服务
	async setEnableService() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_ServiceInfo', enable, ids);
		}
		this.ctx.body = res;
  }    
  // 设置产品服务在首页显示
	async setServiceShowIndex() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const isHome = this.ctx.query.isHome;
			const ids = this.ctx.request.body;
			const showIndex = isHome == 'true' ? 1 : 0;
			res = await this.ctx.service.product.setServiceShowIndex({ showIndex }, ids);
		}
		this.ctx.body = res;
	}
	
	// 获取案例分类列表
	async getCateList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = null;
			if(this.ctx.query.id){
				params = {
					id: this.ctx.query.id
				}
			}
			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			res = await this.ctx.service.product.getCateList(params, pageNo, pageSize);
		}
		this.ctx.body = res;
	}
	// 修改案例分类
	async editCate() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			console.log(params);
			const id = this.ctx.query.id;
			res = await this.ctx.service.product.editCate(params, id);
		}
		this.ctx.body = res;
	}
	// 新增案例分类
	async addCate() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;
			res = await this.ctx.service.product.addCate(params);
		}
		this.ctx.body = res;
	}
	// 删除案例分类
	async delCate() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_CaseCate', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用案例分类
	async setEnableCate() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_CaseCate', enable, ids);
		}
		this.ctx.body = res;
	}
	
	// 获取案例列表
	async getCaseList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = {
				id: this.ctx.query.id,
				title: this.ctx.query.title,
				enabledState: this.ctx.query.enabledState
			};
			// 筛选出不为空的参数
			params = this.ctx.helper.getObjNotEmpyAttr(params);

			// 获取分类id
			if(this.ctx.query.categoryId > 0){
				params.categoryId = this.ctx.query.categoryId;
			}

			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			const sTime =  this.ctx.query.sTime;
			const eTime = this.ctx.query.eTime;
			res = await this.ctx.service.product.getCaseList(params, pageNo, pageSize, sTime, eTime);
		}
		this.ctx.body = res;
	}
	// 删除案例
	async delCase() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Case', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用案例
	async setEnableCase() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Case', enable, ids);
		}
		this.ctx.body = res;
	}
	// 获取案例详情
	async getCaseDetail() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			res = await this.ctx.service.product.getCaseDetail(id);
		}
		this.ctx.body = res;
	}
	// 新增案例
	async addCase() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;

			params.finishedTime = moment(params.finishedTime).format('YYYY-MM-DD HH:mm:ss');
			params.categoryIdPath = params.categoryId + ',';
			params.createAdminId = this.ctx.session.userId;
			params.projectLeader = this.ctx.request.body.projectLeader;
			res = await this.ctx.service.product.addCase(params);
		}
		this.ctx.body = res;
	}
	// 修改案例
	async editCase() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			const params = this.ctx.request.body;

			params.finishedTime = moment(params.finishedTime).format('YYYY-MM-DD HH:mm:ss');
			params.categoryIdPath = params.categoryId + ',';
			params.updateAdminId = this.ctx.session.userId;
			params.projectLeader = this.ctx.request.body.projectLeader;
			params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
			res = await this.ctx.service.product.editCase(params, id);
		}
		this.ctx.body = res;
	}
}

module.exports = ProductServiceController;