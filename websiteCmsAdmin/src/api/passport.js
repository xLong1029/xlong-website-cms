import request from 'utils/request.js'

export default {
    // 登录
    Login : (params) => {
        return new Promise((resolve,reject)=>{
			request.HttpPost('/api/WebsiteCms/UserService/Passport/Login', params)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
    },
    // 验证Token
    // token: 用户token参数
    CheckToken : (token) => {
        return new Promise((resolve,reject)=>{
			request.HttpGet(`/api/WebsiteCms/UserService/Passport/CheckToken?token=${token}`)
			.then(res => resolve(res))
			.catch(err => reject(err))
		})
    }
}
