<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box"><uni-parser :html="richText.content"></uni-parser></view>
		<view class="foot_box"></view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 自定义底部导航 -->
		<shopro-tabbar></shopro-tabbar>
		<!-- 关注弹窗 -->
		<shopro-float-btn></shopro-float-btn>
		<!-- 连续弹窗提醒 -->
		<shopro-notice-modal></shopro-notice-modal>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			richText: ''
		};
	},
	computed: {},
	onLoad() {
		this.init();
	},
	methods: {
		init() {
			return Promise.all([this.getRichText()]);
		},
		getRichText() {
			this.$api('richtext', {
				id: this.$Route.query.id
			}).then(res => {
				this.richText = res.data;
				uni.setNavigationBarTitle({
					title: res.data.title
				});
			});
		}
	}
};
</script>

<style lang="scss">
.content_box {
	background: #fff;
	padding: 30rpx;
}
</style>
