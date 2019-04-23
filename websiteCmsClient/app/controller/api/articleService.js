'use strict';

const Controller = require('egg').Controller;
var moment = require('moment');

class ArticleServiceController extends Controller {    
	// 获取文章列表
	async getNewList() {
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

			this.ctx.body = await this.ctx.service.article.getNewsList(params, pageNo, pageSize, sTime, eTime);
	}
	// 删除资讯
	async delNews() {
		const ids = this.ctx.request.body;

		this.ctx.body = await this.ctx.service.common.deleteData('T_Article', ids);
	}
	// 启用禁用资讯
	async setEnableNews() {
		const enable = this.ctx.query.enable;
		const ids = this.ctx.request.body;
		
		this.ctx.body = await this.ctx.service.common.setEnableOrDisable('T_Article', enable, ids);
	}
	// 设置资讯在首页显示
	async setShowIndex() {
		const isHome = this.ctx.query.isHome;
		const ids = this.ctx.request.body;
		const showIndex = isHome == 'true' ? 1 : 0;

		this.ctx.body = await this.ctx.service.article.setShowIndex({ showIndex }, ids);
  }
	// 获取资讯详情
	async getNewsDetail() {
		const id = this.ctx.query.id;

		this.ctx.body = await this.ctx.service.article.getArticleDetail(id);
	}
	// 新增资讯文章
	async addNews() {
		const params = this.ctx.request.body;

		params.createAdminId = this.ctx.session.userId;
		params.author = this.ctx.request.body.author ? this.ctx.request.body.author : '佚名';
		params.source = '管理后台录入';
		params.categoryId = 1;
		params.categoryIdPath = '1,';
		
		this.ctx.body = await this.ctx.service.article.addArticle(params);
	}
	// 修改资讯文章
	async editNews() {
		const id = this.ctx.query.id;
		const params = this.ctx.request.body;

		params.updateAdminId = this.ctx.session.userId;
		params.author = this.ctx.request.body.author ? this.ctx.request.body.author : '佚名';
		params.categoryId = 1;
		params.categoryIdPath = '1,';
		params.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
		
		this.ctx.body = await this.ctx.service.article.editArticle(params, id);
	}
}

module.exports = ArticleServiceController;