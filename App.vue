<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import wechat from '@/shopro/wechat/wechat';

export default {
	globalData: {},
	onLaunch(options) {
		let that = this;
		// #ifdef H5
		that.$platform.entry();
		// #endif
		// #ifdef MP-WEIXIN
		// 检测小程序更新(如果从朋友圈场景进入则无此API)
		options.scene !== 1154 && wechat.checkMiniProgramUpdate();
		// #endif
		that.appInit(options);
		if (process.env.NODE_ENV === 'development') {
			this.syncPages();
		}
	},
	methods: {
		//应用初始化,获取模板数据，自动同步新页面到后台,获取用户信息
		...mapActions(['appInit', 'syncPages'])
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import 'static/font/shopro-icon.css';

/* 字体文件 */
@font-face {
	font-family: OPPOSANS;
	src: url('~@/static/font/OPPOSANS-M-subfont.ttf');
}
.font-OPPOSANS {
	font-family: OPPOSANS;
}
page {
	-webkit-overflow-scrolling: touch; // ios滑动不流畅
	height: 100%;
	background: #f6f6f6;
	width: 100%;
	font-size: 30rpx;
	font-family: OPPOSANS;
	word-break: break-all; //英文文本不换行
	color: $u-main-color;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
	display: none;
}
</style>
