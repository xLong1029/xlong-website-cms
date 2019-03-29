import tools from '@/tools'

export default {
  // 上传图片
  UploadImg: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/StorageService/Img/Upload`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取底部信息
  GetFooterInfo: () => {
    return new Promise((resolve, reject) => {
      tools.HttpGet(`/api/WebsiteCms/ClientService/Site/GetFooterInfo`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改底部信息
  EditFooterInfo: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/Site/EditFooterInfo`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取站点信息
  GetSiteInfo: () => {
    return new Promise((resolve, reject) => {
      tools.HttpGet(`/api/WebsiteCms/ClientService/Site/GetSiteInfo`)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 修改站点信息
  EditSiteInfo: (params) => {
    return new Promise((resolve, reject) => {
      tools.HttpPost(`/api/WebsiteCms/ClientService/Site/EditSiteInfo`, params)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
}
