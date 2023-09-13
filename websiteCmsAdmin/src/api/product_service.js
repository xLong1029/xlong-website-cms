import request from 'utils/request.js'

export default {
  // 获取产品服务列表
  GetServiceList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ProductService/ServiceInfo/GetList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改产品服务
  EditService: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/ServiceInfo/EditService?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增产品服务
  AddService: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/ServiceInfo/AddService`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除产品服务
  DelService: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/ServiceInfo/DelService`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用产品服务
  SetEnableService: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/ServiceInfo/SetEnable?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 在首页显示
  SetShowIndex: (isHome, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/ServiceInfo/SetShowIndex?isHome=${isHome}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取案例分类列表
  GetCateList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ProductService/Case/GetCateList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改案例分类
  EditCate: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/EditCate?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增案例分类
  AddCate: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/AddCate`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除案例分类
  DelCate: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/DelCate`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用案例分类
  SetEnableCate: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/SetEnableCate?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取案例列表
  GetCaseList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ProductService/Case/GetCaseList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增案例
  AddCase: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/AddCase`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除案例
  DelCase: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/DelCase`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用案例
  SetEnableCase: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/SetEnableCase?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取案例详情
  GetCaseDetail: (id) => {
    return new Promise((resolve, reject) => {
      request.HttpGet(`/api/WebsiteCms/ProductService/Case/GetCaseDetail?id=${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 编辑案例
  EditCase: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ProductService/Case/EditCase?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
