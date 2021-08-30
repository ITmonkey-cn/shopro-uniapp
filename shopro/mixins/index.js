/**
 * MixinIndex v1.0.0
 * @description shopro-mixin-index 1.0.0 shopro全局入口组件
 * @Author lidongtony
 * @Date 2021-04-18
 * @Email lidongtony@qq.com
 */

import store from '@/shopro/store'
import share from '@/shopro/share'
import http from '@/shopro/request'
import $platform from '@/shopro/platform'
import {
	router
} from '@/shopro/router'
export default {
	onLoad(options) {
		let that = this;
		// 后端拼接的具体page页面 直接进入 （如订阅消息场景下直接跳转）
		// #ifdef MP
		if (options?.scene) {
			let scene = decodeURIComponent(options.scene);
			let sceneObj = scene.split('=');
			options[sceneObj[0]] = sceneObj[1];
		}
		// #endif
		if (options?.page) {
			router.push({
				path: decodeURIComponent(options.page)
			})
		}
		if (options?.custom_id) {
			router.push({
				path: '/pages/index/view',
				query: {
					id: options.custom_id
				}
			})
		}
		if (options?.spm) {
			let shareParams = share.getShareQuery(options.spm);
			// 保存推荐信息
			if (shareParams.shareUserId) {
				if (store.getters.isLogin) {
					http('common.shareAdd', {
						spm: options.spm
					});
				} else {
					uni.setStorageSync('spm', options.spm);
				}
			}
			// 跳转分享路径
			let page = {};
			if (shareParams.page) {
				page.path = shareParams.page;
			}
			if (shareParams.pageId) {
				page.query = {
					id: shareParams.pageId
				}
			}
			if (page.path) {
				router.push(page);
			}
		}
	},
	// #ifdef MP-WEIXIN
	onShareAppMessage(res) {
		let that = this;
		// uni.$emit('ON_WX_SHARE')
		let shareInfo = store.getters.shareInfo;
		return {
			title: shareInfo.title,
			path: shareInfo.path,
			imageUrl: shareInfo.image,
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
			},
			complete() {}
		}
	},
	onShareTimeline(res) {
		let that = this;
		let shareInfo = store.getters.shareInfo;
		let query = shareInfo.query;
		//携带当前页面资源ID参数
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		let options = currentPage.options;
		if (JSON.stringify(options) != '{}' && options.id) {
			query += `&id=${options.id}`;
		}

		return {
			title: shareInfo.title,
			query: query,
			imageUrl: shareInfo.image,
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
			},
			complete() {}
		}
	}
	// #endif
}
