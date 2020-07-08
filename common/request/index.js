import Request from './request'
import apiList from './shopro'
import store from '@/common/store/index.js'

export default function api(url, data = {}) {
	const request = new Request();
	let api = getApiObj(url);
	request.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
		if (api.auth) {
			let token = uni.getStorageSync('token');
			if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
				cancel('token 不存在'); // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
				store.commit('LOGIN_TIP', true)
				store.commit('OUT_LOGIN');
			}
		}
		if (uni.getStorageSync('token')) {
			config.header.token = uni.getStorageSync('token');
		}
		return config
	});

	request.interceptor.response((response) => { /* 请求之后拦截器 */
		if (response.data.code === 0) { // 服务端返回的状态码不等于200，则reject()
			uni.showToast({
				title: response.data.msg || '请求出错,稍后重试',
				icon: 'none',
				duration: 1000,
				mask: true
			});
		}

		if (response.data.code === 401) { // 服务端返回的状态码不等于200，则reject()
			uni.removeStorageSync('token');
			store.commit('LOGIN_TIP', true)
		}
		// if (response.config.custom.verification) { // 演示自定义参数的作用
		//   return response.data
		// }
		return response
	}, (response) => { // 预留可以日志上报
		return response
	})

	return request.request({
		url: api.url,
		data,
		method: api.method
	})

}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
