<!-- 添加评论 -->
<template>
	<view class="commont-from-wrap">
		<!-- 评价商品 -->
		<view class="goods-card">
			<shopro-mini-card :title="goodsDetail.goods_title" :image="goodsDetail.goods_image">
				<template #describe>
					<view class="order-sku u-ellipsis-1">
						<text class="order-num">数量:{{ goodsDetail.goods_num || 0 }};</text>
						{{ goodsDetail.goods_sku_text ? goodsDetail.goods_sku_text : '' }}
					</view>
				</template>
				<template #cardBottom>
					<view class="order-price-box u-flex ">
						<text class="order-price font-OPPOSANS">￥{{ goodsDetail.goods_price || 0 }}</text>
						<button class="u-reset-button status-btn" v-if="goodsDetail.status_name">{{ goodsDetail.status_name }}</button>
					</view>
				</template>
			</shopro-mini-card>
		</view>

		<view class="form-item">
			<view class="star-box u-flex">
				<view class="star-title u-m-r-40">{{ starTip }}</view>
				<u-rate v-model="star" minCount="1"></u-rate>
			</view>
			<view class="area-box">
				<textarea class="inp-area" v-model="message" placeholder="宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧~" placeholder-class="pl-style" />
				<view class="img-box">
					<u-upload
						:showProgress="false"
						@on-uploaded="uploadSuccess"
						@on-remove="uploadRemove"
						:action="`${$BASE_URL}/api/common/upload`"
						:header="{token: token}"
						width="138"
						height="138"
						maxCount="9"
					></u-upload>
				</view>
			</view>
		</view>
		<view class="foot_box u-flex u-row-center u-col-center u-m-t-60"><button class="u-reset-button post-btn" @tap="subComment">发布</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			imgList: [],
			star: 5,
			message: '',
			goodsDetail: {},
			token: uni.getStorageSync('token')
		};
	},
	computed: {
		starTip() {
			let text = '';
			if (this.star <= 1) {
				text = '差评';
			}
			if (this.star > 1 && this.star <= 3) {
				text = '中评';
			}
			if (this.star >= 4) {
				text = '好评';
			}
			return text;
		}
	},
	onLoad() {
		this.getOrderItemDetail();
	},
	methods: {
		// 订单详情
		getOrderItemDetail() {
			let that = this;
			that.$http('order.itemDetail', {
				id: that.$Route.query.orderId,
				order_item_id: that.$Route.query.orderItemId
			}).then(res => {
				if (res.code === 1) {
					that.goodsDetail = res.data;
				}
			});
		},

		// 上传图片成功
		uploadSuccess(e) {
			this.imgList = [];
			e.forEach(item => {
				this.imgList.push(item.response.data.url);
			});
		},

		// 移除图片
		uploadRemove(index) {
			this.imgList.splice(index, 1);
		},

		subComment() {
			let that = this;
			that.$http('order.comment', {
				id: that.$Route.query.orderId,
				order_item_id: that.goodsDetail.id,
				level: that.star,
				content: that.message,
				images: that.imgList
			}, '提交中...').then(res => {
				if (res.code === 1) {
					that.$u.toast('评论发表成功');
					that.$Router.back();
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 评价商品
.goods-card {
	margin: 10rpx 0;
	padding: 20rpx;
	background: #fff;
	.order-sku {
		font-size: 24rpx;
		
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		width: 450rpx;
		margin-bottom: 20rpx;
		.order-num {
			margin-right: 10rpx;
		}
	}
	.order-price-box {
		.status-btn {
			height: 32rpx;
			border: 1rpx solid rgba(207, 169, 114, 1);
			border-radius: 15rpx;
			font-size: 20rpx;
			font-weight: 400;
			color: rgba(168, 112, 13, 1);
			padding: 0 10rpx;
			margin-left: 20rpx;
			background: rgba(233, 183, 102, 0.16);
		}
		.order-price {
			font-size: 26rpx;
			
			font-weight: 600;
			color: rgba(51, 51, 51, 1);
		}
	}
}

// 评论，选择图片
.form-item {
	background: #ffff;
	padding-bottom: 30rpx;
	.star-box {
		height: 100rpx;
		padding: 0 25rpx;
	}
	.star-title {
		font-weight: 600;
	}
}
.area-box {
	width: 690rpx;
	min-height: 306rpx;
	background: rgba(249, 250, 251, 1);
	border-radius: 20rpx;
	padding: 28rpx;
	margin: auto;
	.pl-style {
		font-size: 26rpx;
		
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 42rpx;
	}
	.inp-area {
		font-size: 26rpx;
		
		font-weight: 500;
		color: #333;
		line-height: 50rpx;
		width: 100%;
	}
	.img-box {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20rpx;
	}
}
.post-btn {
	width: 690rpx;
	line-height: 80rpx;
	background: linear-gradient(90deg, rgba(240, 199, 133, 1), rgba(246, 214, 157, 1));
	border-radius: 40rpx;
	color: rgba(#fff, 0.9);
	margin-bottom: 30rpx;
}
</style>
