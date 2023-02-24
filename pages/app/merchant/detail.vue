<!-- 门店订单详情 -->
<template>
	<view class="order-detail-wrap">
		<!-- 订单卡片 -->
		<view class="card-box">
			<view class="order-goods-item u-m-b-10" v-for="item in orderDetail.item" :key="item.id">
				<shopro-mini-card :title="item.goods_title" :image="item.goods_image">
					<template #describe>
						<view class="order-sku u-ellipsis-1">
							<text class="order-num">数量:{{ item.goods_num || 0 }};</text>
							{{ item.goods_sku_text ? item.goods_sku_text : '' }}
						</view>
					</template>
					<template #cardBottom>
						<view class="card-price-box u-flex">
							<text class="order-price font-OPPOSANS">￥{{ item.goods_price || 0 }}</text>
							<button class="u-reset-button status-btn" v-if="item.status_name">{{ item.status_name }}</button>
						</view>
					</template>
				</shopro-mini-card>
				<view class="goods-phone card-item" v-show="item.ext_arr.dispatch_phone">
					<text class="item-title">预留电话：</text>
					<text class="item-content">{{ item.ext_arr.dispatch_phone }}</text>
				</view>
				<view class="goods-date card-item">
					<text class="item-title" v-show="item.dispatch_type === 'selfetch'">到店/自提时间：</text>
					<text class="item-title" v-show="item.dispatch_type === 'store'">配送时间：</text>
					<text class="item-content">{{ item.ext_arr.dispatch_date || '' }}</text>
				</view>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="order-detail-card">
			<view class="card-title u-flex ">订单信息</view>
			<view class="detial-content">
				<view class="detail-item u-flex">
					<view class="item-title">订单状态：</view>
					<view class="item-content">{{ orderDetail.status_name }}</view>
				</view>
				<view class="detail-item u-flex">
					<view class="item-title">订单编号：</view>
					<view class="item-content">{{ orderDetail.order_sn }}</view>
				</view>
				<view class="detail-item u-flex">
					<view class="item-title">下单时间：</view>
					<view class="item-content">{{ orderDetail.paytime }}</view>
				</view>
				<view class="detail-item u-flex" v-if="orderDetail.remark">
					<view class="item-title">备注：</view>
					<view class="item-content">{{ orderDetail.remark }}</view>
				</view>
				<view class="detail-item address-item" v-if="orderType.includes('store')">
					<view class="item-title">配送地址：</view>
					<view class="item-content address-content">
						{{ orderDetail.province_name || '' }}{{ orderDetail.city_name || '' }}{{ orderDetail.area_name || '' }}{{ orderDetail.address || '' }}
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-hack" v-if="orderDetail.status_code == 'nosend'">
			<view class="bottom-box u-flex u-row-center u-col-center"><button class="cu-btn send-btn" @tap="sendOrder">发货</button></view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			orderDetail: {},
			orderType: []
		};
	},
	computed: {},
	onLoad() {
		this.getOrderDetail();
	},
	methods: {
		// 订单详情
		getOrderDetail() {
			let that = this;
			that.$http('store.orderDetail', {
				id: that.$Route.query.orderId,
				store_id: uni.getStorageSync('storeId')
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					that.orderDetail.paytime = that.$u.timeFormat(res.data.paytime, 'yyyy-mm-dd hh:MM');
					that.orderDetail.item.forEach(goods => {
						that.orderType.push(goods.dispatch_type);
					});
				}
			});
		},
		// 订单发货
		sendOrder() {
			let that = this;
			that.$http(
				'store.orderSend',
				{
					id: that.orderDetail.id,
					store_id: uni.getStorageSync('storeId')
				},
				'发货中...'
			).then(res => {
				if (res.code === 1) {
					that.$u.toast(res.msg);
					that.getOrderDetail();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.order-detail-wrap {
	height: 100%;
	.bottom-hack {
		width: 750rpx;
		height: 100rpx;
	}
	.bottom-box {
		position: fixed;
		width: 750rpx;
		height: 100rpx;
		bottom: 0;
		left: 0;
		background-color: #fff;
		padding: 10rpx 0;
		.send-btn {
			width: 710rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #2eae9c, #6cc29f);
			border: 1rpx solid rgba(237, 237, 237, 1);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
		}
	}
}
// 订单卡片
.card-box {
	margin-bottom: 20rpx;
	background-color: #fff;
	.order-goods-item {
		border-bottom: 1rpx solid rgba(237, 237, 237, 1);
		padding: 20rpx;
		.card-item {
			line-height: 60rpx;
			.item-title {
				font-size: 28rpx;
				color: #999;
			}
			.item-content {
				font-size: 26rpx;
				color: #333;
			}
		}
	}
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
	.card-price-box {
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
.order-detail-card {
	background-color: #fff;
	margin: 20rpx 0;
	.card-title {
		font-size: 30rpx;

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
