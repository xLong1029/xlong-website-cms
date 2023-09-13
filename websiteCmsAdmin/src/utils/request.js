import axios from 'axios'
import { GetCookie } from 'utils'

export default {
	/**
	 * [封装get和post请求函数]
	 * @url 请求地址
	 * @params 请求的参数
	 * @success 请求回调
	 * @error 请求失败回调
	 */
	HttpGet: (url, params) => {
		let conf = {
			params,
			headers: {
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache',
				token: GetCookie('xlong_token'),
				// 'x-csrf-token':GetCookie('csrfToken')
			}
		}
		return axios.get(url, conf)
			.then(res => { return Promise.resolve(res.data) })
			.catch(err => { return Promise.reject(err) })
	},
	HttpPost: (url, data) => {
		let conf = {
			headers: {
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache',
				token: GetCookie('xlong_token'),
				// 'x-csrf-token':GetCookie('csrfToken')
			}
		};
		return axios.post(url, data, conf)
			.then(res => { return Promise.resolve(res.data) })
			.catch(err => { return Promise.reject(err) })
	}
}
