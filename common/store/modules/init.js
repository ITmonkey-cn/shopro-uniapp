// 初始化数据模块
import api from '@/common/request/index'
import store from '@/common/store'
import Router from '@/common/router';
import {
	INIT_DATA,
	PAGE_ROUTES,
	CART_NUM,
	TEMPLATE_DATA
} from '../types.js'
const state = {
	initData: {},
	routes: [],
	addons: uni.getStorageSync('addons') ? uni.getStorageSync('addons') : [], //插件列表
	templateData: uni.getStorageSync('templateData') ? uni.getStorageSync('templateData') : {}
}

const actions = {
	getAppInit({
		commit
	}, options) {
		uni.setStorageSync('mode', 'product');
		return new Promise((resolve, reject) => {
			api('init').then(res => {
				commit('INIT_DATA', res.data);
				uni.setStorageSync('sysInfo', res.data.info);
				uni.setStorageSync('shareInfo', res.data.share);
				uni.setStorageSync('addons', res.data.addons)
				resolve(res)
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
	}, options = {}) {
		var params = {};
		return new Promise((resolve, reject) => {
			//请求预览商城模板
			if (options.query && options.query.shop_id) {
				params.shop_id = options.query.shop_id;
			}
			if (options.query && options.query.custom_id) {
				Router.replace({
					path: '/pages/index/view',
					query: {
						id: options.query.custom_id,
					}
				});
			}
			api('template', params).then(res => {
				uni.setStorageSync('templateData', res.data);
				commit('TEMPLATE_DATA', res.data);
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
	[TEMPLATE_DATA](state, data) {
		state.templateData = data
	},
	// 弹窗一次的话，关闭的时候删除数据。
	delPopup(state, path) {
		uni.removeStorageSync('templateData');
		let templateData = state.templateData
		templateData.popup[0].content.list.forEach(item => {
			if (item.page.includes(path)) {
				let index = item.page.indexOf(path);
				item.page.splice(index, 1)
			}
		})
		uni.setStorageSync('templateData', templateData);
		state.templateData = templateData;
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
