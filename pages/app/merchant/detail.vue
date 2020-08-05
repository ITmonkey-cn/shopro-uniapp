<template>
	<view class="order-detail-wrap">
		<!-- 订单卡片 -->
		<view class="card-box"></view>
		<!-- 订单信息 -->
		<view class="order-detail-card">
			<view class="card-title x-f">订单信息</view>
			<view class="detial-content">
				<view class="detail-item x-f">
					<view class="item-title">订单状态：</view>
					<view class="item-content">已完成</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">订单编号：</view>
					<view class="item-content">45456456565656</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">下单时间：</view>
					<view class="item-content">2050年5月13日 16:42</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">备注：</view>
					<view class="item-content">多送一枚扣子</view>
				</view>
			</view>
		</view>
		<!-- 自提信息 -->
		<view class="order-detail-card">
			<view class="card-title x-f">到店/自提信息</view>
			<view class="detial-content">
				<view class="detail-item x-f">
					<view class="item-title">到店时间：</view>
					<view class="item-content">2050年5月13日 16:42</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">预留电话：</view>
					<view class="item-content">45456456565656</view>
				</view>
				<view class="detail-item address-item">
					<view class="item-title">门店地址：</view>
					<view class="item-content address-content">郑州市郑东新区运动场东路龙宇国际A座紫月星辰小店</view>
				</view>
			</view>
		</view>
		<!-- 配送信息 -->
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
.order-detail-card {
	background-color: #fff;
	margin: 20rpx 0;
	.card-title {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		height: 80rpx;
		padding: 0 20rpx;
		border-bottom: 1rpx solid rgba(223, 223, 223, 0.5);
	}
	.detial-content {
		padding: 20rpx;
		.detail-item {
			min-height: 60rpx;
			.item-title {
				font-size: 28rpx;
				color: #999;
			}
			.item-content {
				font-size: 26rpx;
				color: #333;
			}
		}
		.address-item {
			display: flex;
			.address-content {
				width: 550rpx;
			}
		}
	}
}
</style>
