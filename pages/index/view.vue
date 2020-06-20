<template>
	<view class="page_box">
		<view class="head_box">
			
		</view>
		<view class="content_box">
		</view>
		<view class="foot_box"></view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
		<!-- 强制登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<sh-force-login></sh-force-login>
		<!-- #endif -->
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
	components:{},
	data() {
		return {
			
		};
	},
	computed:{},
	onLoad() {},
	methods: {},

};
</script>

<style lang="scss">
	
</style>
