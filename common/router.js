import Vue from 'vue'
import Router from 'uni-simple-router'
import store from '@/common/store'
// #ifdef H5
import wxsdk from '@/common/wechat/sdk'
// #endif
import {
	BASE_URL
} from '@/env'


Vue.use(Router)
//初始化
const router = new Router({
	APP: {
		holdTabbar: false,
		rewriteFun: false,
		animation: {
			animationType: 'pop-in',
			animationDuration: 300
		}
	},
	encodeURI: false,
	routes: ROUTES //路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	// 有两个个判断条件,一个是token,还有一个路由元信息
	let userInfo = Boolean(uni.getStorageSync('userInfo'));
	// 权限控制登录
	if (to.meta && to.meta.auth && !userInfo) {
		store.commit('LOGIN_TIP', true)
	} else {
		next()
	}

})
// 全局路由后置守卫
router.afterEach((to, from) => {
	// #ifdef H5
	if (uni.getStorageSync('platform') === 'wxOfficialAccount' && uni.getSystemInfoSync().platform === 'ios' && !window.entryURL) {
		//IOS sdk 校验
		if (from.path === '/pages/index/index') {
			window.entryURL = '/'
		} else {
			window.entryURL = from.path;
		}
		wxsdk.initJssdk();
	}
	// #endif
})
export default router;
