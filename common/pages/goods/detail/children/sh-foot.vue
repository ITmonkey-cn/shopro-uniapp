<template>
	<view>
		<!-- 积分商品foot -->
		<view class="sh-foot-box x-f" v-if="!showSku && !showServe">
			<view class="left x-f">
				<view class="tools-item y-f" @tap="goHome">
					<image class="tool-img" src="http://shopro.7wpp.com/imgs/tabbar/tab_home_sel.png" mode=""></image>
					<text class="tool-title">首页</text>
				</view>
			</view>
			<view class="right">
				<view class="btn-box x-ac"><button class="cu-btn  seckill-btn" @tap="goPay">立即兑换</button></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	methods: {
		// 回到首页
		goHome() {
			this.$tools.routerTo('/pages/index/index');
		},
		// 去支付
		goPay() {
			this.showSku = true;
		}
	}
};
</script>

<style lang="scss">
.sh-foot-box {
	height: 110rpx;
	background: rgba(255, 255, 255, 1);
	border-top: 1rpx solid rgba(238, 238, 238, 1);
	width: 100%;
	position: fixed;
	bottom: 0;
	z-index: 999;
	.left,
	.right {
		flex: 1;
	}

	.tools-item {
		flex: 1;
		height: 100%;

		.tool-img {
			width: 46rpx;
			height: 46rpx;
		}

		.tool-title {
			font-size: 22rpx;
			line-height: 22rpx;
			padding-top: 8rpx;
		}
	}

	.btn-box {
		flex: 1;
		.seckill-btn {
			width: 600rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(49, 133, 243, 1), rgba(80, 205, 242, 1));
			box-shadow: 0px 7px 6px 0px rgba(80, 205, 242, 0.2);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			margin-right: 20rpx;
		}
	}
}
</style>
