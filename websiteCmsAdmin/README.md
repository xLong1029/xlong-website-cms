# xlong-test-admin-vue

> a management system for testing only

## 项目说明
该项目为单页应用测试项目，请勿商用。

项目用到技术、框架与插件：Vue2.0+、iView、Less、Bmob(后端云)、Vue-quill-editor(轻量级富文本编辑器)、Vue-awesome-swiper(轮播插图)。

Bmob的图片上传SDK有跨域问题，所以改用七牛云存储，需要配置TOKEN（上传凭证）才可以上传。
*做了新更新，上传凭证算法已写好，可直接使用或进行修改（一般不建议在前端直接生成TOKEN，这里仅作测试使用）。

七牛云存储在线上传凭证地址：http://jsfiddle.net/gh/get/extjs/4.2/icattlecoder/jsfiddle/tree/master/uptoken?ref=developer.qiniu.com

## 部分项目运行截图
* 登录界面

![Image text](static/images/screen-1.gif)

* 个人资料\修改密码

![Image text](static/images/screen-2.gif)

* 图片上传功能

![Image text](static/images/screen-3.gif)

* 图片裁剪功能

![Image text](static/images/screen-7.gif)

* 自定义侧边栏功能

![Image text](static/images/screen-4.gif)

* 账户管理功能

![Image text](static/images/screen-5.gif)

* 版块管理功能

![Image text](static/images/screen-6.gif)

## 安装项目依赖包
npm install

## 启动项目 端口:6060
npm run dev

## 项目打包
npm run build

## 项目目录
api ----- api目录，专门用来封装api数据请求接口

assets ----- 前端静态资源目录，包括公用css、特殊css、images静态图片、pic大图、js文件、jQuery插件等

bmob ----- 后端云目录，专门用来存放bmob后端云方法

common ----- 专门用来存放一些通用方法、常量

components ----- 专门存放项目中的vue组件，包括公用组件、各页面的功能组件

mixins ----- 专门用来存放混合对象，高效的实现组件内容的复用

mock ----- 专门用来存放一些本地的模拟数据

qiniu ----- 七牛云存储上传凭证算法实现，仅做测试学习使用

qullEditor ----- 专门用来存放富文本编辑器Vue-quill-editor的图片上传配置文件

router ----- 路由目录，专门用来存放页面跳转路由文件

store ----- 仓库目录，数据源存储

theme ----- 主题目录，专门用来存放iView的定制主题样式

pages ----- 项目的页面目录，专门用来存放各页面

* 组件

Loading.vue ----- 封装iView的加载效果组件

LocatePath.vue ----- 封装iView面包屑组件

MenuTop.vue ----- 封装iView菜单组件的顶部菜单组件

Sidebar.vue ----- 有2个，一个是封装iView菜单组件的侧边栏，另一个是重写的自定义侧边栏组件

FuzzyQuery.vue ----- 模糊查询组件

InputAndSelect.vue ----- 可输入下拉框组件

SingleImage.vue ----- 封装iView文件上传的单图片上传组件

MultipleImage.vue ----- 封装iView文件上传的多图片上传组件

ShowImage.vue ----- 自定义图片展示组件

* API数据来源

bmob后端云

* 作者联系方式	
	
QQ：381612175
	
github：https://github.com/xLong1029/

站酷主页：http://xlong.zcool.com.cn/

UI中国：http://i.ui.cn/ucenter/358591.html

* 此项目做学习Vuejs测试使用，有什么问题可联系我讨论
