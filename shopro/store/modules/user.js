// 用户数据模块
import http from '@/shopro/request/index'
import store from '@/shopro/store'
import tools from '@/shopro/utils/tools'
import wechat from '@/shopro/wechat/wechat'

import {
	IS_LOGIN,
	USER_INFO,
	USER_DATA,
	MESSAGE_IDS,
	AGENT_INFO,
	AUTH_TYPE
} from '../types.js'
const state = {
	isLogin: uni.getStorageSync('isLogin') ? uni.getStorageSync('isLogin') : false,
	userInfo: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {},
	agentInfo: uni.getStorageSync('agentInfo') ? uni.getStorageSync('agentInfo') : {},
	userData: {}, //用户其他相关信息
	messageIds: {}, //小程序订阅消息模板ids
	authType: '' // smsLogin:手机号登录注册, accountLogin:密码登录, forgotPwd:忘记密码, changePwd:修改密码, bindMobile:绑定手机号
}

const actions = {
	// 获取用户信息
	getUserInfo({
		commit
	}, token = '') {
		return new Promise((resolve, reject) => {
			token && uni.setStorageSync('token', token);
			http('user.info').then(res => {
					if (res.code === 1) {
						store.dispatch('showAuthModal', '');
						if (!store.state.user.isLogin) {
							store.dispatch('getShareInfo');
						}
						commit('IS_LOGIN', true);
						commit('USER_INFO', res.data);
						uni.setStorageSync('userInfo', res.data);
						let spm = uni.getStorageSync('spm');
						if (spm) {
							http('common.shareAdd', {
								spm: spm
							});
							uni.removeStorageSync('spm');
						}
						resolve(res)
					}

				}).then(() => {
					// 只有在登录的时候请求购物车信息，订单信息，获取登录信息之后。
					token && store.dispatch('getCartList');
					token && store.dispatch('getUserData');
				})
				.catch(e => {
					reject(e)
				})
		})
	},
	// 用户其他相关信息
	getUserData({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('user.userData').then(res => {
				commit('USER_DATA', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 获取订阅消息模板ids;
	getMessageIds({
		commit
	}, type) {
		return new Promise((resolve, reject) => {
			http('user.messageIds').then(res => {
				let typeName = []; //模板键
				let obj = res.data; //模板对象
				let arr = []; //模板ids
				switch (type) {
					case 'result': //支付成功后
						typeName = ['order_sended']
						break;
					case 'grouponResult': //拼团支付成功后
						typeName = ['groupon_success', 'groupon_fail', 'order_sended']
						break;
					case 'aftersale': //点击售后
						typeName = ['refund_agree', 'aftersale_change', 'wallet_change']
						break;
					case 'wallet': //提现提醒
						typeName = ['score_change', 'wallet_apply', 'wallet_change']
						break;
					case 'store': //门店新订单通知
						typeName = ['store_order_new']
						break;
					case 'storeApply': //门店申请通知
						typeName = ['store_apply']
						break;
					default:
						typeName = []
						break;
				}
				typeName.forEach(item => {
					obj[item] && arr.push(obj[item])
				})
				commit('MESSAGE_IDS', arr);
				// #ifdef MP-WEIXIN
				arr.length && uni.requestSubscribeMessage({
					tmplIds: arr,
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.log(err);
					}

				});
				// #endif
				resolve(arr)
			}).catch(e => {
				reject(e)
			})
		})
	},

	// 获取分销商身份信息
	getAgent({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('commission.auth').then(res => {
				if (res.code === 1) {
					commit('AGENT_INFO', res.data.data);
					uni.setStorageSync('agentInfo', res.data.data);
				}
				resolve(res)
			}).catch(e => {
				reject(e)
			});
		})
	},


	// 自动登录
	async autoLogin({
		commit
	}) {
		if (store.state.shopro.config.wechat?.autologin && !store.state.user.isLogin) {
			let token = '';
			// #ifdef H5
			uni.setStorageSync('appid', store.state.shopro.config.wechat.appid);
			wechat.login();
			// #endif
			// #ifdef MP-WEIXIN
			token = await wechat.getWxMiniProgramSessionKey(true);
			// #endif
			if (token) {
				store.dispatch('getUserInfo', token);
			}
		}
	},

	// 登录弹窗控制
	showAuthModal({
		commit
	}, type = 'accountLogin') {
		commit('AUTH_TYPE', type);
	},

	// 退出登录
	logout({
		commit
	}) {
		uni.getStorageSync('token') && http('user.logout');
		uni.removeStorageSync('token');
		uni.removeStorageSync('session_key');
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('cartNum');
		uni.removeStorageSync('chatSessionId');
		commit('IS_LOGIN', false);
		commit('USER_INFO', {});
		commit('CART_LIST', []);
		commit('CART_NUM');
		commit('USER_DATA', {});
	}
}

const mutations = {
	// 登录态
	[IS_LOGIN](state, data) {
		uni.setStorageSync('isLogin', data);
		state.isLogin = data;
	},
	// 用户信息
	[USER_INFO](state, data) {
		state.userInfo = data;
	},
	// 分销商信息
	[AGENT_INFO](state, data) {
		state.agentInfo = data;
	},
	// 小程序订阅消息模板ids
	[MESSAGE_IDS](state, data) {
		state.messageIds = data;
	},
	[USER_DATA](state, data) {
		state.userData = data;
	},
	[AUTH_TYPE](state, data) {
		data ? uni.hideTabBar() : uni.showTabBar();
		state.authType = data;
	}
}

const getters = {

}

export default {
	state,
	mutations,
	actions,
	getters
}
