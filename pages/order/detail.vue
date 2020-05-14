<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<view class="detail-head">
				<view class="state-box x-f">
					<image class="state-img" src="http://shopro.7wpp.com/imgs/order_state1.png" mode=""></image>
					<text>{{ orderDetail.status_name }}</text>
				</view>
			</view>
			<view class="detail-goods">
				<!-- 订单信息 -->
				<view class="order-list" v-for="order in orderDetail.item" :key="order.id">
					<shopro-mini-card :type="'order'" :detail="order"></shopro-mini-card>
					<view class="order-bottom  x-f">
						<view class="btn-box" v-for="(btn, index) in order.btns" :key="btn">
							<button
								@tap="jump('/pages/goods/detail', { id: order.goods_id })"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'buy_again'"
							>
								再次购买
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'express'" @tap="checkExpress(orderDetail.id, order.id)">
								查看物流
							</button>
							<button @tap.stop="onConfirm(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'get'">
								确认收货
							</button>
							<button
								@tap.stop="onAftersale(orderDetail.id, order.id)"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'aftersale'"
							>
								申请售后
							</button>
							<button
								@tap.stop="onRefund(orderDetail.id, order.id)"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'apply_refund'"
							>
								申请退款
							</button>
							<button @tap.stop="onComment(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'comment'">
								待评价
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'after_detail'">售后详情</button>
						</view>
					</view>
				</view>
			</view>
			<!-- 收货信息 -->
			<view class="notice-box">
				<view class="notice-box__head">收货信息</view>
				<view class="notice-box__content">
					<view class="x-f notice-item">
						<text class="title">收货人：</text>
						<text class="detail">{{ orderDetail.consignee }} {{ orderDetail.phone }}</text>
					</view>
					<view class="x-f notice-item">
						<text class="title">收货地址：</text>
						<text class="detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</text>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="notice-box">
				<view class="notice-box__head">订单信息</view>
				<view class="notice-box__content">
					<view class="notice-item x-f">
						<text class="title">订单编号：</text>
						<text class="detail">{{ orderDetail.order_sn }}</text>
						<button class="cu-btn copy-btn" @tap="onCopy">复制</button>
					</view>
					<view class="notice-item x-f">
						<text class="title">下单时间：</text>
						<text class="detail">{{ orderDetail.createtime }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_box">
			<view class="money-box x-f justify-end">
				<text class="money-title">共{{ allNum }}件商品 合计:</text>
				<text class="all-price">￥{{ orderDetail.total_fee }}</text>
			</view>
			<view class="btn-box x-f" v-if="orderDetail.btns && orderDetail.btns.length">
				<button @tap.stop="onCancel(orderDetail.id)" class="cu-btn obtn1">取消订单</button>
				<button @tap.stop="onPay(orderDetail.order_sn)" class="cu-btn obtn2">付款</button>
			</view>
		</view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/goods/shopro-mini-card.vue';
export default {
	components: {
		shoproMiniCard
	},
	data() {
		return {
			orderDetail: {},
			orderStatus: {
				'-2': '已关闭',
				'-1': '已取消',
				'0': '未付款',
				'1': '已付款',
				'2': '已完成'
			}
		};
	},
	onShow() {
		this.getOrderDetail();
	},
	computed: {
		allNum() {
			if (this.orderDetail.item) {
				let items = this.orderDetail.item;
				let allPrice = 0;
				items.forEach(p => {
					allPrice += p.goods_num;
				});
				return allPrice;
			}
		}
	},
	methods: {
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		// 订单详情
		getOrderDetail() {
			console.log('detial', this.$Route.query.id);
			let that = this;
			that.$api('order.detail', {
				order_sn: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					let date = new Date(res.data.createtime * 1000);
					that.orderDetail.createtime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', date);
				}
			});
		},
		// 复制
		onCopy() {
			let that = this;
			uni.setClipboardData({
				data: that.orderDetail.order_sn,
				success: function(data) {
					//#ifdef H5
					that.$tools.toast('已复制到剪切板');
					//#endif
				},
				fail: function(err) {},
				complete: function(res) {}
			});
		},
		// 确认收货
		onConfirm(id, itemId) {
			let that = this;
			that.$api('order.confirm', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.getOrderDetail();
				}
			});
		},
		// 申请退款
		onRefund(id, itemId) {
			let that = this;
			that.$api('order.refund', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('申请退款成功');
					that.getOrderDetail();
				}
			});
		},
		// 申请售后
		onAftersale(id, itemId) {
			let that = this;
			that.$api('order.aftersale', {
				id: id,
				order_item_id: itemId
			}).then(res => {
				if (res.code === 1) {
					that.$tools.toast('申请售后成功');
					that.getOrderDetail();
				}
			});
		},
		// 取消订单
		onCancel(id) {
			let that = this;
			that.$api('order.cancel', {
				id: id
			}).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		},
		// 立即购买
		onPay(id) {
			uni.navigateTo({
				url: `/pages/pay/index?id=${id}`
			});
		},
		// 待评价
		onComment(orderId, ordrderItemId) {
			this.jump('/pages/order/add-comment', { orderId: orderId, ordrderItemId: ordrderItemId });
		},
		// 查看物流,
		checkExpress(orderId, ordrderItemId) {
			this.jump('/pages/order/express', { orderId: orderId, ordrderItemId: ordrderItemId });
		}
	}
};
</script>

<style lang="scss">
.detail-head {
	background: linear-gradient(0deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%) no-repeat;
	background-size: 100% 134rpx;

	.state-box {
		padding: 40rpx;
		color: rgba(#fff, 0.9);

		.state-img {
			width: 60rpx;
			height: 60rpx;
			// background: #ccc;
			margin-right: 40rpx;
		}
	}
}

.detail-goods {
	padding: 20rpx;
	background: #fff;
	margin-bottom: 20rpx;

	.order-list {
		.order-bottom {
			background: #fff;
			padding-bottom: 20rpx;
			justify-content: flex-end;
			padding-top: 20rpx;
			.btn1 {
				width: 160rpx;
				height: 60rpx;
				border: 1rpx solid rgba(223, 223, 223, 1);
				border-radius: 30rpx;
				font-size: 26rpx;
				background: #fff;
				padding: 0;
				margin-right: 20rpx;
			}
			.btn2 {
				width: 160rpx;
				height: 60rpx;
				border: 1rpx solid rgba(213, 166, 90, 1) !important;
				border-radius: 30rpx;
				font-size: 26rpx;
				color: #d5a65a !important;
				padding: 0;
				background: #fff;
				margin-right: 20rpx;
			}
		}
	}
}
// 收货信息、订单信息。
.notice-box {
	background: #fff;
	margin-bottom: 20rpx;
	.notice-box__head {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 80rpx;
		border-bottom: 1rpx solid #dfdfdf;
		padding: 0 25rpx;
	}
	.notice-box__content {
		padding: 25rpx;
	}
	.notice-item {
		margin-bottom: 10rpx;
		align-items: flex-start;
		.title {
			font-size: 28rpx;
			color: #999;
			text-align: justify;
			text-align-last: justify;
			text-justify: distribute-all-lines;
			width: 140rpx;
		}

		.detail {
			font-size: 28rpx;
			color: #333;
			flex: 1;
		}

		.copy-btn {
			width: 120rpx;
			height: 50rpx;
			// border: 1rpx solid rgba(223, 223, 223, 1);
			// border-radius: 25rpx;
			padding: 0;
			background: #fff;
			color: #b38436;
			font-size: 26rpx;
			margin-left: 30rpx;
		}
	}
}

.foot_box {
	width: 750rpx;
	min-height: 100rpx;
	background: rgba(255, 255, 255, 1);
	border: 1rpx solid rgba(238, 238, 238, 1);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: center;
	.money-box {
		height: 60rpx;
		padding: 0 20rpx;
		.money-title {
			font-size: 26rpx;
			color: #999999;
		}
		.all-price {
			color: #333;
			font-size: 26rpx;
		}
	}
	.btn-box {
		justify-content: flex-end;
		margin-bottom: 20rpx;
		.obtn1 {
			width: 160rpx;
			height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			margin-right: 20rpx;
			padding: 0;
		}
		.obtn2 {
			width: 160rpx;
			height: 60rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(168, 112, 13, 0.9);
			padding: 0;
		}
	}
}
</style>
