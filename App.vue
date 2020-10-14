<script>
import Vue from 'vue';
import { mapMutations, mapActions, mapState } from 'vuex';
import Wechat from './common/wechat/wechat';
import store from '@/common/store';

export default {
	methods: {
		//应用初始化,获取模板,获取页面路由,获取用户信息,保存用户Token并返回初始进入页面
		...mapActions(['getAppInit', 'getTemplate', 'getRoutes', 'getUserInfo', 'setTokenAndBack']),
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
						new Wechat().getWxMiniProgramSessionKey();
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif
						uni.setStorageSync('platform', platform);
						resolve(platform);
					}
				});
			});
		},
		// 自动登录
		async autoLogin(data) {
			let initData = data;
			var wechat = new Wechat();
			if (initData.wechat.autologin && !uni.getStorageSync('token')) {
				// #ifdef H5
				uni.setStorageSync('appid', initData.wechat.appid);
				let token = await wechat.login();
				this.setTokenAndBack(token);
				// #endif
				// #ifdef MP-WEIXIN
				wechat.login();
				// #endif
			}
		}
	},
	onLaunch: async function(options) {
		if (options.query.mode === 'save') {
			//截图模式
			uni.setStorageSync('screenShot', true);
			uni.setStorageSync('shop_id', options.query.shop_id);
		}
		// #ifdef MP-WEIXIN
		if(options.scene !== 1154) {
			var wechat = new Wechat();
			wechat.checkMiniProgramUpdate();	
		}
		// #endif
		await this.setAppInfo();
		await this.getTemplate(options);
		let init = await this.getAppInit(options);
		await this.autoLogin(init.data);
		await this.getRoutes();
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

uni-radio:not([disabled]) .uni-radio-input:hover,
uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
	border-color: #ccc !important;
}

page {
	-webkit-overflow-scrolling: touch; //ios滑动不流畅
	height: 100%;
	background: #f6f6f6;
	width: 100%;
	font-size: 30upx;
	font-family: NotoSansHans-Bold;
	word-break: break-all; //英文文本不换行
	color: #333;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}
</style>
