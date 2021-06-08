/**
 * Request:请求封装
 * @property {Object} config = 私有属性，默认值
 * @property {Function} isUrl = 私有方法，url是否完整
 * @property {Function} requestBefore = 私有方法，请求前
 * @property {Function} requestAfter = 私有方法，请求后
 */
import {
	API_URL
} from '@/env'
import platform from '@/shopro/platform/index';
export default class Request {
	constructor() {
		// 默认配置
		this.config = {
			baseUrl: API_URL,
			header: {
				'content-type': 'application/json',
				'platform': platform.get()
			},
			url: '',
			data: {},
			params: {},
			method: 'GET',
			dataType: 'json',
			// #ifndef MP-ALIPAY || APP-PLUS
			responseType: 'text',
			// #endif
			custom: {},
			// #ifdef APP-PLUS
			sslVerify: false
			// #endif
		}

		/* 拦截器 */
		this.interceptor = {
			request: cb => {
				if (cb) {
					this.requestBefore = cb
				} else {
					this.requestBefore = request => request
				}
			},
			response: (cb) => {
				if (cb) {
					this.requestAfter = cb
				} else {
					this.requestAfter = response => response
				}
			}
		}
	}

	/* 判断url是否完整 */
	static isUrl(url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	static addQueryString(params) {
		let paramsData = ''
		Object.keys(params).forEach(key => {
			paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
		})
		return paramsData.substring(0, paramsData.length - 1)
	}

	/* 请求前 */
	static requestBefore(config) {
		return config
	}

	/* 请求后 */
	static requestAfter(response) {
		return response
	}

	/*设置全局配置*/
	setConfig(func) {
		return func(this.config)
	}

	/**
	 * @Function
	 * @param {Object} options - 请求配置项
	 * @prop {String} options.url - 请求路径
	 * @prop {Object} options.data - 请求参数
	 * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
	 * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
	 * @prop {Object} [options.header = config.header] - 请求header
	 * @prop {Object} [options.method = config.method] - 请求方法
	 * @returns {Promise<unknown>}
	 */
	async request(options = {}) {
		options = {
			...options,
			...this.config,
			...this.requestBefore(options)
		}
		return new Promise((resolve, reject) => {
			let mergeUrl = Request.isUrl(options.url) ? options.url : (options.baseUrl + options.url)
			if (JSON.stringify(options.params) !== '{}') {
				let query = Request.addQueryString(options.params);
				mergeUrl += mergeUrl.indexOf('?') === -1 ? `?${query}` : `&${query}`
			}
			options.url = mergeUrl
			options.success = res => {
				resolve(this.requestAfter(res.data))
			}
			options.fail = err => {
				reject(this.requestAfter(err))
			}
			uni.request(options)
		})
	}

	get(url, options = {}) {
		return this.request({
			url,
			method: 'GET',
			...options
		})
	}

	post(url, data, options = {}) {
		return this.request({
			url,
			data,
			method: 'POST',
			...options
		})
	}

}
