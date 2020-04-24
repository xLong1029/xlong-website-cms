import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * 固定路由
 */
export const routes = [
  // 后台登录
  {
    path: '/Login',
    name: 'Login',
    component: () => import('views/Login/Index')
  },
  // 后台管理页
  {
    path: '/',
    name: 'Main',
    component: () => import('views/Main'),
    // 路由重定向
    redirect: '/Home',
    children: [
      // 后台首页
      {
        path: '/Home',
        name: 'Home',
        component: () => import('views/Home/Index'),
        meta: {
          title: '管理后台首页',
          icon: 'md-home',
          sidebarName: 'Home'
        }
      },
      // 个人资料
      {
        path: '/Profile',
        name: 'Profile',
        component: () => import('views/Profile/Profile'),
        hidden: true
      },
      // 修改密码
      {
        path: '/ChangePwd',
        name: 'ChangePwd',
        component: () => import('views/Profile/ChangePwd'),
        hidden: true
      },
      // 账户管理
      // 后台账户列表
      {
        path: '/AccountManage/List',
        name: 'AccountManage',
        component: () => import('views/AccountManage/AccountList'),
        meta: {
          roles: ['admin'],
          title: '后台账户管理',
          icon: 'ios-person',
          sidebarName: 'AccountManage'
        }
      },
      // 后台账户-新增/编辑
      {
        path: '/AccountManage/Store',
        name: 'StoreAccount',
        component: () => import('views/AccountManage/StoreAccount'),
        meta: {
          roles: ['admin'],
          sidebarName: 'AccountManage'
        },
        hidden: true
      },
      // 导航管理
      // 一级导航列表
      {
        path: '/NavManage/FirstNav',
        name: 'NavManage',
        component: () => import('views/NavManage/FirstNav'),
        meta: {
          roles: ['admin', 'manager'],
          title: '导航管理',
          icon: 'md-menu',
          sidebarName: 'NavManage'
        }
      },
      // 二级导航列表
      {
        path: '/NavManage/SecondNav',
        name: 'SecondNav',
        component: () => import('views/NavManage/SecondNav'),
        meta: {
          roles: ['admin', 'manager'],
          sidebarName: 'NavManage'
        },
        hidden: true
      },
      // Banner管理
      {
        path: '/bannerManage',
        name: 'BannerManage',
        meta: {
          roles: ['admin', 'manager'],
          title: 'Banner管理',
          icon: 'md-image'
        },
        component: () => import('views/SecondPane'),
        children: [
          // 首页轮播图
          {
            path: '/BannerManage/IndexBanner',
            name: 'IndexBanner',
            component: () => import('views/BannerManage/IndexBanner'),
            meta: {
              roles: ['admin', 'manager'],
              title: '首页Banner',
              sidebarName: 'IndexBanner'
            }
          },
          // 单页面顶部图
          {
            path: '/BannerManage/TopBanner',
            name: 'TopBanner',
            component: () => import('views/BannerManage/TopBanner'),
            meta: {
              roles: ['admin', 'manager'],
              title: '页面顶部Banner',
              sidebarName: 'TopBanner'
            }
          }
        ]
      },
      // 资讯文章
      {
        path: '/ArticleManage/List',
        name: 'ArticleManage',
        component: () => import('views/ArticleManage/ArticleList'),
        meta: {
          roles: ['admin', 'manager', 'editor'],
          title: '新闻资讯',
          icon: 'ios-paper',
          sidebarName: 'ArticleManage'
        }
      },
      // 文章存储
      {
        path: '/ArticleManage/Store',
        name: 'StoreArticle',
        component: () => import('views/ArticleManage/StoreArticle'),
        meta: {
          roles: ['admin', 'manager', 'editor'],
          sidebarName: 'ArticleManage'
        },
        hidden: true
      },
      // 产品服务
      {
        path: '/ServiceManage/List',
        name: 'ServiceManage',
        component: () => import('views/ServiceManage/ServiceList'),
        meta: {
          roles: ['admin', 'manager'],
          title: '产品服务',
          icon: 'ios-folder',
          sidebarName: 'ServiceManage'
        }
      },
      // 案例管理
      {
        path: '/CaseManage',
        name: 'CaseManage',
        meta: {
          roles: ['admin', 'manager'],
          title: '案例管理',
          icon: 'ios-briefcase',
        },
        component: () => import('views/SecondPane'),
        children: [
          // 案例
          {
            path: '/CaseManage/CaseCate',
            name: 'CaseCate',
            component: () => import('views/CaseManage/CaseCate'),
            meta: {
              roles: ['admin', 'manager'],
              title: '案例分类',
              sidebarName: 'CaseCate'
            }
          },
          // 案例
          {
            path: '/CaseManage/List',
            name: 'CaseList',
            component: () => import('views/CaseManage/CaseList'),
            meta: {
              roles: ['admin', 'manager'],
              title: '案例列表',
              sidebarName: 'CaseList'
            }
          },
          {
            path: '/CaseManage/Store',
            name: 'StoreCase',
            component: () => import('views/CaseManage/StoreCase'),
            meta: {
              roles: ['admin', 'manager'],
              sidebarName: 'StoreCase'
            },
            hidden: true
          }
        ]
      },
      // 公司信息管理
      {
        path: '/CompanyInfo',
        name: 'CompanyInfo',
        meta: {
          roles: ['admin', 'manager'],
          title: '公司信息',
          icon: 'md-information-circle'
        },
        component: () => import('views/SecondPane'),
        children: [
          // 公司介绍
          {
            path: '/CompanyInfo/Company',
            name: 'CompanyIntro',
            component: () => import('views/CompanyInfo/CompanyIntro'),
            meta: {
              roles: ['admin', 'manager'],
              title: '公司介绍',
              sidebarName: 'CompanyIntro'
            }
          },
          // 公司团队
          {
            path: '/CompanyInfo/Team',
            name: 'Team',
            component: () => import('views/CompanyInfo/Team'),
            meta: {
              roles: ['admin', 'manager'],
              title: '公司团队',
              sidebarName: 'Team'
            }
          },
          // 联系我们
          {
            path: '/CompanyInfo/Contact',
            name: 'Contact',
            component: () => import('views/CompanyInfo/Contact'),
            meta: {
              roles: ['admin', 'manager'],
              title: '联系我们',
              sidebarName: 'Contact'
            }
          }
        ]
      },
      // 单页面管理
      {
        path: '/PageContManage/List',
        name: 'PageContManage',
        component: () => import('views/PageContManage/PageContList'),
        meta: {
          roles: ['admin', 'manager'],
          title: '单页面管理',
          icon: 'ios-photos-outline',
          sidebarName: 'PageContManage'
        }
      },
      // 单页面存储
      {
        path: '/PageContManage/Store',
        name: 'StorePageCont',
        component: () => import('views/PageContManage/StorePageCont'),
        meta: {
          roles: ['admin', 'manager'],
          sidebarName: 'PageContManage'
        },
        hidden: true
      },
      // 站点管理
      {
        path: '/SiteManage/SiteInfo',
        name: 'SiteManage',
        component: () => import('views/SecondPane'),
        meta: {
          roles: ['admin'],
          title: '站点管理',
          icon: 'ios-book'
        },
        children: [
          // 站点信息
          {
            path: '/SiteManage/SiteInfo',
            name: 'SiteInfo',
            component: () => import('views/SiteManage/SiteInfo'),
            meta: {
              roles: ['admin'],
              title: '站点信息',
              sidebarName: 'SiteInfo'
            },
          },
          // 友情链接
          {
            path: '/SiteManage/FriendlyLink',
            name: 'FriendlyLink',
            component: () => import('views/SiteManage/FriendlyLink'),
            meta: {
              roles: ['admin', 'manager'],
              title: '友情链接',
              sidebarName: 'FriendlyLink'
            }
          },
          // 底部信息
          {
            path: '/SiteManage/FooterInfo',
            name: 'FooterInfo',
            component: () => import('views/SiteManage/FooterInfo'),
            meta: {
              roles: ['admin', 'manager'],
              title: '底部信息',
              sidebarName: 'FooterInfo'
            },
          }
        ]
      },
      // 404
      {
        path: '*',
        name: 'Err404',
        component: () => import('views/Error/Err404'),
        hidden: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
