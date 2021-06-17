/**
 * Platform v1.0.0
 * @Class Platform
 * @description shopro-platform 1.0.0 全平台兼容
 * @Author lidongtony
 * @Date 2021-04-07
 * @Email lidongtony@qq.com
 */

// #ifdef H5
// 微信H5
import wxsdk from '@/shopro/wechat/sdk';
import {
	router
} from '@/shopro/router';
// #endif
export default {

	// 获取当前运行平台
	get() {
		let platform = '';
		// #ifdef H5
		wxsdk.isWechat() ? (platform = 'wxOfficialAccount') : (platform = 'H5');
		// #endif
		// #ifdef APP-PLUS
		platform = 'App';
		// #endif
		// #ifdef MP-WEIXIN
		platform = 'wxMiniProgram';
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipayMiniProgram';
		// #endif
		if (platform !== '') {
			uni.setStorageSync('platform', platform);
		} else {
			uni.showToast({
				title: '暂不支持该平台',
				icon: 'none'
			});
		}
		return platform;
	},
	set(platform) {
		uni.setStorageSync('platform', platform);
		return platform;
	},

	// 检测当前运行机型
	device() {
		return uni.getSystemInfoSync().platform;
	},

	// 获取前端真实主机
	host() {
		let host = location.origin;
		let basePath = router.$route.options.base;
		let mode = router.$route.options.mode;
		host += basePath;
		if (mode === 'hash') {
			host += '#/';
		}
		return host;
	},

	// 处理wechat jssdk 签名网址(针对IOS微信浏览器做优化)
	entry() {
		let that = this;
		var entryUrl = location.href;
		if (this.device() === 'ios') {
			if (typeof(location.entryUrl) !== 'undefined') {
				entryUrl = location.entryUrl;
			} else {
				location.entryUrl = entryUrl;
			}
		}
		return entryUrl;
	},


}
