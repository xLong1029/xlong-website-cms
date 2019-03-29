'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ArticleServiceController extends Controller {
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
    
	// 获取文章列表
	async getNewList() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			let params = {
				categoryId: 1,
				id: this.ctx.query.id,
				title: this.ctx.query.title,
				enabledState: this.ctx.query.enabledState,
				isHome: this.ctx.query.isHome
			};
			// 筛选出不为空的参数
			params = this.ctx.helper.getObjNotEmpyAttr(params);

			// 替换enabledState为isDisable
			if(params.enabledState){
					params.isDisable = this.ctx.query.enabledState == 2 ? 1 : 0;
					delete params['enabledState'];
			}
			// 替换isHome为showIndex
			if(params.isHome){
					if(this.ctx.query.isHome == 'true') params.showIndex = 1;
					delete params['isHome'];
			}

			const pageNo = this.ctx.query.pageNo;
			const pageSize = this.ctx.query.pageSize;
			const sTime =  this.ctx.query.sTime;
			const eTime = this.ctx.query.eTime;
			res = await this.ctx.service.article.getNewsList(params, pageNo, pageSize, sTime, eTime);
		}
		this.ctx.body = res;
	}
	// 删除资讯
	async delNews() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.deleteData('T_Article', ids);
		}
		this.ctx.body = res;
	}
	// 启用禁用资讯
	async setEnableNews() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const enable = this.ctx.query.enable;
			const ids = this.ctx.request.body;
			res = await this.ctx.service.common.setEnableOrDisable('T_Article', enable, ids);
		}
		this.ctx.body = res;
	}
	// 设置资讯在首页显示
	async setShowIndex() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const isHome = this.ctx.query.isHome;
			const ids = this.ctx.request.body;
			const showIndex = isHome == 'true' ? 1 : 0;
			res = await this.ctx.service.article.setShowIndex({ showIndex }, ids);
		}
		this.ctx.body = res;
  }
	// 获取资讯详情
	async getNewsDetail() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			res = await this.ctx.service.article.getArticleDetail(id);
		}
		this.ctx.body = res;
	}
	// 新增资讯文章
	async addNews() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const params = this.ctx.request.body;

			params.createAdminId = this.ctx.session.userId;
			params.author = this.ctx.request.body.author ? this.ctx.request.body.author : '佚名';
			params.source = '管理后台录入';
			params.categoryId = 1;
			params.categoryIdPath = '1,';
			res = await this.ctx.service.article.addArticle(params);
		}
		this.ctx.body = res;
	}
	// 修改资讯文章
	async editNews() {
		let res = { code: 404114, data:[], msg:'用户验证信息失效，请重新登录' };
		// token存在
		if(this.tokenExist()){
			const id = this.ctx.query.id;
			const params = this.ctx.request.body;

			params.updateAdminId = this.ctx.session.userId;
			params.author = this.ctx.request.body.author ? this.ctx.request.body.author : '佚名';
			params.categoryId = 1;
			params.categoryIdPath = '1,';
			params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
			res = await this.ctx.service.article.editArticle(params, id);
		}
		this.ctx.body = res;
	}
}

module.exports = ArticleServiceController;