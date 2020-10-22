<!-- 提现记录 -->
<template>
	<!-- 记录卡片 -->
	<view class="wallet-log-box">
		<view class="log-list" v-for="item in 4" :key="item">
			<view class="head x-bc">
				<view class="title">提现至中国银行卡</view>
				<view class="num">+1.00</view>
			</view>
			<view class="status-box item x-bc">
				<view class="x-f">
					<text class="cuIcon-roundcheck item-icon"></text>

					<text class="item-title">申请状态</text>
				</view>
				<view class="status-text">提现中</view>
			</view>
			<view class="time-box item x-bc">
				<view class="x-f">
					<text class="cuIcon-time item-icon"></text>
					<text class="item-title">提现时间</text>
				</view>
				<view class="time">2020.04.22 20:05:15</view>
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
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
// 记录卡片
.log-list {
	height: 213rpx;
	background: #ffffff;
	margin-bottom: 20rpx;
	.head {
		padding: 0 35rpx;
		height: 80rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 20rpx;
		.title {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
		.num {
			font-size: 28rpx;
			font-weight: 500;
			color: #7063d2;
		}
	}
	.item {
		padding: 0 30rpx 10rpx;
		.item-icon {
			color: #c0c0c0;
			font-size: 36rpx;
			margin-right: 8rpx;
		}
		.item-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
		.status-text {
			font-size: 24rpx;
			font-weight: 500;
			color: #05c3a1;
		}
		.time {
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
	}
}
</style>
