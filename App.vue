<script>
import Vue from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import Wechat from './common/wechat/wechat';
import store from '@/common/store';

export default {
	methods: {
		...mapActions(['getAppInit', 'getRoutes', 'getUserInfo']),
		init(options) {
			return Promise.all([this.getStatusBar(), this.getAppInit(options)]);
		},
		// 获取系统栏高度
		getStatusBar() {
			let that = this;
			let platform = '';
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.StatusBar = e.statusBarHeight;

					// #ifdef H5
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
					if (that.$wxsdk.isWechat()) {
						platform = 'wxOfficialAccount';
					} else {
						platform = 'H5';
					}
					// #endif

					// #ifdef APP-PLUS
					platform = 'App';
					if (e.platform == 'android') {
						uni.setStorageSync('isAndroid', true);
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
						uni.setStorageSync('isAndroid', false);
					}
					// #endif

					// #ifdef MP-WEIXIN
					platform = 'wxMiniProgram';
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif
				}
			});
			uni.setStorageSync('platform', platform);
		},
		// 自动登录
		async autoLogin(data) {
			let initData = data;
			let wechat = new Wechat();
			// #ifdef MP-WEIXIN
			wechat.checkMiniProgramUpdate();
			// #endif

			// #ifdef H5
			uni.setStorageSync('appid', initData.wechat.appid);
			// #endif
			if (initData.wechat.autologin && !uni.getStorageSync('token')) {
				console.log('自动登录状态', initData.wechat.autologin);
				let token = await wechat.login();
				console.log('ah', token);
				this.$Router.push({
					path: '/pages/public/login',
					query: {
						token: token
					}
				});
			}
		}
	},
	onLaunch: async function(options) {
		this.init(options)
			.then(res => {
				// this.getShareInfo();
				this.autoLogin(res[1].data);
				this.getRoutes();
				// this.getUserInfo();
			})
			.catch(err => {
				console.log(err);
			});
	},
	onShow: function() {
		// console.log('App Show');
		let cartNum = store.state.cart.cartNum;
		this.$store.commit('CART_NUM', cartNum);
		// let theme = uni.getStorageSync('themeKey');
		// this.$store.commit('SET_THEME', theme);
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'static/colorui/main.css';
@import 'static/colorui/icon.css';
@import 'static/font/shopro-icon.css';

// 其他scss集成在uni.scss,(变量,class,minix)

@font-face {
	font-family: miso;
	src: url('https://api.7wpp.com/miso.ttf') format('truetype');
}
.miso-font {
	font-family: 'miso';
	line-height: 30 rpx;
}
page {
	-webkit-overflow-scrolling: touch; //ios滑动不流畅
	height: 100%;
	background: #f6f6f6;
	width: 100%;
	font-size: 30upx;
	font-family: NotoSansHans-Bold;
	color: #333;
	overflow-x: hidden;
}
</style>
