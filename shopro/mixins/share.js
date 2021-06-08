/**
 * MixinShare v1.0.0
 * @description shopro-mixin-share 1.0.0 shopro全局分享组件
 * @Author lidongtony
 * @Date 2021-04-18
 * @Email lidongtony@qq.com
 */
import store from '@/shopro/store';
import {
	mapMutations,
	mapActions,
	mapState
} from 'vuex';
export default {
	data() {
		return {
			shareInfo: {}
		}
	},
	// 是否登录
	computed: {
		shareData: {
			get() {
				this.shareInfo = store.state.shopro.shareInfo;
				return store.state.shopro.shareInfo;
			},
			set(val) {
				this.shareInfo = val;
			}
		}
	},
	// #ifdef MP-WEIXIN
	onShareAppMessage(res) {
		let that = this;
		uni.$emit('ON_WX_SHARE')
		return {
			title: that.shareInfo.title,
			path: that.shareInfo.path,
			imageUrl: that.shareInfo.image,
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
		let query = that.shareInfo.query;
		//携带当前页面资源ID参数
		let currentPage = getCurrentPages()[getCurrentPages().length - 1];
		let options = currentPage.options;
		if (JSON.stringify(options) != '{}' && options.id) {
			query += `&id=${options.id}`;
		}

		return {
			title: that.shareInfo.title,
			query: query,
			imageUrl: that.shareInfo.image,
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
