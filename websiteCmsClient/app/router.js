'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  /* 前台路由 */
  router.get('/index', controller.home.index);
  router.get('/about/company', controller.home.company);
  router.get('/about/team', controller.home.team);
  router.get('/news/', controller.home.news);
  router.get('/news/detail/:id', controller.home.newsDeatil);
  router.get('/services/intro', controller.home.services);
  router.get('/services/cases', controller.home.cases);
  router.get('/services/cases/:id', controller.home.cases);
  router.get('/services/cases/detail/:id', controller.home.caseDeatil);
  router.get('/contact', controller.home.contact);
  router.get('/icon', controller.home.icon);
  router.get('/page/:name', app.controller.home.pageCont);
  /* 路由重定向 */
  router.redirect('/', '/index', 302);

  /* 后台路由 */
  router.get('/admin(/.+)?/', controller.admin.index);

  /* Api接口路由 */
  const checkToken = app.middleware.checkToken();
  // 身份验证
  router.post('/api/WebsiteCms/UserService/Passport/Login', controller.api.userService.login);
  router.get('/api/WebsiteCms/UserService/Passport/CheckToken', controller.api.userService.getUserInfo);
  // 用户服务
  router.get('/api/WebsiteCms/UserService/Person/GetUserInfo', controller.api.userService.getUserInfo);
  router.post('/api/WebsiteCms/UserService/Person/EditProfile', checkToken, controller.api.userService.editProfile);
  router.post('/api/WebsiteCms/UserService/Person/ChangePwd', checkToken, controller.api.userService.changePwd);
  // 后台账户管理
  router.get('/api/WebsiteCms/AccountService/Admin/GetList', checkToken, controller.api.accountService.getAccList);
  router.post('/api/WebsiteCms/AccountService/Admin/SetEnable', checkToken, controller.api.accountService.setEnableAcc);
  router.post('/api/WebsiteCms/AccountService/Admin/AddAccount', checkToken, controller.api.accountService.addAccount);
  router.post('/api/WebsiteCms/AccountService/Admin/DelAccount', checkToken, controller.api.accountService.delAccount);
  router.get('/api/WebsiteCms/AccountService/Admin/GetDetail', checkToken, controller.api.accountService.getAccDetail);
  router.post('/api/WebsiteCms/AccountService/Admin/EditAccount', checkToken, controller.api.accountService.editAccount);
  // 资讯管理
  router.get('/api/WebsiteCms/ArticleService/News/GetList', checkToken, controller.api.articleService.getNewList);
  router.post('/api/WebsiteCms/ArticleService/News/SetEnable', checkToken, controller.api.articleService.setEnableNews);
  router.post('/api/WebsiteCms/ArticleService/News/SetShowIndex', checkToken, controller.api.articleService.setShowIndex);
  router.post('/api/WebsiteCms/ArticleService/News/AddArticle', checkToken, controller.api.articleService.addNews);
  router.post('/api/WebsiteCms/ArticleService/News/DelArticle', checkToken, controller.api.articleService.delNews);
  router.get('/api/WebsiteCms/ArticleService/News/GetDetail', checkToken, controller.api.articleService.getNewsDetail);
  router.post('/api/WebsiteCms/ArticleService/News/EditArticle', checkToken, controller.api.articleService.editNews);
  // 公司信息
  router.get('/api/WebsiteCms/InfoService/Compnay/GetCompanyIntro', checkToken, controller.api.infoService.getCompanyIntro);
  router.post('/api/WebsiteCms/InfoService/Compnay/EditCompanyIntro', checkToken, controller.api.infoService.editCompanyIntro);
  router.get('/api/WebsiteCms/InfoService/Team/GetContent', checkToken, controller.api.infoService.getTeamContent);
  router.post('/api/WebsiteCms/InfoService/Team/EditContent', checkToken, controller.api.infoService.editTeamContent);
  router.get('/api/WebsiteCms/InfoService/Contact/GetList', checkToken, controller.api.infoService.getContactList);
  router.post('/api/WebsiteCms/InfoService/Contact/EditContact', checkToken, controller.api.infoService.editContactInfo);
  router.post('/api/WebsiteCms/InfoService/Contact/AddContact', checkToken, controller.api.infoService.addContactInfo);
  router.post('/api/WebsiteCms/InfoService/Contact/DelContact', checkToken, controller.api.infoService.delContactInfo);
  router.post('/api/WebsiteCms/InfoService/Contact/SetEnable', checkToken, controller.api.infoService.setEnableContact);
  // 产品服务
  router.get('/api/WebsiteCms/ProductService/ServiceInfo/GetList', checkToken, controller.api.productService.getServiceList);
  router.post('/api/WebsiteCms/ProductService/ServiceInfo/EditService', checkToken, controller.api.productService.editService);
  router.post('/api/WebsiteCms/ProductService/ServiceInfo/AddService', checkToken, controller.api.productService.addService);
  router.post('/api/WebsiteCms/ProductService/ServiceInfo/DelService', checkToken, controller.api.productService.delService);
  router.post('/api/WebsiteCms/ProductService/ServiceInfo/SetEnable', checkToken, controller.api.productService.setEnableService);
  router.post('/api/WebsiteCms/ProductService/ServiceInfo/SetShowIndex', checkToken, controller.api.productService.setServiceShowIndex);
  // 案例分类
  router.get('/api/WebsiteCms/ProductService/Case/GetCateList', checkToken, controller.api.productService.getCateList);
  router.post('/api/WebsiteCms/ProductService/Case/EditCate', checkToken, controller.api.productService.editCate);
  router.post('/api/WebsiteCms/ProductService/Case/AddCate', checkToken, controller.api.productService.addCate);
  router.post('/api/WebsiteCms/ProductService/Case/DelCate', checkToken, controller.api.productService.delCate);
  router.post('/api/WebsiteCms/ProductService/Case/SetEnableCate', checkToken, controller.api.productService.setEnableCate);
  // 案例管理
  router.get('/api/WebsiteCms/ProductService/Case/GetCaseList', checkToken, controller.api.productService.getCaseList);
  router.post('/api/WebsiteCms/ProductService/Case/SetEnableCase', checkToken, controller.api.productService.setEnableCase);
  router.post('/api/WebsiteCms/ProductService/Case/AddCase', checkToken, controller.api.productService.addCase);
  router.post('/api/WebsiteCms/ProductService/Case/DelCase', checkToken, controller.api.productService.delCase);
  router.get('/api/WebsiteCms/ProductService/Case/GetCaseDetail', checkToken, controller.api.productService.getCaseDetail);
  router.post('/api/WebsiteCms/ProductService/Case/EditCase', checkToken, controller.api.productService.editCase);
  // 导航管理
  router.post('/api/WebsiteCms/ClientService/Navgation/GetList', checkToken, controller.api.clientService.getNavList);
  router.post('/api/WebsiteCms/ClientService/Navgation/EditNav', checkToken, controller.api.clientService.editNav);
  router.post('/api/WebsiteCms/ClientService/Navgation/AddNav', checkToken, controller.api.clientService.addNav);
  router.post('/api/WebsiteCms/ClientService/Navgation/DelNav', checkToken, controller.api.clientService.delNav);
  router.post('/api/WebsiteCms/ClientService/Navgation/SetEnable', checkToken, controller.api.clientService.setEnableNav);
  // Banner管理
  router.get('/api/WebsiteCms/ClientService/Banner/GetList', checkToken, controller.api.clientService.getBannerList);
  router.post('/api/WebsiteCms/ClientService/Banner/EditBanner', checkToken, controller.api.clientService.editBanner);
  router.post('/api/WebsiteCms/ClientService/Banner/AddBanner', checkToken, controller.api.clientService.addBanner);
  router.post('/api/WebsiteCms/ClientService/Banner/DelBanner', checkToken, controller.api.clientService.delBanner);
  router.post('/api/WebsiteCms/ClientService/Banner/SetEnable', checkToken, controller.api.clientService.setEnableBanner);
  // 友情链接
  router.get('/api/WebsiteCms/ClientService/FriendlyLink/GetList', checkToken, controller.api.clientService.getFLinkList);
  router.post('/api/WebsiteCms/ClientService/FriendlyLink/EditLink', checkToken, controller.api.clientService.editFLink);
  router.post('/api/WebsiteCms/ClientService/FriendlyLink/AddLink', checkToken, controller.api.clientService.addFLink);
  router.post('/api/WebsiteCms/ClientService/FriendlyLink/DelLink', checkToken, controller.api.clientService.delFLink);
  router.post('/api/WebsiteCms/ClientService/FriendlyLink/SetEnable', checkToken, controller.api.clientService.setEnableFLink);
  // 站点信息
  router.get('/api/WebsiteCms/ClientService/Site/GetSiteInfo', controller.api.clientService.getSiteInfo);
  router.post('/api/WebsiteCms/ClientService/Site/EditSiteInfo', checkToken, controller.api.clientService.editSiteInfo);
  // 底部信息
  router.get('/api/WebsiteCms/ClientService/Site/GetFooterInfo', checkToken, controller.api.clientService.getFooterInfo);
  router.post('/api/WebsiteCms/ClientService/Site/EditFooterInfo', checkToken, controller.api.clientService.editFooterInfo);
  // 单页面管理
  router.get('/api/WebsiteCms/ClientService/PageCont/GetPageContList', checkToken, controller.api.clientService.getPageContList);
  router.post('/api/WebsiteCms/ClientService/PageCont/SetEnablePageCont', checkToken, controller.api.clientService.setEnablePageCont);
  router.post('/api/WebsiteCms/ClientService/PageCont/AddPageCont', checkToken, controller.api.clientService.addPageCont);
  router.post('/api/WebsiteCms/ClientService/PageCont/DelPageCont', checkToken, controller.api.clientService.delPageCont);
  router.get('/api/WebsiteCms/ClientService/PageCont/GetPageContDetail', checkToken, controller.api.clientService.getPageContDetail);
  router.post('/api/WebsiteCms/ClientService/PageCont/EditPageCont', checkToken, controller.api.clientService.editPageCont);
  // 图片存储
  router.post('/api/WebsiteCms/StorageService/Img/Upload', checkToken, controller.api.storageService.uploadImg);
  router.get('/api/WebsiteCms/StorageService/Img/Show', controller.api.storageService.getImgFile);
};
