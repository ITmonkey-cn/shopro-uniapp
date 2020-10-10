// 购物车模块
import http from '@/common/request/index'
import store from '@/common/store'
import {
	CART_LIST,
	CART_NUM
} from '../types.js'
const state = {
	cartList: [],
	allSelected: false,
	cartNum: uni.getStorageSync('cartNum') ? uni.getStorageSync('cartNum') : 0, //购物车,涉及到刷新数据丢失，所以存了本地,
}

const actions = {
	// 购物车数据（查）
	getCartList({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			http('cart.index').then(res => {
				let cartData = res.data;
				cartData.map(item => {
					item.checked = true;
				})
				uni.setStorageSync('cartNum', cartData.length);
				commit('CART_LIST', cartData);
				commit('checkCartList');
				commit('CART_NUM');
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 添加到购物车（增）
	addCartGoods({
		commit
	}, data) {
		return new Promise((resolve, reject) => {
			http('cart.add', {
				goods_list: data.list,
				from: data.from
			}).then(res => {
				store.dispatch('getCartList');
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 修改购物车商品数量（改）|| 删除购物车商品（删）
	changeCartList({
		commit,
		state,
		dispatch
	}, param) {
		return new Promise((resolve, reject) => {
			http('cart.edit', {
				cart_list: param.ids,
				value: param.goodsNum || null,
				act: param.art
			}).then(res => {
				if (param.art === 'delete' && res.code === 1) {
					store.dispatch('getCartList');
				}
				resolve(res)
				commit('checkCartList');
			}).catch(e => {
				reject(e)
			})
		})
	},
}

const mutations = {
	// cart数据获取变动。
	[CART_LIST](state, data) {
		state.cartList = data
	},
	// cart数量角标更新。
	[CART_NUM](state, data) {
		let cartNum = uni.getStorageSync('cartNum') ? uni.getStorageSync('cartNum') : 0;
		state.cartNum = cartNum
	},
	// 切换全选。
	changeAllSellect(state) {
		state.allSelected = !state.allSelected;
	},
	// 全选设置
	getAllSellectCartList(state, flag) {
		state.cartList.map(item => {
			item.checked = flag
		})
	},
	// 单选设置
	selectItem(
		state, {
			index,
			flag
		}) {
		state.cartList[index].checked = !flag;
		store.commit('checkCartList')

	},
	// 全选检测
	checkCartList(state) {
		let all = true;
		state.cartList.map(item => {
			if (!item.checked) {
				all = false
			}
		})
		state.allSelected = all;
	}
}

const getters = {
	// 购物车数量和总价
	totalCount: state => {
		let totalNum = 0;
		let totalPrice = 0;
		state.cartList.filter(item => {
			if (item.checked) {
				totalNum += 1;
				totalPrice += item.goods_num * item.sku_price.price;
			}
		})
		return {
			totalNum,
			totalPrice
		}
	},
	// 外卖购物车数量和总价
	takeoutTotalCount: state => {
		let totalNum = 0;
		let totalPrice = 0;
		state.cartList.forEach(item => {
			totalNum += item.goods_num;
			totalPrice += item.goods_num * item.sku_price.price;
		})
		return {
			totalNum,
			totalPrice
		}

	},
	// 是否选择了商品
	isSel: state => {
		let isSel = false;
		state.cartList.map(item => {
			if (item.checked) {
				isSel = true
			}
		})
		return isSel
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
