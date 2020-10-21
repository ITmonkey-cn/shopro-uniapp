<!-- 分销订单 -->
<template>
	<view class="page_box commission-order-wrap">
		<!-- 状态分类 -->
		<view class="head_box x-f">
			<view class="state-item flex-sub " v-for="(state, index) in statusList" :key="state" @tap="onTab(index)">
				<text class="state-title" :class="{ 'title-active': stateCurrent == index }">{{ state }}</text>
				<text class="underline" :class="{ 'underline-active': stateCurrent == index }"></text>
			</view>
		</view>
		<view class="content_box">
			<!-- 订单列表 -->
			<view class="order-list" v-for="item in 3" :key="item">
				<view class="order-head x-bc">
					<text class="order-code">订单编号：25689456336</text>
					<text class="order-state">已入账</text>
				</view>
				<view class="order-from x-bc">
					<view class="from-user x-f">
						<text>下单人：</text>
						<image class="user-avatar" src="/static/imgs/app_icon/icon1.png" mode=""></image>
						<text class="user-name">清风一叶</text>
					</view>
					<view class="order-time">2020.10.22 17:00:00</view>
				</view>
				<view class="goods-card x-bc">
					<view class="goods-img-box"><image class="goods-img" src="/static/imgs/user/shop_info.png" mode=""></image></view>
					<view class="goods-info y-bc">
						<view class="goods-title more-t">Stradivarius 秋冬新款女士短款机车风夹克外套2019潮08820199004</view>
						<view class="goods-sku">数量: 1；白色 L</view>
						<view class="goods-price">339.90</view>
					</view>
				</view>
				<view class="total-box x-bc">
					<view class="num-price">共1件商品， 实付款:￥339.90</view>
					<view class="x-f">
						<text class="name">佣金</text>
						<text class="commission-num">80.00</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			stateCurrent: 0, //默认
			statusList: ['全部', '已入账', '待入账', '已退款'] //状态列表
		};
	},
	computed: {},
	onLoad() {},
	methods: {
		// 切换分类
		onTab(index){
			this.stateCurrent = index
		}
	}
};
</script>

<style lang="scss">
// 状态分类
.head_box {
	width: 750rpx;
	height: 95rpx;
	background: #ffffff;
}
.state-item {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.state-title {
		color: #666;
		font-weight: 500;
		font-size: 28rpx;
		line-height: 90rpx;
	}
	.title-active {
		color: #333;
	}
	.underline {
		display: block;
		width: 68rpx;
		height: 4rpx;
		background: #fff;
		border-radius: 2rpx;
	}
	.underline-active {
		background: #5e49c3;
		display: block;
		width: 68rpx;
		height: 4rpx;
		border-radius: 2rpx;
	}
}
// 订单列表
.order-list {
	background-color: #fff;
	margin-top: 20rpx;
	.order-head {
		padding: 20rpx;
		.order-code {
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
		}
		.order-state {
			font-size: 26rpx;
			font-weight: 500;
			color: #05c3a1;
		}
	}
	.order-from {
		background-color: #f9f9f9;
		padding: 20rpx;
		.from-user {
			font-size: 24rpx;
			font-weight: 400;
			color: #666666;
			.user-avatar {
				width: 26rpx;
				height: 26rpx;
				border-radius: 50%;
				margin-right: 8rpx;
			}
			.user-name {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}
		.order-time {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
	}
	.goods-card {
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #dfdfdf;
		.goods-img-box {
			margin-right: 30rpx;
			.goods-img {
				width: 160rpx;
				height: 160rpx;
			}
		}
		.goods-info {
			height: 160rpx;
			align-items: flex-start;
			.goods-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
			.goods-sku {
				font-size: 24rpx;
				font-weight: 400;
				color: #666666;
			}
			.goods-price {
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				&::before {
					content: '￥';
					font-size: 20rpx;
				}
			}
		}
	}
	.total-box {
		height: 80rpx;
		padding: 0 20rpx;
		.num-price {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.name {
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
		}
		.commission-num {
			font-size: 30rpx;
			font-weight: 400;
			color: #eb2b3d;
			&::before {
				content: '￥';
				font-size: 22rpx;
			}
		}
	}
}
</style>
