import store from '@/common/store'
// #ifdef H5
import wxsdk from '@/common/wechat/sdk';
// #endif
import api from '@/common/request/index'
import Router from '@/common/router';
export default {
	data() {
		return {
			//设置默认的分享参数
			shareInfo: {
				title: '',
				path: '',
				imageUrl: ''
			},
		}
	},
	onLoad(options) {

		if (options.scene) {
			let scene = decodeURIComponent(options.scene);
			options.url = this.getQueryValue('url', scene);
			options.share_id = this.getQueryValue('share_id', scene);
		}
		if (options.share_id) {
			uni.setStorageSync('share_id', options.share_id);
			if (options.url) {
				let url = options.url;
				uni.setStorageSync('url', url);
			}
			store.dispatch('getUserInfo'); //实时触发获取用户信息，添加推广记录
		}
		if (options.url) {
			let url = options.url;
			uni.setStorageSync('url', url);
			if (url.indexOf('-') > -1) {
				url = url.split('-');
				switch (url[0]) {
					case 'goods': //跳转商品
						this.$Router.push({
							path: '/pages/goods/detail',
							query: {
								id: url[1]
							}
						});
						break;
						// ... 后续跳转活动判断
				}
			}
		}


		this.setShareInfo();
	},
	methods: {
		setShareInfo(query = {}) {
			let defaultShareInfo = store.state.init.initData.share;
			//设置跨端分享链接 小程序->H5 APP->H5
			var H5_URL = '';
			var domain = uni.getStorageSync('sysInfo')['domain'];
			if (domain) {
				H5_URL = domain
			} else {
				H5_URL = 'https://shopro.7wpp.com'
			}

			this.shareInfo = {
				// #ifdef H5
				title: 'Shopro开源商城',
				path: H5_URL,
				imageUrl: 'https://api.7wpp.com/shopro.png',
				// #endif
				// #ifdef MP-WEIXIN
				title: 'Shopro开源商城',
				path: '/pages/index/index',
				imageUrl: 'https://api.7wpp.com/shopro.png',
				// #endif
				// #ifdef APP-PLUS
				title: 'Shopro开源商城',
				path: H5_URL,
				imageUrl: 'https://api.7wpp.com/shopro.png',
				// #endif
			}
			if (defaultShareInfo) {
				this.shareInfo.title = defaultShareInfo.title;
				this.shareInfo.imageUrl = defaultShareInfo.image;
			}
			//判断用户登录 携带用户信息
			let userInfo = store.state.user.userInfo;
			if (userInfo && userInfo.id) {
				query.share_id = userInfo.id
			}
			//构造query参数链接
			this.shareInfo.path = this.setPathQuery(query);
			//微信网页 使用jssdk分享
			if (uni.getStorageSync('platform') === 'wxOfficialAccount') {

				wxsdk.share(this.shareInfo);
			}
		},
		// 全局自定义url字符串拼接的方法
		setPathQuery(query) {
			var url = this.shareInfo.path;
			if (JSON.stringify(query) != '{}') {
				let queryArr = [];
				for (const key in query) {
					if (query.hasOwnProperty(key)) {
						if (key === 'url') {
							queryArr.push(`${key}=${encodeURIComponent(query[key])}`)
						} else {
							queryArr.push(`${key}=${query[key]}`)
						}
					}
				}

				if (url.indexOf('?') !== -1) {
					url = `${url}&${queryArr.join('&')}`
				} else {
					url = `${url}?${queryArr.join('&')}`
				}
			}

			return url;
		},
		getQueryValue(queryName, scene) {
			var query = decodeURI(scene);
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0] == queryName) {
					return pair[1];
				}
			}
			return false;
		}
	},






	// #ifdef MP-WEIXIN

	onShareAppMessage(res) {

		return {
			title: this.shareInfo.title,
			path: this.shareInfo.path,
			imageUrl: this.shareInfo.imageUrl,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	}
	// #endif

}
