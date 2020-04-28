// 购物车模块
import http from '@/common/request/index'
import store from '@/common/store'
import {
	CART_LIST,
	CART_NUM
} from '../types.js'
const state = {
	cartList: [],
	cartNum: uni.getStorageSync('cartNum') ? uni.getStorageSync('cartNum') : '', //购物车,涉及到刷新数据丢失，所以存了本地,
}

const actions = {
	// 购物车数据
	getCartList({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			http('cart.index').then(res => {
				commit('CART_LIST', res.data);
				let num = res.data.length + '';
				uni.setStorageSync('cartNum', num);
				commit('CART_NUM', num);
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 添加到购物车
	addCartGoods({
		commit
	}, data) {
		return new Promise((resolve, reject) => {
			http('cart.add', {
				goods_list: data.list,
				from: data.from
			}).then(res => {
				resolve(res)
				store.dispatch('getCartList');
			}).catch(e => {
				reject(e)
			})
		})
	},

}

const mutations = {
	// cart数据
	[CART_LIST](state, data) {
		state.cartList = data
	},
	// cart数量
	[CART_NUM](state, data) {
		state.cartNum = data;
		if (+data) {
			uni.setTabBarBadge({
				index: 2,
				text: data + ''
			})
		} else {
			uni.removeTabBarBadge({
				index: 2
			})
		}
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
