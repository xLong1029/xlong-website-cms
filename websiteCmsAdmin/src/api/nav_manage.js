import request from 'utils/request.js'

export default {
  // 获取导航列表
  GetNavList: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ClientService/Navgation/GetList`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改导航
  EditNav: (params, id) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ClientService/Navgation/EditNav?id=${id}`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 新增导航
  AddNav: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ClientService/Navgation/AddNav`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除导航
  DelNav: (params) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ClientService/Navgation/DelNav`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 启用禁用导航
  SetEnableNav: (enable, ids) => {
    return new Promise((resolve, reject) => {
      request.HttpPost(`/api/WebsiteCms/ClientService/Navgation/SetEnable?enable=${enable}`, ids)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
