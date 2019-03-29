const Service = require('egg').Service;

class HomeService extends Service {
    // 设置页码
    async setPage(res){
        let page = {
            previous: false,
            page: 1,
            list:[],
            next: false
        };

        // 设置页码
        if(res){
            // 不止一页
            if(res.pages > 1){
                // 当前页
                page.page = res.page;
                let omitFlag = false;
                // 页码列表
                for(let i = 0; i < res.pages; i ++){
                    if(res.pages > 6){
                        if((i + 1) > (res.pages - 3) || (i + 1) < 4){
                            page.list.push({ page: i + 1, active: i + 1 == res.page ? true : false })
                        }
                        else{
                            if(!omitFlag){
                                omitFlag = true;
                                page.list.push({ omit: true });
                            }
                        }
                    }
                    else{
                        page.list.push({ page: i + 1, active: i + 1 == res.page ? true : false })
                    }
                }
                // 有上一页
                if(res.page > 1){
                    page.previous = true;
                }
                // 有下一页
                if(res.page < res.pages){
                    page.next = true;
                }
            }
            else page.list = [{ page: 1, active: true }];
        }

        return page;
    }
    // 获取通用内容：关键词、描述内容、头部、底部信息
    async getCommonInfo() {
        let data = {};
        // 获取网站LOGO
        const logo = await this.ctx.service.common.getLogo();
        data.logo = logo.data.value;
        // 获取站点地址
        const website = await this.ctx.service.common.getWebsite();
        data.website = website.data.value;
        // 获取备案信息
        const webRecordInfo = await this.ctx.service.common.getWebRecordInfo();
        data.webRecordInfo = webRecordInfo.data.value;
        // 获取公司名称
        const companyName = await this.ctx.service.common.getCompanyName();
        data.companyName = companyName.data.value;
        // 获取页面关键词
        const keywords = await this.ctx.service.common.getMetaKeywords();
        data.keywords = keywords.data.value;
        // 获取页面描述
        const description = await this.ctx.service.common.getMetaDescription();
        data.description = description.data.value;
        // 获取导航内容
        const nav = await this.ctx.service.client.getNavList({ isDisable: 0 });
        data.nav = nav.data;
        // 获取底部信息
        const footerInfo = await this.ctx.service.client.getFooterInfo();
        data.footerInfo = footerInfo.data;
        // 获取友情连接
        const fLink = await this.ctx.service.client.getFLinkList({ isDisable: 0 });
        data.fLink = fLink.data;

        return data;
    }
    // 首页
    async getIndex() {
        let data = await this.getCommonInfo();

        data.title = `${data.companyName}官方网站`;

        const banner = await this.ctx.service.client.getBannerList({ type: 1, isDisable: 0 });
        data.banner = banner.data;

        const service = await this.ctx.service.product.getServiceList({ showIndex: 1, isDisable: 0 });
        data.service = service.data;

        const sql = `SELECT id, title, showIndex, viewCount, isDisable, imgUrl, summary, date(releaseTime) AS releaseTime, date(createTime) AS createTime FROM T_Article WHERE categoryId = 1 AND isDisable = 0 AND showIndex = 1 ORDER BY createTime DESC LIMIT 4 OFFSET 0`;
        const news = await this.ctx.service.sqliteDB.SQLiteQuery(sql);
        data.news = news.data;

        const companyIntro = await this.ctx.service.common.getCompanyIntro();
        data.companyIntro = companyIntro.data.value;

        const companyImg = await this.ctx.service.common.getCompanyImg();
        data.companyImg = companyImg.data.value;

        return data;
    }
    // 公司介绍
    async getCompany() {
        let data = await this.getCommonInfo();

        data.title = '公司介绍';
        data.breadcrumb = [{
                name: '关于我们',
                url: null
            },
            {
                name: '公司介绍',
                url: null
            }
        ];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 2, isDisable: 0 });
        data.banner = banner.data[0];

        const company = await this.ctx.service.common.getCompanyContent();
        data.content = company.data.value;

        return data;
    }
    // 公司团队
    async getTeam() {
        let data = await this.getCommonInfo();

        data.title = '团队介绍';
        data.breadcrumb = [{
                name: '关于我们',
                url: null
            },
            {
                name: '团队介绍',
                url: null
            }
        ];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 3, isDisable: 0 });
        data.banner = banner.data[0];

        const team = await this.ctx.service.info.getTeamContent();
        data.team = team.data;

        return data;
    }
    // 新闻资讯
    async getNews(pageNo, pageSize) {
        let data = await this.getCommonInfo();

        data.title = '新闻资讯';
        data.breadcrumb = [{
            name: '新闻资讯',
            url: null
        }];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 4, isDisable: 0 });
        data.banner = banner.data[0];

        let page, sql;
        if(!pageNo) pageNo = 1;

        sql = `SELECT id, title, showIndex, viewCount, isDisable, imgUrl, summary, date(releaseTime) AS releaseTime, date(createTime) AS createTime FROM T_Article WHERE categoryId = 1 AND isDisable = 0 ORDER BY createTime DESC`;
        page = await this.ctx.service.sqliteDB.GetPage(sql, pageNo, pageSize);
        data.page = await this.setPage(page.page);

        sql = `SELECT id, title, showIndex, viewCount, isDisable, imgUrl, summary, date(releaseTime) AS releaseTime, date(createTime) AS createTime FROM T_Article WHERE categoryId = 1 AND isDisable = 0 ORDER BY createTime DESC LIMIT ${pageSize} OFFSET ${(pageNo - 1)*pageSize}`;
        const news = await this.ctx.service.sqliteDB.SQLiteQuery(sql);
        data.list = news.data;

        return data;
    }
    // 文章详情
    async getNewsDeatil(id) {
        let data = await this.getCommonInfo();

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 4, isDisable: 0 });
        data.banner = banner.data[0];
        
        const sql = `SELECT title, viewCount, metaKeywords, metaDescription, author, content, date(releaseTime) AS releaseTime, date(createTime) AS createTime FROM T_Article WHERE id = ${id} `;
        const news = await this.ctx.service.sqliteDB.SQLiteQuery(sql);
        data.article = news.data[0];

        data.title = news.data[0].title;
        data.keywords = news.data[0].metaKeywords;
        data.description = news.data[0].metaDescription;
        data.breadcrumb = [{
                name: '新闻资讯',
                url: '/news'
            },
            {
                name: news.data[0].title,
                url: null
            }
        ];

        return data;
    }
    // 服务介绍
    async getServiceInfo() {
        let data = await this.getCommonInfo();

        data.title = '产品服务';
        data.breadcrumb = [{
                name: '产品服务',
                url: null
            },
            {
                name: '服务介绍',
                url: null
            }
        ];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 5, isDisable: 0 });
        data.banner = banner.data[0];

        const service = await this.ctx.service.product.getServiceList({ isDisable: 0 });
        data.list = service.data;

        return data;
    }
    // 案例列表
    async getCases() {
        let data = await this.getCommonInfo();

        data.title = '案例展示';
        data.breadcrumb = [{
                name: '产品服务',
                url: null
            },
            {
                name: '案例展示',
                url: null
            }
        ];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 6, isDisable: 0 });
        data.banner = banner.data[0];

        const category = await this.ctx.service.product.getCateList({ isDisable: 0 });
        data.category = category.data;

        if(category.data.length > 0){
            const categoryId = this.ctx.params.id;
            let caseList = [];

            if(categoryId){
                caseList = await this.ctx.service.product.getCaseList({ categoryId, enabledState: 1 });
            }
            else{
                caseList = await this.ctx.service.product.getCaseList({ enabledState: 1 });
            }
            data.list = caseList.data;
        }

        return data;
    }
    // 案例详情
    async getCaseDeatil(id) {
        let data = await this.getCommonInfo();

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 6, isDisable: 0 });
        data.banner = banner.data[0];

        const sql = `SELECT title, viewCount, metaKeywords, metaDescription, projectLeader, content, date(finishedTime) AS finishedTime, date(createTime) AS createTime FROM T_Case WHERE id = ${id} `;
        const caseCont = await this.ctx.service.sqliteDB.SQLiteQuery(sql);
        data.article = caseCont.data[0];

        data.title = caseCont.data[0].title;
        data.keywords = caseCont.data[0].metaKeywords;
        data.description = caseCont.data[0].metaDescription;
        data.title = '案例详情';
        data.breadcrumb = [{
                name: '案例展示',
                url: '/services/cases'
            },
            {
                name: caseCont.data[0].title,
                url: null
            }
        ];

        return data;
    }
    // 联系我们
    async getContact() {
        let data = await this.getCommonInfo();

        data.title = '联系我们';
        data.breadcrumb = [{
            name: '联系我们',
            url: null
        }];

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 7, isDisable: 0 });
        data.banner = banner.data[0];
        
        const contact = await this.ctx.service.info.getContactList({ isDisable: 0 });
        data.list = contact.data;

        return data;
    }
    // 单页面
    async getPageCont(name) {
        let data = await this.getCommonInfo();

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 8, isDisable: 0 });
        data.banner = banner.data[0];

        const sql = `SELECT title, showTitle, metaKeywords, metaDescription, content, date(createTime) AS createTime FROM T_PageContent WHERE name = '${name}' AND isDisable = 0`;
        const pageCont = await this.ctx.service.sqliteDB.SQLiteQuery(sql);

        if(pageCont.data.length > 0){
            data.article = pageCont.data[0];

            if(pageCont.data[0].metaKeywords) data.keywords = pageCont.data[0].metaKeywords;
            if(pageCont.data[0].metaDescription) data.description = pageCont.data[0].metaDescription;

            data.title = pageCont.data[0].title;
            data.breadcrumb = [{
                name: pageCont.data[0].title,
                url: null
            }];   
        }

        return data;
    }

    // 图标页
    async getIcon() {
        let data = await this.getCommonInfo();

        const banner = await this.ctx.service.client.getBannerList({ type:2, sectionType: 8, isDisable: 0 });
        data.banner = banner.data[0];

        data.title = '图标展示';
        data.breadcrumb = [{
            name: '图标展示',
            url: null
        }];

        return data;
    }
}

module.exports = HomeService;