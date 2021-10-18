/**
 * 权限入口文件
 * @param {String}  authType -权限种类
 */
// #ifdef MP
import MpAuth from './mp.js' //微信小程序
// #endif

// #ifdef H5
import H5Auth from './h5.js' //H5相关
// #endif

// #ifdef APP-VUE
import AppAuth from './app.js' //APP相关
// #endif

export default class Auth {

	constructor(authType) {
		this.authType = authType
	}

	async check() {
		let state = 0
		// #ifdef MP
		state = await new MpAuth(this.authType).checkAuth()
		// #endif
		// #ifdef H5
		state = await new H5Auth(this.authType).checkAuth()
		// #endif
		// #ifdef APP-VUE
		state = await new AppAuth(this.authType).checkAuth()
		// #endif
		return Promise.resolve(state)
	}

}
