// 'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {	
	// 官网首页
	async index() {
		const data = await this.ctx.service.home.getIndex();
		await this.ctx.render('home/index.html', data);
	}

	// 公司介绍
	async company() {
		const data = await this.ctx.service.home.getCompany();
		await this.ctx.render('home/company.html', data);
	}

	// 公司团队
	async team() {
		const data = await this.ctx.service.home.getTeam();
		await this.ctx.render('home/team.html', data);
	}

	// 新闻资讯
	async news() {
		const pageNo = this.ctx.query.page;
		const data = await this.ctx.service.home.getNews(pageNo, 5);
		await this.ctx.render('home/news.html', data);
	}

	// 文章详情
	async newsDeatil() {
		const id = this.ctx.params.id;
		// 统计浏览量
		await this.ctx.service.common.countView('T_Article', id);
		const data = await this.ctx.service.home.getNewsDeatil(id);
		await this.ctx.render('home/article.html', data);
	}

	// 产品服务
	async services() {
		const data = await this.ctx.service.home.getServiceInfo();
		await this.ctx.render('home/service-intro.html', data);
	}

	// 案例展示
	async cases() {
		const data = await this.ctx.service.home.getCases();
		await this.ctx.render('home/case-list.html', data);
	}

	// 案例详情
	async caseDeatil() {
		const id = this.ctx.params.id;
		// 统计浏览量
		await this.ctx.service.common.countView('T_Case', id);
		const data = await this.ctx.service.home.getCaseDeatil(id);
		await this.ctx.render('home/article.html', data);
	}

	// 联系我们
	async contact() {
		const data = await this.ctx.service.home.getContact();
		await this.ctx.render('home/info-page.html', data);
	}

	// 单页面
	async pageCont() {
		const name = this.ctx.params.name;
		const data = await this.ctx.service.home.getPageCont(name);
		if(data.article){
			await this.ctx.render('home/page-cont.html', data);
		}
		else this.ctx.body = '该页面不存在';
	}

	// 单页面
	async icon() {
		const data = await this.ctx.service.home.getIcon();
		await this.ctx.render('home/icon.html', data);
	}
}

module.exports = HomeController;