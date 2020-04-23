'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const util = require('util');
const path = require('path');
const readFilePromise = util.promisify(fs.readFile);

class AdminController extends Controller {
    // 后台首页
	async index() {
        this.ctx.response.type = 'html';
		let page = await readFilePromise(path.resolve(__dirname, '../public/admin/dist/index.html'));
        this.ctx.body = page;
	}
}

module.exports = AdminController;