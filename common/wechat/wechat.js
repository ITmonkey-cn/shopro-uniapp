/**
 * Wechat v1.0.0
 * @Class Wechat
 * @description shopro-wechat 1.0.0 wehcat第三方登录组件
 * @Author llidongtony
 * @Date 2020-02-19
 * @Email lidongtony@qq.com
 */
import api from '@/common/request/index'
import store from '@/common/store'
import {
	API_URL
} from '@/env'

export default class Wechat {

	async login() {
		let token = '';
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramLogin();
		console.log('wechat', token);
		return token;
		// #endif

		// #ifdef H5
		this.wxOfficialAccountLogin();
		// #endif

		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformLogin();
		console.log('wechat', token);
		return token;
		// #endif

	}
	// #ifdef H5
	wxOfficialAccountLogin() {
		let loginStr = 'public/login';
		let oUrl = window.location.href;
		//首次进入 没有登录 保存
		uni.setStorageSync('oUrl', oUrl);

		window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.init.initData.wechat.appid +
			`&redirect_uri=${API_URL}user/wxOfficialAccountLogin&response_type=code&scope=snsapi_userinfo&state=` +
			oUrl;

		throw 'stop';


	}
	//临时登录获取OpenId 不入库不绑定用户
	wxOfficialAccountBaseLogin() {
		// let loginStr = 'public/login';
		let oUrl = window.location.href;
		//首次进入 没有登录 保存
		uni.setStorageSync('oUrl', oUrl);

		window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.init.initData.wechat.appid +
			`&redirect_uri=${API_URL}user/wxOfficialAccountBaseLogin&response_type=code&scope=snsapi_base&state=` +
			oUrl;

		throw 'stop';
	}
	// #endif


	wxOpenPlatformLogin() {
		let that = this;
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes)
					if (loginRes.errMsg === "login:ok") {
						let authResult = loginRes.authResult;
						console.log(authResult)
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log('infoRes', infoRes)
								if (infoRes.errMsg === "getUserInfo:ok") {
									let userInfo = infoRes.userInfo;
									api('user.wxOpenPlatformLogin', {
										authResult: authResult,
										userInfo: userInfo
									}).then(res => {
										console.log(res);
										if (res.code === 1) {
											resolve(res.data.token);
										}
									});
								}
							},
							fail: function(res) {
								api('dev.debug', {
									info: res
								})
							}
						});
					}
				},
				fail: function(res) {
					api('dev.debug', {
						info: res
					})
				}
			});
		});
	}

	// #ifdef MP-WEIXIN
	wxMiniProgramLogin() {
		let that = this;
		return new Promise((resolve, reject) => {
			uni.login({
				success: function(info) {
					console.log('登录信息', info);
					let code = info.code;
					api('user.wxMiniProgramLogin', {
						code: code,
						invite_id: uni.getStorageSync('inviterId')
					}).then(res => {
						if (res.code === 1) {
							console.log(res.data.token);
							resolve(res.data.token);
						}
					});

				}
			});
		});
	}


	checkMiniProgramUpdate() {
		let updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			console.log('小程序版本更新检查', res);
			// 请求完新版本信息的回调
		});
		updateManager.onUpdateReady(function(res) {
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate();
					}
				}
			});
		});

		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
		});
	}

	// #endif


}
