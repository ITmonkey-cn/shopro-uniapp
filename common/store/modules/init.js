// 初始化数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import {
	INIT_DATA,
	PAGE_ROUTES,
	CART_NUM,
	TEMPLATE
} from '../types.js'
const state = {
	initData: {},
	routes: [],
	templateData: uni.getStorageSync('templateData') ? uni.getStorageSync('templateData') : {}, //购物车,涉及到刷新数据丢失，所以存了本地,
}

const actions = {
	getAppInit({
		commit
	}, options) {
		let params = {}
		uni.setStorageSync('mode', 'product');

		if (options.query.preview_id) {
			uni.setStorageSync('mode', 'preview');
			params.preview_id = options.query.preview_id;
		}
		return new Promise((resolve, reject) => {
			api('init', params).then(res => {
				commit('INIT_DATA', res.data);
				uni.setStorageSync('sysInfo', res.data.info);
				uni.setStorageSync('shareInfo', res.data.share);
				resolve(res)
			}).then(() => {
				store.dispatch('getTemplate');
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 同步前端路由
	getRoutes({
		commit
	}) {
		return new Promise((resolve, reject) => {
			api('dev.asyncLink', {
				data: ROUTES
			}).then(res => {
				commit('PAGE_ROUTES', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
	// 模板信息
	getTemplate({
		commit
	}) {
		return new Promise((resolve, reject) => {
			api('template').then(res => {
				uni.setStorageSync('templateData', res.data);
				commit('TEMPLATE', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
}

const mutations = {
	[PAGE_ROUTES](state, data) {
		state.routes = data
	},
	[INIT_DATA](state, data) {
		state.initData = data
	},
	[TEMPLATE](state, data) {
		state.templateData = data
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
