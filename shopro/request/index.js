import Request from './request'
import apiList from './apis.js'
import store from '@/shopro/store/index.js'

const shoproRequest = new Request();
export default function http(
	url,
	data = {},
	toastBefore = '', // 请求前加载提示
	toastAfter = true, // 请求后错误提示
) {
	let api = getApiPath(url);
	/* 请求之前拦截器 */
	shoproRequest.interceptor.request((config, cancel) => {
		let token = uni.getStorageSync('token');
		if (api.auth && !token) {
			store.dispatch('showAuthModal');
			uni.hideLoading()
			throw (`暂未登录,已阻止此次API请求: '${api.url}'`);
		}
		token && shoproRequest.setConfig(config => {
			config.header.token = token
		})
		if (toastBefore !== '') {
			uni.showLoading({
				title: toastBefore,
				mask: true
			});
		}
		return config
	});

	/* 请求之后拦截器 */
	shoproRequest.interceptor.response((response) => {
		if (toastBefore !== '') {
			uni.hideLoading();
		}
		if (response.code === 0) {
			if (toastAfter) {
				uni.showToast({
					title: response.msg || '请求出错,稍后重试',
					icon: 'none',
					duration: 1000,
					mask: true
				});
			}

		}

		// token过期注销
		if (response.code === 401) {
			store.dispatch('logout');
			store.dispatch('showAuthModal');
			throw (`登录已过期或注销,已阻止此次API请求: '${api.url}'`);
		}
		return response
	})

	return shoproRequest.request({
		url: api.url,
		data,
		method: api.method
	})

}

// 组装接口路径
function getApiPath(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
