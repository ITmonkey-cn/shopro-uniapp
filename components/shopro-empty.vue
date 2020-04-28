<template>
	<view class="shopro-empty y-f">
		<image class="empty-img" :src="emptyData.img" mode="aspectFill"></image>
		<view class="empty-text">{{ emptyData.tip }}</view>
		<view class="btn-box" v-if="emptyData.path">
			<button class="cu-btn empty-btn" @tap="routerTo">{{ emptyData.pathText }}</button>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		emptyData: {}
	},
	computed: {},
	methods: {
		routerTo() {
			let path = this.emptyData.path;
			if (this.emptyData.path.indexOf('/pages/index') === 0) {
				this.$Router.pushTab({
					path: path
				});
			} else {
			
				this.$Router.push({
					path: path,
					query: parmas
				});
			}
		}
	}
};
</script>

<style lang="scss">
.empty-img {
	width: 540rpx;
	height: 290rpx;
}
.empty-text {
	font-size: 26rpx;
	color: #999;
}
.btn-box {
	margin-top: 100rpx;
	.empty-btn {
		width: 320rpx;
		height: 70rpx;
		background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
		border-radius: 35rpx;
		font-size: 28rpx;
		color: rgba(#fff, 0.9);
	}
}
</style>
