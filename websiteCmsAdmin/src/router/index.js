import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 所有权限通用路由
export const routerMap = [
	// 后台登录
	{
		path: '/admin/login',
		name: 'Login',
		component: () => import('pages/Login/Login')
	},
	// 后台管理页
	{
		path: '/admin',
		name: 'Main',
		component: () => import('pages/Main'),
		// 路由重定向
		redirect: '/admin/Home',
		children: [
			// 后台首页
			{
				path: '/admin/Home',
				name: 'Home',
				component: () => import('pages/Home/Home'),
				meta: {
					title: '管理后台首页',
					icon: 'home'
				}
			},
			// 个人资料
			{
				path: '/admin/Profile',
				name: 'Profile',
				component: () => import('pages/Profile/Profile'),
				hidden: true
			},
			// 修改密码
			{
				path: '/admin/ChangePwd',
				name: 'ChangePwd',
				component: () => import('pages/Profile/ChangePwd'),
				hidden: true
			},
			// 账户管理
			// 后台账户列表
			{
				path: '/admin/AccoutnManage/List',
				name: 'AccoutnManage',
				component: () => import('pages/AccoutnManage/AccountList'),
				meta: {
					roles: ['admin'],
					title: '后台账户管理',
					icon: 'ios-person'
				}
			},
			// 后台账户-新增/编辑
			{
				path: '/admin/AccoutnManage/Store',
				name: 'StoreAccount',
				component: () => import('pages/AccoutnManage/StoreAccount'),
				meta: {
					roles: ['admin']
				},
				hidden: true
			},
			// 导航管理
			// 一级导航列表
			{
				path: '/admin/NavManage/FirstNav',
				name: 'NavManage',
				component: () => import('pages/NavManage/FirstNav'),
				meta: {
					roles: ['admin', 'manager'],
					title: '导航管理',
					icon: 'navicon-round'
				}
			},
			// 二级导航列表
			{
				path: '/admin/NavManage/SecondNav',
				name: 'SecondNav',
				component: () => import('pages/NavManage/SecondNav'),
				meta: {
					roles: ['admin', 'manager']
				},
				hidden: true
			},
			// Banner管理
			{
				path: '/admin/bannerManage',
				name: 'BannerManage',
				meta: {
					roles: ['admin', 'manager'],
					title: 'Banner管理',
					icon: 'image'
				},
				component: () => import('pages/SecondPane'),
				children:[
					// 首页轮播图
					{
						path: '/admin/BannerManage/IndexBanner',
						name: 'IndexBanner',
						component: () => import('pages/BannerManage/IndexBanner'),
						meta: {
							roles: ['admin', 'manager'],
							title: '首页Banner'
						}
					},
					// 单页面顶部图
					{
						path: '/admin/BannerManage/TopBanner',
						name: 'TopBanner',
						component: () => import('pages/BannerManage/TopBanner'),
						meta: {
							roles: ['admin', 'manager'],
							title: '页面顶部Banner'
						}
					}
				]
			},	
			// 资讯文章
			{
				path: '/admin/ArticleManage/List',
				name: 'ArticleManage',
				component: () => import('pages/ArticleManage/ArticleList'),
				meta: {
					roles: ['admin', 'manager', 'editor'],
					title: '新闻资讯',
					icon: 'ios-paper'
				}
			},
			// 文章存储
			{
				path: '/admin/ArticleManage/Store',
				name: 'StoreArticle',
				component: () => import('pages/ArticleManage/StoreArticle'),
				meta: {
					roles: ['admin', 'manager', 'editor']
				},
				hidden: true
			},
			// 产品服务
			{
				path: '/admin/ServiceManage/List',
				name: 'ServiceManage',
				component: () => import('pages/ServiceManage/ServiceList'),
				meta: {
					roles: ['admin', 'manager'],
					title: '产品服务',
					icon: 'folder'
				}
			},
			// 案例管理
			{
				path: '/admin/CaseManage',
				name: 'CaseManage',
				meta: {
					roles: ['admin', 'manager'],
					title: '案例管理',
					icon: 'ios-briefcase'
				},
				component: () => import('pages/SecondPane'),
				children:[
					// 案例
					{
						path: '/admin/CaseManage/CaseCate',
						name: 'CaseCate',
						component: () => import('pages/CaseManage/CaseCate'),
						meta: {
							roles: ['admin', 'manager'],
							title: '案例分类'
						}
					},
					// 案例
					{
						path: '/admin/CaseManage/CaseList',
						name: 'CaseList',
						component: () => import('pages/CaseManage/CaseList'),
						meta: {
							roles: ['admin', 'manager'],
							title: '案例列表'
						}
					},
					{
						path: '/admin/CaseManage/CaseList/Store',
						name: 'StoreCase',
						component: () => import('pages/CaseManage/StoreCase'),
						meta: {
							roles: ['admin', 'manager']
						},
						hidden: true
					}
				]
			},
			// 公司信息管理
			{
				path: '/admin/CompanyInfo',
				name: 'CompanyInfo',
				meta: {
					roles: ['admin', 'manager'],
					title: '公司信息',
					icon: 'ios-information'
				},
				component: () => import('pages/SecondPane'),
				children:[
					// 公司介绍
					{
						path: '/admin/CompanyInfo/CompanyIntro',
						name: 'CompanyIntro',
						component: () => import('pages/CompanyInfo/CompanyIntro'),
						meta: {
							roles: ['admin', 'manager'],
							title: '公司介绍'
						}
					},
					// 公司团队
					{
						path: '/admin/CompanyInfo/Team',
						name: 'Team',
						component: () => import('pages/CompanyInfo/Team'),
						meta: {
							roles: ['admin', 'manager'],
							title: '公司团队'
						}
					},
					// 联系我们
					{
						path: '/admin/CompanyInfo/Contact',
						name: 'Contact',
						component: () => import('pages/CompanyInfo/Contact'),
						meta: {
							roles: ['admin', 'manager'],
							title: '联系我们'
						}
					}
				]
			},
			// 单页面管理
			{
				path: '/admin/PageContManage/List',
				name: 'PageContManage',
				component: () => import('pages/PageContManage/PageContList'),
				meta: {
					roles: ['admin', 'manager'],
					title: '单页面管理',
					icon: 'ios-photos-outline'
				}
			},
			// 单页面存储
			{
				path: '/admin/PageContManage/Store',
				name: 'StorePageCont',
				component: () => import('pages/PageContManage/StorePageCont'),
				meta: {
					roles: ['admin', 'manager']
				},
				hidden: true
			},
			// 站点管理
			{
				path: '/admin/SiteManage/SiteInfo',
				name: 'SiteManage',
				component: () => import('pages/SecondPane'),
				meta: {
					roles: ['admin'],
					title: '站点管理',
					icon: 'ios-book'
				},
				component: () => import('pages/SecondPane'),
				children: [
					// 站点信息
					{
						path: '/admin/SiteManage/SiteInfo',
						name: 'SiteInfo',
						component: () => import('pages/SiteManage/SiteInfo'),
						meta: {
							roles: ['admin'],
							title: '站点信息'
						},
					},
					// 友情链接
					{
						path: '/admin/SiteManage/FriendlyLink',
						name: 'FriendlyLink',
						component: () => import('pages/SiteManage/FriendlyLink'),
						meta: {
							roles: ['admin', 'manager'],
							title: '友情链接'
						}
					},
					// 底部信息
					{
						path: '/admin/SiteManage/FooterInfo',
						name: 'FooterInfo',
						component: () => import('pages/SiteManage/FooterInfo'),
						meta: {
							roles: ['admin', 'manager'],
							title: '底部信息'
						},
					}
				]
			},
			// 404
			{
				path: '*',
				name: 'Err404',
				component: () => import('pages/Error/Err404'),
				meta: {
					roles: ['admin', 'manager', 'editor']
				},
				hidden: true
			}
		]
	}
]

export default new Router({
	mode: 'history',
	routes: routerMap
});
