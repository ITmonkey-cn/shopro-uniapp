<template>
	<view class="order-detail-wrap">
		<!-- 订单卡片 -->
		<view class="card-box">
			<view class="order-goods-item" v-for="item in orderDetail.item" :key="item.id"><shopro-mini-card :type="'order'" :detail="item"></shopro-mini-card></view>
		</view>
		<!-- 订单信息 -->
		<view class="order-detail-card">
			<view class="card-title x-f">订单信息</view>
			<view class="detial-content">
				<view class="detail-item x-f">
					<view class="item-title">订单状态：</view>
					<view class="item-content">{{ orderDetail.status_name }}</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">订单编号：</view>
					<view class="item-content">{{ orderDetail.order_sn }}</view>
				</view>
				<view class="detail-item x-f">
					<view class="item-title">下单时间：</view>
					<view class="item-content">{{ tools.dateFormat('YYYY-mm-dd HH:MM', new Date(orderDetail.paytime * 1000)) }}</view>
				</view>
				<view class="detail-item x-f" v-if="orderDetail.remark">
					<view class="item-title">备注：</view>
					<view class="item-content">{{ orderDetail.remark }}</view>
				</view>
			</view>
		</view>
		<!-- 自提信息 -->
		<view class="order-detail-card" v-if="orderType.includes('selfetch')">
			<view class="card-title x-f">到店/自提信息</view>
			<view class="detial-content">
				<view class="detail-item x-f" v-if="orderDetail.ext_arr.dispatch_date">
					<view class="item-title">到店时间：</view>
					<view class="item-content">{{ tools.dateFormat('YYYY-mm-dd HH:MM', new Date(orderDetail.ext_arr.dispatch_date * 1000)) }}</view>
				</view>
				<view class="detail-item x-f" v-if="orderDetail.ext_arr.dispatch_phone">
					<view class="item-title">预留电话：</view>
					<view class="item-content">{{ orderDetail.ext_arr.dispatch_phone }}</view>
				</view>
				<view class="detail-item address-item">
					<view class="item-title">门店地址：</view>
					<view class="item-content address-content">{{ storeDetail.province_name }}{{ storeDetail.city_name }}{{ storeDetail.area_name }}{{ storeDetail.address }}</view>
				</view>
			</view>
		</view>
		<!-- 配送信息 -->
		<view class="order-detail-card" v-if="orderType.includes('store')">
			<view class="card-title x-f">配送信息</view>
			<view class="detial-content">
				<view class="detail-item x-f" v-if="orderDetail.ext_arr.dispatch_date">
					<view class="item-title">配送时间：</view>
					<view class="item-content">{{ tools.dateFormat('YYYY-mm-dd HH:MM', new Date(orderDetail.ext_arr.dispatch_date * 1000)) }}</view>
				</view>
				<view class="detail-item x-f" v-if="orderDetail.ext_arr.dispatch_phone">
					<view class="item-title">预留电话：</view>
					<view class="item-content">{{ orderDetail.ext_arr.dispatch_phone }}</view>
				</view>
				<view class="detail-item address-item">
					<view class="item-title">门店地址：</view>
					<view class="item-content address-content">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</view>
				</view>
			</view>
		</view>
		<view class="bottom-box x-c"><button class="cu-btn send-btn" @tap="sendOrder">发货</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			orderDetail: {},
			tools: this.$tools,
			orderType: [],
			storeDetail:{}//门店信息
		};
	},
	computed: {},
	onLoad() {
		this.getOrderDetail();
		this.getStoreDetail();
	},
	methods: {
		// 订单详情
		getOrderDetail() {
			let that = this;
			that.$api('store.orderDetail', {
				id: that.$Route.query.orderId
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					that.orderDetail.item.forEach(goods => {
						that.orderType.push(goods.dispatch_type);
					});
				}
			});
		},
		// 获取门店信息
		getStoreDetail() {
			let that = this;
			that.$api('store.info').then(res => {
				if (res.code === 1) {
					that.storeDetail = res.data;
				}
			});
		},
		// 订单发货
		sendOrder() {
			let that = this;
			that.$api('store.orderSend',{
				id:that.orderDetail.id
				}).then(res => {
				if (res.code === 1) {
				
				}
			});
		}
	}
};
</script>

<style lang="scss">
.order-detail-wrap {
	position: relative;
	height: 100%;
	.bottom-box {
		position: absolute;
		width: 750rpx;
		bottom: 0;
		background-color: #fff;
		padding: 10rpx 0;
		.send-btn {
			width: 710rpx;
			height: 80rpx;
			background: linear-gradient(90deg, rgba(233, 180, 96, 1), rgba(238, 203, 137, 1));
			border: 1rpx solid rgba(237, 237, 237, 1);
			border-radius: 40rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
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
		padding: 20rpx;
	}
}
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
