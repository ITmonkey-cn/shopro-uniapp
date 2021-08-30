/**
 * Apple v1.0.0
 * @Class Apple
 * @description shopro-apple 1.0.0 apple第三方登录组件
 * @Author lidongtony
 * @Date 2020-02-19
 * @Email lidongtony@qq.com
 */
import api from '@/shopro/request/index';

export default {
	eventMap(event) {
		let map = '';
		switch (event) {
			case 'login':
				map = '登录中...';
				break;
			case 'refresh':
				map = '更新中...';
				break;
			case 'bind':
				map = '绑定中...';
				break;
		}
		return map;
	},

	// #ifdef APP-PLUS
	// 微信开放平台登录
	appleIdOauth(event = 'login') {
		let that = this;
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'apple',
				success: function(loginRes) {
					if (loginRes.errMsg === "login:ok") {
						        // 登录成功  
						        uni.getUserInfo({  
						            provider: 'apple',  
						            success(res) {
										if(res.errMsg === 'getUserInfo:ok') {
											let userInfo = res.userInfo;
											api('user.appleIdOauth', {
												userInfo,
												event
											}, that.eventMap(event)).then(res => {
												if (res.code === 1) {
													resolve(res.data.token);
												} else {
													resolve(false);
												}
											});
										}
						                // 获取用户信息成功  
						            }  
						        })  
		

					}
				},
				fail: function(res) {
					uni.showToast({
						title: '请稍后再试'
					});
					resolve(false);
					api('common.debug', {
						info: res
					})
				},
				complete: function(res) {
				}
			});
		});
	},
	// #endif
}
