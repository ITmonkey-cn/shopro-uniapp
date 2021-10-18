import http from '@/shopro/request/index'
import share from '@/shopro/share';

const state = {
	shop: {}, // 商城信息
	wechat: {}, // 微信配置
	share: {}, // 分享配置
	payment: {}, // 支付配置
	addons: [], // 插件配置
	chat: uni.getStorageSync("chat") || {}, // 客服配置
	store: {}, // 商城信息
	tabbarData: [], //自定义底部导航数据

	homeTemplate: [], // 首页模板数据
	userTemplate: [], // 个人中心模板数据
	floatData: {}, // 悬浮按钮数据
	popupData: {}, // 弹窗数据
	hasTemplate: true, //是否有模板数据
	shareInfo: {} // 默认分享数据
}
const getters = {
	initShop: state => state.shop,
	initStore: state => state.store,
	initShare: state => state.share,
	initPayment: state => state.payment,
	initAddons: state => state.addons,
	initChat: state => state.chat,
	initWechat: state => state.wechat,

	hasTemplate: state => state.hasTemplate,
	homeTemplate: state => state.homeTemplate,
	userTemplate: state => state.userTemplate,
	floatData: state => state.floatData,
	popupData: state => state.popupData,
	tabbarData: state => state.tabbarData,

	shareInfo: state => state.shareInfo
}


const actions = {
	// 初始化数据
	async appInit({
		commit,
		dispatch
	}, options) {
		const result = await http('common.init');
		if (result.code === 1) {
			commit('CONFIG', result.data);
			if (!options?.query?.token) {
				dispatch('autoLogin');
			}
			return result.data;
		}
		return false;
	},

	// 获取模板数据
	async getTemplate({
		commit
	}, options) {
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
		const result = await http('common.template', shop_id ? {
			shop_id
		} : {});
		if (result.code === 1) {
			commit("hasTemplate", true);
			commit('TEMPLATE', result.data);
			return result.data;
		} else {
			commit("hasTemplate", false);
			return false;
		}
	},

	// 同步路由到后端
	syncPages({
		commit
	}) {
		http('common.syncPages', {
			data: ROUTES,
		})
	},
}


const mutations = {
	CONFIG(state, payload) {
		Object.keys(payload).forEach(k => {
			state[k] = payload[k];
			if (k === 'chat') {
				uni.setStorageSync("chat", payload[k]);
			}
		})
	},

	TEMPLATE(state, data) {
		state.template = data;
		state.homeTemplate = data.home
		state.userTemplate = data.user
		state.floatData = data['float-button']?. [0]?.content
		state.popupData = data?.popup?. [0]?.content
		state.tabbarData = data?.tabbar?. [0]?.content
	},

	hasTemplate(state, data) {
		state.hasTemplate = data
	},
	// 弹窗一次的话，关闭的时候删除数据。
	delPopup(state, index) {
		let popupData = state.popupData;
		popupData.list.splice(index, 1)
		state.template = popupData;
	},
	shareInfo(state, shareInfo) {
		state.shareInfo = shareInfo;
	}
}


export default {
	state,
	mutations,
	actions,
	getters
}
