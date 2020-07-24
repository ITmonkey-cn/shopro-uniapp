<template>
	<view class="">
		<view class="goods-box x-start" v-if="!type" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
			<image class="goods-img" :src="detail.image" mode="aspectFill"></image>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.title }}</view>
				<slot name="tipTag"></slot>
				<view class="size-tip">{{ detail.goods_sku_text ? detail.goods_sku_text : '' }}</view>
				<slot name="goodsBottom">
					<view class="price">￥{{ detail.price }}</view>
				</slot>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'sku'" @tap="jump('/pages/goods/detail/index', { id: detail.id })">
			<image class="goods-img" :src="sku.image ? sku.image : detail.image" mode=""></image>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.title }}</view>
				<slot name="tipTag"></slot>
				<view class="size-tip">{{ sku.goods_sku_text ? sku.goods_sku_text : '' }}</view>
				<slot name="goodsBottom">
					<view class="price">￥{{ detail.price }}</view>
				</slot>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'favorite'" @tap="jump('/pages/goods/detail/index', { id: detail.goods.id })">
			<image class="goods-img" :src="detail.goods.image" mode=""></image>
			<view class="y-start">
				<view class="goods-title more-t">{{ detail.goods.title }}</view>
				<slot name="tipTag"></slot>
				<view class="sub-tip more-t">{{ detail.goods.subtitle }}</view>
				<slot name="goodsBottom">
					<view class="price">￥{{ detail.goods.price }}</view>
				</slot>
			</view>
		</view>
		<view class="goods-box x-start" v-if="type === 'order'">
			<image v-if="detail.activity_type" class="order-goods__tag" :src="orderStatus[detail.activity_type]" mode=""></image>
			<image class="goods-img" :src="detail.goods_image || ''" mode="aspectFill"></image>
			<view class="y-start order-right">
				<view class="goods-title more-t">{{ detail.goods_title || '' }}</view>
				<view class="order-tip one-t">
					<text class="order-num">数量:{{ detail.goods_num || 0 }};</text>
					{{ detail.goods_sku_text ? detail.goods_sku_text : '' }}
				</view>
				<view class="order-goods x-f ">
					<text class="order-price">￥{{ detail.goods_price || 0 }}</text>
					<button class="cu-btn status-btn" v-if="detail.status_name">{{ detail.status_name }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shoproMiniCard',
	components: {},
	data() {
		return {
			routerTo: this.$Router,
			orderStatus: {
				seckill: '/static/imgs/seckill_tag.png',
				groupon: '/static/imgs/groupon_tag.png'
			}
		};
	},
	props: {
		detail: {},
		sku: {},
		type: ''
	},
	computed: {},
	created() {},
	methods: {
		// 路由跳转
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		}
	}
};
</script>

<style lang="scss">
.goods-box {
	position: relative;
	.goods-img {
		height: 180rpx;
		width: 180rpx;
		background-color: #ccc;
		margin-right: 25rpx;
	}
	.order-goods__tag {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		width: 60rpx;
		height: 30rpx;
	}
	.goods-title {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		width: 450rpx;
		line-height: 40rpx;
		margin-bottom: 10rpx;
	}

	.size-tip {
		line-height: 40rpx;
		// background: #f4f4f4;
		// padding: 0 16rpx;
		font-size: 24rpx;
		color: #666;
	}
	.sub-tip {
		width: 480rpx;
		line-height: 40rpx;
		// background: #F6F2EA;
		font-size: 24rpx;
		color: #a8700d;
		margin: 10rpx 0;
	}

	.price {
		color: #e1212b;
	}
}
// order
.goods-box {
	.order-right {
		height: 180rpx;
	}
	.order-tip {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		width: 450rpx;
			margin-bottom: 20rpx;
		.order-num {
			margin-right: 10rpx;
		}
	}

	.order-goods {
		width: 480rpx;
	
		.status-btn {
			background: none;
			height: 32rpx;
			border: 1rpx solid rgba(207, 169, 114, 1);
			border-radius: 15rpx;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(168, 112, 13, 1);
			padding: 0 10rpx;
			margin-left: 20rpx;
			background:rgba(233,183,102,0.16);
		}
		.order-price {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
		}
	}
}
</style>
