// 用户数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import router from '@/common/router.js'
import tools from '@/common/utils/tools'

import {
	USER_INFO,
	LOGIN_TIP,
	ORDER_NUMBER,
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
	forceOauth: false
	// #endif
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
			//默认跳转首页
			router.pushTab('/pages/tabbar/home/index')
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
				console.log(e)
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
}

const mutations = {
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
		store.commit('ORDER_NUMBER', 0);
		// store.commit('FORCE_OAUTH', true);
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
