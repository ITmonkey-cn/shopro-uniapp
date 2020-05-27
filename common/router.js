import Vue from 'vue'
import Router from 'uni-simple-router'
import store from '@/common/store'

Vue.use(Router)
//初始化
const router = new Router({
	APP: {
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
	// 权限控制
	if (to.meta && to.meta.auth && !userInfo) {
		store.commit('LOGIN_TIP', true)
		// 跳转方式控制
		switch (to.path) {
			case '/pages/tabbar/home/index':
				next({
					name: 'home',
					params: {
						msg: '我拦截了tabbar',
					},
					NAVTYPE: 'pushTab'
				});
				break;
			case '/pages/tabbar/category/index':
				next({
					name: 'category',
					params: {
						msg: '我拦截了tabbar',
					},
					NAVTYPE: 'pushTab'
				});
				break;
			case '/pages/tabbar/cart/index':
				next({
					name: 'cart',
					params: {
						msg: '我拦截了tabbar',
					},
					NAVTYPE: 'pushTab'
				});
				break;
			case '/pages/tabbar/user/index':
				next({
					name: 'user',
					params: {
						msg: '我拦截了tabbar',
					},
					NAVTYPE: 'pushTab'
				});
				break;
		}
	} else {
		next()
	}
})
// 全局路由后置守卫
router.afterEach((to, from) => {})
export default router;
