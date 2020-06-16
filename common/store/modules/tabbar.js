// 自定义底部导航
import http from '@/common/request/index'

import {

} from '../types.js'
const state = {
	isCustomTabbar: false, //是否开启自定义导航。
	tabCurrent: 0,
	color: '#333',
	selectedColor: '#a8700d',
	backgroundColor: '#fff',
	tagTextColor: '#fff',
	tagBgColor: '#F74D54',
	tabBarList: [ //红点和数字互斥。
		{
			pagePath: '/pages/index/index',
			text: '首页',
			iconPath: '/static/imgs/tabbar/tab_home.png',
			selectedIconPath: '/static/imgs/tabbar/tab_home_sel.png',
			tagNum: 1,
			isDot: true,
			isAuth: true
		},
		{
			pagePath: '/pages/index/category',
			text: '分类',
			iconPath: '/static/imgs/tabbar/tab_type.png',
			selectedIconPath: '/static/imgs/tabbar/tab_type_sel.png',
			tagNum: 2,
			isDot: true,
			isAuth: true
		},
		{
			pagePath: '/pages/index/cart',
			text: '购物车',
			iconPath: '/static/imgs/tabbar/tab_cart.png',
			selectedIconPath: '/static/imgs/tabbar/tab_cart_sel.png',
			tagNum: 3,
			isDot: true,
			isAuth: true
		},
		{
			pagePath: '/pages/index/user',
			text: '我的',
			iconPath: '/static/imgs/tabbar/tab_my.png',
			selectedIconPath: '/static/imgs/tabbar/tab_my_sel.png',
			tagNum: 4,
			isDot: true,
			isAuth: true
		}
	]


}

const actions = {}

const mutations = {
	// tabbar切换
	switchTabbar(state, index) {
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
