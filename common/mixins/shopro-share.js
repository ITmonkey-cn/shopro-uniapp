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
				title: '',    //分享标题
				path: '',     //转发链接  小程序转发只有页面链接和参数,其他全部带域名
				imageUrl: '', //分享图片
				copyLink: ''  //复制链接地址  复制的链接都是WAP版链接地址
			},
		}
	},
	onLoad(options) {
		let that = this;
		//每个页面设置分享信息
		that.setShareInfo();
		//用户进入识别判断流程
		// 1.解析进入信息
		if (options.scene) {
			let scene = decodeURIComponent(options.scene);
			options.url = this.getQueryValue('url', scene);
		    options.share_id = this.getQueryValue('share_id', scene);
		}
		// 2.保存推荐人信息
		if (options.share_id) {
			uni.setStorageSync('share_id', options.share_id);
			if (options.url) {
				let url = options.url;
				uni.setStorageSync('url', url);
			}
			store.dispatch('getUserInfo'); //实时触发获取用户信息，添加推广记录
		}
		// 3.识别分享后跳转路径
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
	},
	methods: {
		setShareInfo(scene = {
			title: '',  //自定义分享标题
			image: '',  //自定义分享图片
			query: {}   //自定义分享参数
		}) {
			let that = this;
			uni.getStorage({
				key: 'shareInfo',
				success(e) {
					var defaultShareInfo = e.data;
					var domain = uni.getStorageSync('sysInfo')['domain'];
					var platform = uni.getStorageSync('platform');
					if(domain === '' || defaultShareInfo.title === '' || defaultShareInfo.image === '') {
						uni.showToast({
							title: '请设置商城域名和分享信息'
						})
					}
					//设置自定义分享标题
					if(scene.title != '') {
						that.shareInfo.title = scene.title;
					}else {
						that.shareInfo.title = defaultShareInfo.title;
					}
					//设置分享图片
					if(scene.image != '') {
						that.shareInfo.imageUrl = scene.image;
					}else {
						that.shareInfo.imageUrl = defaultShareInfo.image;
					}
					//判断用户登录 携带用户信息
					let userInfo = store.state.user.userInfo;
					if (userInfo && userInfo.id) {
						scene.query.share_id = userInfo.id
					}
					//构造query参数链接
					that.shareInfo.path = ''
					let urlQuery = that.setPathQuery(scene.query);
					if(platform === 'wxMiniProgram') {
						that.shareInfo.path = '/pages/index/index' + urlQuery;
						that.shareInfo.copyLink = domain + urlQuery;
					}else{
						that.shareInfo.path = domain + urlQuery;
						that.shareInfo.copyLink = domain + urlQuery;
					}
					//微信网页 使用jssdk分享 此处针对没有交互就进行分享转发的微信公众号用户
					if (platform === 'wxOfficialAccount') {
						wxsdk.share(that.shareInfo);
					}
				}
			})
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
		let that = this;
		return {
			title: that.shareInfo.title,
			path: that.shareInfo.path,
			imageUrl: that.shareInfo.imageUrl,
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
