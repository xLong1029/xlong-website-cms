const Service = require('egg').Service;

class ArticleService extends Service {
    // 获取资讯列表
    async getNewsList(params, pageNo, pageSize, sTime, eTime) {
        const columns = ['id', 'title', 'showIndex', 'viewCount', 'createTime', 'isDisable', 'imgUrl', 'summary', 'releaseTime'];
        const vaguelyParams = ['title'];
        return this.ctx.service.sqliteDB.GetData('T_Article', params, columns, ['createTime'], 'DESC', pageNo, pageSize, sTime, eTime, vaguelyParams).then(res => res).catch(err => err);
    }
    // 获取资讯详情
    async getArticleDetail(id) {
        const columns = ['title', 'imgUrl', 'author', 'viewCount', 'createTime', 'content', 'releaseTime', 'metaKeywords', 'metaDescription'];
        return this.ctx.service.sqliteDB.GetData('T_Article', { id }, columns).then(res => {
            let row = res.data[0];
            return { code: 200, data: row };
        })
        .catch(err => err);
    }
    // 设置文章在首页显示
    async setShowIndex(params, ids) {
        if((params && Object.keys(params).length) && ids.length){
            return this.ctx.service.sqliteDB.UpdateData('T_Article', params, ids);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 新增文章
    async addArticle(params) {
        if(params && Object.keys(params).length){
            return this.ctx.service.sqliteDB.InsertData('T_Article', params);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
    // 修改文章详情
    async editArticle(params, id) {
        if((params && Object.keys(params).length) && id){
            return this.ctx.service.sqliteDB.UpdateData('T_Article', params , [id]);
        }
        else return { code: 403, data: [], msg: '缺少参数' };
    }
}

module.exports = ArticleService;