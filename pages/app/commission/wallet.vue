<!-- 佣金钱包 -->
<template>
	<view class="wallet-wrap">
		<!-- 钱包卡片 -->
		<view class="wallet-card">
			<view class="head-box x-f">
				<view class="head-title">当前余额</view>
				<text class="cuIcon-attentionfill head-icon"></text>
			</view>
			<view class="card-num">265993.00</view>
			<view class="card-bottom x-bc">
				<view class="card-item y-start">
					<view class="item-title">总收益</view>
					<view class="item-value">22000.00</view>
				</view>
				<view class="card-item y-start">
					<view class="item-title">待入账佣金</view>
					<view class="item-value">22000.00</view>
				</view>
			</view>
			<button class="cu-btn draw-btn">提现</button>
		</view>
		<!--  -->
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
// 我的钱包
.wallet-wrap {
	background-color: #fff;
	height: 100%;
	display: flex;
	flex: 1;
}
// 钱包卡片
.wallet-card {
	width: 690rpx;
	height: 301rpx;
	background: #796cd6;
	border-radius: 20rpx;
	margin: 30rpx auto;
	padding: 30rpx;
	position: relative;
	.head-box {
		margin-bottom: 30rpx;
		.head-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.head-icon {
			font-size: 30rpx;
			margin-left: 20rpx;
			color: #fff;
		}
	}
	.card-num {
		font-size: 40rpx;
		font-weight: 500;
		color: #fefefe;
		margin-bottom: 40rpx;
	}
	.card-bottom {
		.card-item {
			.item-title {
				font-size: 24rpx;
				font-weight: 400;
				color: #ffffff;
				margin-bottom: 10rpx;
			}
			.item-value {
				font-size: 30rpx;
				font-weight: 500;
				color: #fefefe;
			}
		}
	}
	.draw-btn {
		position: absolute;
		top: 35rpx;
		right: 35rpx;
		width: 121rpx;
		height: 58rpx;
		background: #ffffff;
		border-radius: 29rpx;
		padding: 0;
		font-size: 24rpx;
		font-weight: 500;
		color: #5848c4;
	}
}
</style>
