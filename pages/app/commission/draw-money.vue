<!-- 提现 -->
<template>
	<view class="draw-money-wrap">
		<view class="head-box">
			<cu-custom isBack>
				<block slot="backText"><text class="head-title">提现</text></block>
			</cu-custom>
			<!-- 可提现 -->
			<view class="wallet-num-box x-bc">
				<view class="">
					<view class="num-title">可提现金额（元）</view>
					<view class="wallet-num">81999.00</view>
				</view>
				<button class="cu-btn log-btn">提现记录</button>
			</view>
		</view>
		<!-- 提现输入卡片-->
		<view class="draw-card">
			<view class="card-title">提现金额</view>
			<view class="input-box x-f">
				<text calss="unit">￥</text>
				<input type="number" v-model="money" />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			money: '' //提现金额
		};
	},
	computed: {},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.head-box {
	background-color: #4d3cbe;
	/deep/ .cu-back {
		color: #fff;
		font-size: 40rpx;
	}
	.head-title {
		font-size: 38rpx;
		color: #fff;
	}
	.wallet-num-box {
		padding: 40rpx;
		.num-title {
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
			margin-bottom: 20rpx;
		}
		.wallet-num {
			font-size: 60rpx;
			font-weight: 500;
			color: #ffffff;
		}
		.log-btn {
			width: 170rpx;
			height: 60rpx;
			background: rgba(255, 255, 255, 0.1);
			border: 1rpx solid #eeeeee;
			border-radius: 30rpx;
			padding: 0;
			font-size: 26rpx;
			font-weight: 500;
			color: #ffffff;
		}
	}
}
</style>
