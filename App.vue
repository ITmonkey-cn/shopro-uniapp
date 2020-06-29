<script>
import Vue from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import Wechat from './common/wechat/wechat';
import store from '@/common/store';

export default {
	methods: {
		...mapActions(['getAppInit', 'getTemplate', 'getRoutes', 'getUserInfo', 'setTokenAndBack']),
		init(options) {
			return Promise.all([this.setAppInfo(), this.getTemplate(options), this.getAppInit(options)]);
		},
		// 获取系统栏高度
		async setAppInfo() {
			let that = this;
			let platform = '';
			return new Promise((resolve, reject) => {
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
			resolve(platform)
			})
		},
		// 自动登录
		async autoLogin(data) {
			let initData = data;
			var wechat = new Wechat();
			if (initData.wechat.autologin && !uni.getStorageSync('token')) {
				console.log('自动登录状态', initData.wechat.autologin);
				// #ifdef H5
				uni.setStorageSync('appid', initData.wechat.appid);
				let token = await wechat.login();
				this.setTokenAndBack(token);
				// #endif
				// #ifdef MP-WEIXIN
				wechat.checkMiniProgramUpdate();
				wechat.login();
				// #endif
			}
		}
	},
	onLaunch: async function(options) {
		// 自定义底部导航，控制显示隐藏。
		this.init(options)
			.then(res => {
				this.autoLogin(res[2].data);
				this.getRoutes();
			})
			.catch(err => {
				console.log(err);
			});
	},
	onShow: function() {
		this.$store.commit('CART_NUM');
	},
	onHide: function() {}
};
</script>

<style lang="scss">
@import 'static/colorui/main.css';
@import 'static/colorui/icon.css';
@import 'static/font/shopro-icon.css';

// 其他scss集成在uni.scss,(变量,class,minix)

page {
	-webkit-overflow-scrolling: touch; //ios滑动不流畅
	height: 100%;
	background: #f6f6f6;
	width: 100%;
	font-size: 30upx;
	font-family: NotoSansHans-Bold;
	color: #333;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}
</style>
