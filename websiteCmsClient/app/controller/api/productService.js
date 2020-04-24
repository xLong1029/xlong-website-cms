'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ProductServiceController extends Controller {
	// 获取产品服务列表
	async getServiceList() {
		const params = this.ctx.request.body;

		let res = {};
		if(params){
			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			res = await this.ctx.service.product.getServiceList(params, pageNo, pageSize);
		}
		else res = await this.ctx.service.product.getServiceList();

		this.ctx.body = res;
	}
	// 修改产品服务
	async editService() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.product.editService(params, id);
	}
	// 新增产品服务
	async addService() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.product.addService(params);
	}
	// 删除产品服务
	async delService() {
		const ids = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.common.deleteData('T_ServiceInfo', ids);
	}
	// 启用禁用产品服务
	async setEnableService() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_ServiceInfo', enable, ids);
  }    
  // 设置产品服务在首页显示
	async setServiceShowIndex() {
		const isHome = this.ctx.query.isHome;
		const ids = this.ctx.request.body;
		const showIndex = isHome == 'true' ? 1 : 0;
		
		this.ctx.body = await this.ctx.service.product.setServiceShowIndex({ showIndex }, ids);
	}
	
	// 获取案例分类列表
	async getCateList() {
		let params = null;
		if(this.ctx.query.id){
			params = {
				id: this.ctx.query.id
			}
		}
		const pageNo = this.ctx.query.pageNo;
		const pageSize = this.ctx.query.pageSize;

		this.ctx.body = await this.ctx.service.product.getCateList(params, pageNo, pageSize);
	}
	// 修改案例分类
	async editCate() {
		const params = this.ctx.request.body;
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.product.editCate(params, id);
	}
	// 新增案例分类
	async addCate() {
		const params = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.product.addCate(params);
	}
	// 删除案例分类
	async delCate() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_CaseCate', ids);
	}
	// 启用禁用案例分类
	async setEnableCate() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_CaseCate', enable, ids);
	}
	
	// 获取案例列表
	async getCaseList() {
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

		this.ctx.body = await this.ctx.service.product.getCaseList(params, pageNo, pageSize, sTime, eTime);
	}
	// 删除案例
	async delCase() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_Case', ids);
	}
	// 启用禁用案例
	async setEnableCase() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Case', enable, ids);
	}
	// 获取案例详情
	async getCaseDetail() {
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.product.getCaseDetail(id);
	}
	// 新增案例
	async addCase() {
		let params = this.ctx.request.body;

		params.finishedTime = moment(params.finishedTime).format('YYYY-MM-DD HH:mm:ss');
		params.categoryIdPath = params.categoryId + ',';
		params.createAdminId = this.ctx.session.userId;
		params.projectLeader = this.ctx.request.body.projectLeader;

		this.ctx.body = await this.ctx.service.product.addCase(params);
	}
	// 修改案例
	async editCase() {
		const id = this.ctx.query.id;
		let params = this.ctx.request.body;

		params.finishedTime = moment(params.finishedTime).format('YYYY-MM-DD HH:mm:ss');
		params.categoryIdPath = params.categoryId + ',';
		params.updateAdminId = this.ctx.session.userId;
		params.projectLeader = this.ctx.request.body.projectLeader;
		params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		
		this.ctx.body = await this.ctx.service.product.editCase(params, id);
	}
}

module.exports = ProductServiceController;