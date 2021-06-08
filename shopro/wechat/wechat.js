/**
 * Wechat v1.0.0
 * @Class Wechat
 * @description shopro-wechat 1.0.0 wehcat第三方登录组件
 * @Author llidongtony
 * @Date 2020-02-19
 * @Email lidongtony@qq.com
 */
import api from '@/shopro/request/index';
import $platform from '@/shopro/platform';
import store from '@/shopro/store';
import {
	router
} from '@/shopro/router';
import {
	API_URL
} from '@/env'

export default {
	eventMap(event) {
		let map = '';
		switch (event) {
			case 'login':
				map = '登录中...';
				break;
			case 'refresh':
				map = '更新中...';
				break;
			case 'bind':
				map = '绑定中...';
				break;
		}
		return map;
	},

	async login() {
		let token = '';
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth('login');
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth('login');
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth('login');
		return token;
		// #endif
	},
	async refresh() {
		let token = '';
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth('refresh');
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth('refresh');
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth('refresh');
		return token;
		// #endif
	},
	async bind() {
		let token = '';
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth('bind');
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth('bind');
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth('bind');
		return token;
		// #endif
	},

	// #ifdef H5
	// 微信公众号网页登录&刷新头像昵称&绑定
	wxOfficialAccountOauth(event = 'login') {
		if($platform.get() !== 'wxOfficialAccount') {
			uni.showToast({
				title: '请在微信浏览器中打开',
				icon: 'none'
			})
			throw false;
		}
		let host = $platform.host();
		let payloadObject = {
			host: host,
			event,
			token: (event !== 'login' && uni.getStorageSync('token')) ? uni.getStorageSync('token') : ''
		};
		let payload = encodeURIComponent(JSON.stringify(payloadObject));

		let redirect_uri = encodeURIComponent(`${API_URL}user/wxOfficialAccountOauth?payload=${payload}`);
		let oauthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.shopro.config
			.wechat.appid +
			`&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1`;
		uni.setStorageSync('lastPage', window.location.href);
		window.location = oauthUrl;
	},

	// 微信公众号网页静默登录:临时登录获取OpenId 不入库不绑定用户
	wxOfficialAccountBaseLogin() {
		let state = encodeURIComponent(window.location.href);
		window.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + store.state.config.wechat
			.appid +
			`&redirect_uri=${API_URL}user/wxOfficialAccountBaseLogin&response_type=code&scope=snsapi_base&state=${state}`
		throw 'stop';
	},
	// #endif

	// #ifdef APP-PLUS
	// 微信开放平台登录
	wxOpenPlatformOauth(event = 'login') {
		let that = this;
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					if (loginRes.errMsg === "login:ok") {
						let authResult = loginRes.authResult;
						api('user.wxOpenPlatformOauth', {
							authResult,
							event
						}, that.eventMap(event)).then(res => {
							if (res.code === 1) {
								resolve(res.data.token);
							} else {
								resolve(false);
							}
						});
					}
				},
				fail: function(res) {
					uni.showToast({
						title: '登录失败,请稍后再试'
					});
					resolve(false);
					api('common.debug', {
						info: res
					})
				},
				complete: function(res) {
				}
			});
		});
	},
	// #endif

	// #ifdef MP-WEIXIN
	// 微信小程序静默登录
	getWxMiniProgramSessionKey(autoLogin = true) {
		let that = this;
		let sessionStatus = false;
		let session_key = '';
		return new Promise((resolve, reject) => {
			uni.checkSession({
				success(res) {
					if (res.errMsg === 'checkSession:ok') sessionStatus = true;
				},
				complete() {
					if (uni.getStorageSync('session_key') && sessionStatus) {
						resolve(uni.getStorageSync('session_key'));
					} else {
						uni.login({
							success: function(info) {
								let code = info.code;
								api('user.getWxMiniProgramSessionKey', {
									code: code,
									autoLogin: autoLogin
								}).then(res => {
									if (res.code === 1) {
										uni.setStorageSync('session_key', res
											.data.session_key);
										if (autoLogin) {
											if (res.data.token) {
												resolve(res.data.token);
											} else {
												resolve(false);
											}
										}
										resolve(res.data.session_key);
									} else {
										reject(res.msg);
									}
								});
							}
						});
					}
				}
			})
		});
	},

	// 微信小程序获取用户信息登录
	wxMiniProgramOauth(event = 'login') {
		let that = this;
		uni.showLoading({
			title: that.eventMap(event)
		})
		return new Promise((resolve, reject) => {
			uni.getUserProfile({ // 必须手动确认触发
				desc: '完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: async res => {
					if (res.errMsg === "getUserProfile:ok") {
						api('user.wxMiniProgramOauth', {
							event,
							session_key: await that.getWxMiniProgramSessionKey(false),
							encryptedData: res.encryptedData,
							iv: res.iv,
							signature: res.signature,
						}).then(res => {
							if (res.code === 1) {
								resolve(res.data.token);
							} else {
								uni.removeStorageSync('session_key');
								resolve(false);
							}
						});
					}
				},
				complete: res => {
					uni.hideLoading();
				}
			})
		});

	},

	// 小程序更新
	checkMiniProgramUpdate() {
		if (uni.canIUse('getUpdateManager')) {
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function() {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function(res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function() {
						// 新的版本下载失败
						uni.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						})
					})
				}
			})
		}
	},
	// #endif




}
