// 用户数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import router from '@/common/router.js'
import tools from '@/common/utils/tools'

import {
	USER_INFO,
	LOGIN_TIP,
	ORDER_NUMBER,
	MESSAGE_IDS,
	OUT_LOGIN,
	// #ifdef MP-WEIXIN
	FORCE_OAUTH,
	// #endif
} from '../types.js'
const state = {
	userInfo: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo') : {},
	showLoginTip: false,
	orderNum: {},
	// #ifdef MP-WEIXIN
	forceOauth: false,
	// #endif
	messageIds: {}, //小程序订阅消息模板ids

}

const actions = {
	//设置token并返回上次页面
	setTokenAndBack({
		commit
	}, token) {
		uni.setStorageSync('token', token);
		store.dispatch('getUserInfo');
		let fromLogin = uni.getStorageSync('fromLogin');
		if (fromLogin) {
			tools.routerTo(fromLogin.path, fromLogin.query, true);
			uni.removeStorageSync('fromLogin')
		} else {
			//默认跳转首页S
			router.replaceAll('/pages/index/index')
		}
	},

	// 获取用户信息
	getUserInfo({
		commit
	}) {
		return new Promise((resolve, reject) => {
			api('user.info').then(res => {
				store.dispatch('getCartList')
				commit('LOGIN_TIP', false);
				commit('USER_INFO', res.data);
				uni.setStorageSync('userInfo', res.data);
				store.dispatch('getOrderNum');
				//添加推广记录
				let share_id = uni.getStorageSync('share_id');
				let url = uni.getStorageSync('url');
				let shareParams = {};
				// if(share_id && res.data.id >share_id) {
				if (share_id) {
					shareParams.share_id = share_id;
					shareParams.url = url;
					api('share.add', shareParams).then(res => {
						if (res.code === 1) {
							uni.removeStorageSync('share_id');
							uni.removeStorageSync('url');
						}
					})
				}
				resolve(res)

			}).catch(e => {
				reject(e)
			})
		})
	},
	// 订单信息
	getOrderNum({
		commit
	}) {
		return new Promise((resolve, reject) => {
			api('order.statusNum').then(res => {
				commit('ORDER_NUMBER', res.data);
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
			api('messageIds').then(res => {
				commit('MESSAGE_IDS', res.data);
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
					default:
						typeName = []
						break;
				}
				typeName.forEach(item => {
					obj[item] && arr.push(obj[item])
				})
				arr.length && uni.requestSubscribeMessage({
					tmplIds: arr,
					success: (res) => {
						console.log(res);
					},
					fail: (err) => {
						console.log(err);
					}

				});
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
}

const mutations = {
	// 小程序订阅消息模板ids
	[MESSAGE_IDS](state, data) {
		state.messageIds = data
	},
	[USER_INFO](state, data) {
		state.userInfo = data
	},
	[LOGIN_TIP](state, data) {
		state.showLoginTip = data
	},
	[ORDER_NUMBER](state, data) {
		state.orderNum = data
	},
	// #ifdef MP-WEIXIN
	[FORCE_OAUTH](state, data) {
		state.forceOauth = data
		data ? uni.hideTabBar() : uni.showTabBar();
	},
	// #endif

	[OUT_LOGIN](state, data) {
		uni.removeStorageSync('token');
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('cartNum');
		store.commit('USER_INFO', {});
		store.commit('CART_LIST', []);
		store.commit('CART_NUM');
		store.commit('ORDER_NUMBER', {});
	},

}

const getters = {

}

export default {
	state,
	mutations,
	actions,
	getters
}
