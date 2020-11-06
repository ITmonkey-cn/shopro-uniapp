<!-- 推广商品 -->
<template>
	<view class="promotion-goods-wrap">
		<view class="goods-list x-f" v-for="item in goodsList" :key="item.goods_id">
			<view class="img-box"><image class="goods-img" :src="item.goods.image" mode=""></image></view>
			<view class="goods-info y-bc">
				<view class="goods-title one-t">{{ item.goods.title }}</view>
				<view class="goods-des one-t">{{ item.goods.subtitle }}</view>
				<view class="goods-price x-f">
					<view class="price">￥{{ item.goods.price }}</view>
					<view class="origin-price">￥{{ item.goods.original_price }}</view>
				</view>
				<view class="commission-num">预计佣金：￥{{ item.commission_money }}</view>
			</view>
			<button class="share-btn cu-btn">分享赚</button>
		</view>
		<!-- 更多 -->
		<view v-if="goodsList.length" style="height: 3em;" class="cu-load text-gray" :class="loadStatus"></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			goodsList: [], //分销商品
			loadStatus: '', //loading,over
			currentPage: 1,
			lastPage: 1
		};
	},
	computed: {},
	onLoad() {
		this.getGoodList();
	},
	onReachBottom() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getGoodList();
		}
	},
	methods: {
		getGoodList() {
			let that = this;
			that.loadStatus = 'loading';
			that.$api('commission.goods', {
				page: that.currentPage
			}).then(res => {
				if (res.code === 1) {
					that.goodsList = [...that.goodsList, ...res.data.data];
					that.lastPage = res.data.last_page;
					if (that.currentPage < res.data.last_page) {
						that.loadStatus = '';
					} else {
						that.loadStatus = 'over';
					}
				}
			});
		}
	}
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
