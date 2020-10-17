<!-- 佣金明细 -->
<template>
	<view class="page_box">
		<view class="head_box x-bc">
			<button class="cu-btn date-btn">
				2020年10月
				<text class="cuIcon-triangledownfill"></text>
			</button>
			<view class="total-box">收入￥2100 &emsp;支出￥2100</view>
		</view>
		<view class="content_box">
			<!-- 佣金明细列表 -->
			<view class="log-item x-bc" v-for="item in 6" :key="item">
				<view class="item-left x-f">
					<image class="log-img" src="/static/imgs/app_icon/icon1.png" mode=""></image>
					<view class="y-start">
						<view class="log-name">这是昵称</view>
						<view class="log-notice">成功邀请好友“小铃铛”注册</view>
					</view>
				</view>
				<view class="item-right y-end">
					<view class="log-num">-50.00</view>
					<view class="log-date">2020.04.22</view>
				</view>
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
// 表头
.head_box {
	height: 120rpx;
	padding: 0 30rpx;
	.date-btn {
		background-color: #fff;
		height: 54rpx;
		border-radius: 27rpx;
		padding: 0;
		padding-left: 20rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
		.cuIcon-triangledownfill {
			font-size: 60rpx;
			color: #e5e5e5;
		}
	}
	.total-box {
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
	}
}
// 佣金明细列表
.log-item {
	height: 142rpx;
	background-color: #fff;
	padding: 0 30rpx;
	border-bottom: 1rpx solid #eee;
	.item-left {
		.log-img {
			width: 50rpx;
			height: 50rpx;
			border-radius: 50%;
			margin-right: 24rpx;
		}
		.log-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 12rpx;
		}
		.log-notice {
			font-size: 22rpx;
			font-weight: 500;
			color: #c0c0c0;
		}
	}
	.item-right {
		.log-num {
			font-size: 28rpx;
			font-weight: 500;
			color: #05c3a1;
		}
		.log-date {
			font-size: 24rpx;
			font-weight: 400;
			color: #c0c0c0;
		}
	}
}
</style>
