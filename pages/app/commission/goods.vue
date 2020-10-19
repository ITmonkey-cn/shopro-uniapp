<!-- 推广商品 -->
<template>
	<view class="promotion-goods-wrap">
		<view class="goods-list x-f" v-for="item in 4 " :key="item">
			<view class="img-box"><image class="goods-img" src="/static/imgs/user/shop_qrcode.png" mode=""></image></view>
			<view class="goods-info y-bc">
				<view class="goods-title one-t">泰国TSM防晒喷雾学生户外泰国TSM防晒喷雾学生户外</view>
				<view class="goods-des one-t">高效防晒，清爽不油腻</view>
				<view class="goods-price x-f">
					<view class="price">￥339</view>
					<view class="origin-price">￥499</view>
				</view>
				<view class="commission-num">预计佣金：￥60</view>
			</view>
			<button class="share-btn cu-btn">分享赚</button>
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
.promotion-goods-wrap {
	background-color: #fff;
}
// 推广商品列表
.goods-list {
	padding: 30rpx;
	border-bottom: 1rpx solid rgba(#dfdfdf, 0.5);
	position: relative;
	.share-btn {
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		width: 160rpx;
		height: 60rpx;
		background: linear-gradient(90deg, #a36fff, #5336ff);
		box-shadow: 0px 7rpx 11rpx 2rpx rgba(124, 103, 214, 0.34);
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
	}
	.img-box {
		border: 1rpx solid rgba(223, 223, 223, 0.43);
		margin-right: 30rpx;
		.goods-img {
			width: 200rpx;
			height: 200rpx;
		}
	}
	.goods-info {
		align-items: flex-start;
		height: 200rpx;
		.goods-title {
			width: 358rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			margin-bottom: 10rpx;
		}
		.goods-des {
			font-size: 22rpx;
			font-weight: 500;
			color: #a8700d;
			margin-bottom: 10rpx;
		}
		.goods-price {
			margin-bottom: 10rpx;
			.price {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				margin-right: 16rpx;
			}
			.origin-price {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				text-decoration: line-through;
				color: #999999;
			}
		}
		.commission-num {
			font-size: 24rpx;
			font-weight: 500;
			color: #5e4ddf;
		}
	}
}
</style>
