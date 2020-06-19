// 自定义底部导航
import http from '@/common/request/index'
import store from '@/common/store'


const state = {
	tabCurrent: uni.getStorageSync('tabCurrent') ? uni.getStorageSync('tabCurrent') : 0,
}

const actions = {}

const mutations = {
	// tabbar切换
	switchTabbar(state, index) {
		uni.setStorageSync('cartNum', index);
		state.tabCurrent = index;
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
