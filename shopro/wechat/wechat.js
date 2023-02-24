/**
 * Wechat v1.2.1
 * @Class Wechat
 * @description shopro-wechat 1.2.1 wehcat第三方登录组件
 * @Author lidongtony
 * @Date 2022-12-12
 * @Email lidongtony@qq.com
 */
import api from "@/shopro/request/index";
import $platform from "@/shopro/platform";
import store from "@/shopro/store";
import {
	API_URL
} from "@/env";

export default {
	eventMap(event) {
		let map = "";
		switch (event) {
			case "login":
				map = "登录中...";
				break;
			case "refresh":
				map = "更新中...";
				break;
			case "bind":
				map = "绑定中...";
				break;
		}
		return map;
	},

	async login(payload) {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth("login", payload);
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth("login");
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("login");
		return token;
		// #endif
	},
	async refresh() {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth("refresh");
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth("refresh");
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("refresh");
		return token;
		// #endif
	},
	async bind(payload) {
		let token = "";
		// #ifdef MP-WEIXIN
		token = await this.wxMiniProgramOauth("bind", payload);
		return token;
		// #endif
		// #ifdef H5
		this.wxOfficialAccountOauth("bind");
		// #endif
		// #ifdef APP-PLUS
		token = await this.wxOpenPlatformOauth("bind");
		return token;
		// #endif
	},

	// #ifdef H5
	// 微信公众号网页登录&刷新头像昵称&绑定
	wxOfficialAccountOauth(event = "login") {
		if ($platform.get() !== "wxOfficialAccount") {
			uni.showToast({
				title: "请在微信浏览器中打开",
				icon: "none"
			});
			throw false;
		}
		let host = $platform.host();
		let payloadObject = {
			host: host,
			event,
			token: (event !== "login" && store.getters.isLogin) ? uni.getStorageSync("token") : ""
		};
		let payload = encodeURIComponent(JSON.stringify(payloadObject));
		let redirect_uri = encodeURIComponent(`${API_URL}user/wxOfficialAccountOauth?payload=${payload}`);
		let oauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + store.getters.initWechat.appid +
			`&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1`;
		uni.setStorageSync("lastPage", window.location.href);
		window.location = oauthUrl;
	},

	// 微信公众号网页静默登录:临时登录获取OpenId 不入库不绑定用户
	wxOfficialAccountBaseLogin() {
		let state = encodeURIComponent(window.location.href);
		window.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + store.getters.initWechat
			.appid +
			`&redirect_uri=${API_URL}user/wxOfficialAccountBaseLogin&response_type=code&scope=snsapi_base&state=${state}`;
		throw "stop";
	},
	// #endif

	// #ifdef APP-PLUS
	// 微信开放平台登录
	async wxOpenPlatformOauth(event = "login") {
		let that = this;
		const loginResult = await uni.login({
			provider: 'weixin',
			onlyAuthorize: true,
		});
		if (loginRes.errMsg !== 'login:ok') {
			uni.showToast({
				title: loginRes.errMsg,
				icon: 'none',
			});
			return Promise.reject('');
		}
		const authResult = loginRes.authResult;
		const res = await api("user.wxOpenPlatformOauth", {
			authResult,
			event
		}, that.eventMap(event));
		if (res.code === 1) {
			return Promise.resolve(res.data.token);
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none',
			});
		}
		return Promis.reject('');
	},
	// #endif

	// #ifdef MP-WEIXIN
	// 微信小程序静默登录
	async getWxMiniProgramSessionKey(autoLogin = true) {
		const loginResult = await uni.login();
		if (loginResult[1].errMsg !== 'login:ok') {
			uni.showToast({
				title: loginResult[1].errMsg,
				icon: "none"
			});
			return Promise.reject(loginResult[1].errMsg);
		}

		const res = await api("user.getWxMiniProgramSessionKey", {
			code: loginResult[1].code,
			autoLogin: autoLogin
		});
		if (res.code === 1) {
			uni.setStorageSync("session_id", res
				.data.session_id);
			if (autoLogin) {
				if (res.data.token) {
					return Promise.resolve(res.data.token);
				} else {
					return Promise.resolve('');
				}
			}
			return Promise.resolve(res.data.session_id);
		} else {
			return Promise.reject(res.msg);
		}

	},

	// 微信小程序获取用户手机号登录
	async wxMiniProgramOauth(event = "login", payload) {
		let that = this;
		uni.showLoading({
			title: that.eventMap(event)
		});
		if (payload.detail.errMsg !== 'getPhoneNumber:ok') {
			uni.showToast({
				title: payload.detail.errMsg,
				icon: "none"
			});
			return Promise.reject(payload.detail.errMsg);
		}

		const res = await api("user.wxMiniProgramOauth", {
			event,
			code: payload.detail.code,
			iv: payload.detail.iv,
			encryptedData: payload.detail.encryptedData,
			session_id: uni.getStorageSync("session_id"),
		});

		if (res.code === 1) {
			return Promise.resolve(res.data.token);
		} else {
			uni.removeStorageSync("session_id");
			that.getWxMiniProgramSessionKey(false);
			return Promise.resolve(false);
		}
	},

	// 小程序更新
	checkMiniProgramUpdate() {
		if (uni.canIUse("getUpdateManager")) {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function () {
						uni.showModal({
							title: "更新提示",
							content: "新版本已经准备好，是否重启应用？",
							success: function (res) {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
					updateManager.onUpdateFailed(function () {
						// 新的版本下载失败
						uni.showModal({
							title: "已经有新版本了哟~",
							content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
						});
					});
				}
			});
		}
	},
	// #endif


};
