import request from 'utils/request.js'

export default {
  // 获取资讯列表
  GetList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ArticleService/News/GetList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增资讯
  AddArticle: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ArticleService/News/AddArticle`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除资讯
  DelArticle: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ArticleService/News/DelArticle`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用资讯
  SetEnable: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ArticleService/News/SetEnable?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 在首页显示
  SetShowIndex: (isHome, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ArticleService/News/SetShowIndex?isHome=${isHome}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取资讯详情
  GetDetail: (id) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ArticleService/News/GetDetail?id=${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 编辑资讯
  EditArticle: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ArticleService/News/EditArticle?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
