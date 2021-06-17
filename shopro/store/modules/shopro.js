// 初始化数据模块
import http from '@/shopro/request/index'
import store from '@/shopro/store'
import {
	router
} from '@/shopro/router';
import share from '@/shopro/share';
import {
	CONFIG,
	TEMPLATE,
	SHARE_INFO,
	PAGE_ROUTES,
} from '../types.js'
const state = {
	config: uni.getStorageSync('config') ? uni.getStorageSync('config') : {},
	routes: [],
	template: uni.getStorageSync('template') ? uni.getStorageSync('template') : {},
	hasTemplate: true, //是否有模板数据
	shareInfo: {},
}

const actions = {

	appInit({
		commit
	}, options) {
		return new Promise((resolve, reject) => {
			http('common.init').then(res => {
				if (res.code === 1) {
					commit('CONFIG', res.data);
					if (!options?.query?.token) {
						store.dispatch('autoLogin');
						store.dispatch('getTemplate', options);
						store.dispatch('getShareInfo');
					}

				}
				resolve(res.data)
			}).catch(e => {
				reject(e)
			})
		})
	},

	// 获取模板数据
	getTemplate({
		commit
	}, options) {
		return new Promise((resolve, reject) => {
			let shop_id = 0;
			// #ifdef H5
			if (options?.query.shop_id) {
				shop_id = options.query.shop_id;
			}
			// #endif

			// #ifdef MP
			if (options?.query.scene) {
				let scene = decodeURIComponent(options?.query.scene);
				let sceneObj = scene.split('=');
				if (sceneObj[0] === 'shop_id') {
					shop_id = sceneObj[1]
				}
			}
			// #endif
			http('common.template', {
				shop_id
			}).then(res => {
				res.code === 0 ? commit('hasTemplate', false) : commit('hasTemplate', true);
				if (res.code === 1) {
					commit('TEMPLATE', res.data);
					uni.setStorageSync('template', res.data);
				}
				resolve(res)
			}).catch(e => {
				reject(e)

			})
		})
	},

	getShareInfo({
		commit
	}) {
		let shareInfo = share.setShareInfo();
		commit('SHARE_INFO', shareInfo);
		return shareInfo;
	},

	// 同步后端路由
	syncPages({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('common.syncPages', {
				data: ROUTES
			}).then(res => {
				commit('PAGE_ROUTES', res.data);
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		})
	},
}

const mutations = {
	[CONFIG](state, data) {
		state.config = data
		uni.setStorageSync('config', data);
	},
	[TEMPLATE](state, data) {
		state.template = data
	},
	[PAGE_ROUTES](state, data) {
		state.routes = data
	},
	[SHARE_INFO](state, data) {
		state.shareInfo = data
	},
	hasTemplate(state, data) {
		state.hasTemplate = data
	},
	// 弹窗一次的话，关闭的时候删除数据。
	delPopup(state, index) {
		let templateData = state.template;
		uni.removeStorageSync('template');
		templateData.popup[0].content.list.splice(index, 1)
		uni.setStorageSync('template', templateData);
		state.template = templateData;
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
