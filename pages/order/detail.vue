<!-- 订单详情 -->
<template>
	<view class="order-detail-wrap">
		<!-- 订单状态 -->
		<view class="detail-head" :style="orderDetail.consignee ? '' : 'height:120rpx'">
			<view class="state-box u-flex">
				<image class="state-img" :src="$IMG_URL + '/imgs/order/order_state1.png'" mode=""></image>
				<text>{{ orderDetail.status_desc }}</text>
			</view>
		</view>

		<!-- 收货地址 -->
		<view class="address-wrap" v-if="orderDetail.consignee">
			<view class="order-address-box">
				<view class="u-flex">
					<text class="address-username">{{ orderDetail.consignee }}</text>
					<text class="address-phone">{{ orderDetail.phone }}</text>
				</view>
				<view class="address-detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</view>
			</view>
		</view>

		<view class="detail-goods">
			<!-- 订单信息 -->
			<view class="order-list" v-for="order in orderDetail.item" :key="order.id">
				<view class="order-card" @tap="jump('/pages/goods/detail', { id: order.goods_id })">
					<shopro-mini-card :title="order.goods_title" :image="order.goods_image">
						<template #describe>
							<view class="order-sku u-ellipsis-1">
								<text class="order-num">数量:{{ order.goods_num || 0 }};</text>
								{{ order.goods_sku_text ? order.goods_sku_text : '' }}
							</view>
						</template>
						<template #cardBottom>
							<view class="card-price-box u-flex">
								<text class="order-price font-OPPOSANS">￥{{ order.goods_price || 0 }}</text>
								<button class="u-reset-button status-btn" v-if="order.status_name">{{ order.status_name }}</button>
							</view>
						</template>
					</shopro-mini-card>
				</view>
				<!-- 配送方式 -->
				<view class="express-type-box u-flex u-row-between">
					<view class="u-flex">
						<view class="express-type--title">配送：</view>
						<view class="express-type--content">{{ expressType[order.dispatch_type] }}</view>
					</view>
					<!-- 发货详情 -->
					<view
						class="u-flex express-type--detail"
						v-if="order.dispatch_type !== 'express'"
						@tap="goDistribution(order.dispatch_type, orderDetail.id, order.id, order.dispatch_status)"
					>
						<text>详情</text>
						<text class="u-iconfont uicon-arrow-right" style="color: #666;"></text>
					</view>
				</view>

				<view class="order-bottom u-flex">
					<!-- 退款原因 -->
					<view class="refund_msg" v-if="order.refund_msg">
						<text class="refund-title">退款原因：</text>
						{{ order.refund_msg }}
					</view>
					<view class="btn-box" v-for="(btn, index) in order.btns" :key="btn">
						<button @tap.stop="onConfirm(orderDetail.id, order.id)" class="u-reset-button btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'get'">
							确认收货
						</button>
						<button
							@tap.stop="onComment(orderDetail.id, order.id)"
							class="u-reset-button btn1"
							:class="{ btn2: index + 1 === order.btns.length }"
							v-if="btn === 'comment'"
						>
							去评价
						</button>
						<button
							@tap.stop="jump('/pages/goods/detail', { id: order.goods_id })"
							class="u-reset-button btn1"
							:class="{ btn2: index + 1 === order.btns.length }"
							v-if="btn === 'buy_again'"
						>
							再次购买
						</button>
						<button
							@tap="onAftersaleDetail(order.ext_arr.aftersale_id)"
							class="u-reset-button btn1"
							:class="{ btn2: index + 1 === order.btns.length }"
							v-if="btn === 'aftersale_info'"
						>
							售后详情
						</button>
						<button
							@tap.stop="onAftersale(orderDetail.id, order.id)"
							class="u-reset-button btn1"
							:class="{ btn2: index + 1 === order.btns.length }"
							v-if="btn === 'aftersale'"
						>
							申请售后
						</button>
						<button
							@tap.stop="onAftersale(orderDetail.id, order.id)"
							class="u-reset-button btn1"
							:class="{ btn2: index + 1 === order.btns.length }"
							v-if="btn === 're_aftersale'"
						>
							重新售后
						</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="notice-box" v-if="orderDetail.id">
			<view class="notice-box__content">
				<view class="notice-item--center u-flex">
					<text class="title">订单编号：</text>
					<text class="detail">{{ orderDetail.order_sn }}</text>
					<button class="u-reset-button copy-btn" @tap="onCopy(orderDetail.order_sn)">复制</button>
				</view>
				<view class="notice-item u-flex">
					<text class="title">下单时间：</text>
					<text class="detail">{{ orderDetail.createtime }}</text>
				</view>
				<view class="notice-item u-flex" v-if="orderDetail.status > 0">
					<text class="title">支付方式：</text>
					<text class="detail">{{ payType[orderDetail.pay_type] }}</text>
				</view>
				<view class="notice-item u-flex" v-if="orderDetail.status > 0">
					<text class="title">支付时间：</text>
					<text class="detail">{{ orderDetail.paytime }}</text>
				</view>
			</view>
		</view>
		<!--  价格信息 -->
		<view class="order-price-box u-m-b-20" v-if="orderDetail.id">
			<view class="notice-item u-flex u-row-between">
				<text class="title">商品总额</text>
				<text class="detail font-OPPOSANS">￥{{ orderDetail.goods_amount }}</text>
			</view>
			<view class="notice-item u-flex u-row-between">
				<text class="title">运费</text>
				<text class="detail font-OPPOSANS">￥{{ orderDetail.dispatch_amount }}</text>
			</view>
			<view class="notice-item u-flex u-row-between">
				<text class="title">优惠金额</text>
				<text class="detail font-OPPOSANS">-￥{{ orderDetail.discount_fee }}</text>
			</view>
			<view class="notice-item u-flex u-row-between" v-if="orderDetail.score_fee">
				<text class="title">积分</text>
				<text class="detail font-OPPOSANS">-{{ orderDetail.score_fee }}积分</text>
			</view>
			<view class="notice-item all-rpice-item u-flex" style="width: 100%;">
				<text class="title">{{ orderDetail.status <= 0 ? '需付款' : '实付款' }}：</text>
				<text class="detail all-price font-OPPOSANS">￥{{ orderDetail.total_fee }}</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="foot-wrap safe-area-inset-bottom">
			<view class="foot_box safe-area-inset-bottom">
				<view class="money-box u-flex ">
					<text class="money-title">共{{ allNum || '0' }}件商品 合计:</text>
					<text class="all-price font-OPPOSANS">￥{{ orderDetail.total_fee || '0.00' }}</text>
				</view>
				<view class="btn-box u-flex">
					<view class="" v-for="btn in orderDetail.btns" :key="btn">
						<button v-if="btn === 'cancel'" @tap.stop="onCancel(orderDetail.id)" class="u-reset-button obtn1">取消订单</button>
						<button v-if="btn === 'pay'" @tap.stop="onPay(orderDetail.id)" class="u-reset-button obtn2">付款</button>
						<button v-if="btn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: orderDetail.ext_arr.groupon_id })" class="u-reset-button obtn2">
							拼团详情
						</button>
						<button v-if="btn === 'delete'" @tap.stop="onDelete(orderDetail.id)" class="u-reset-button delete-btn">删除</button>
						<button v-if="btn === 'express'" @tap.stop="onExpress(orderDetail.id)" class="u-reset-button obtn1">查看物流</button>
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
			time: 0,
			orderDetail: {},
			orderStatus: {
				'-2': '已关闭',
				'-1': '已取消',
				'0': '未付款',
				'1': '已付款',
				'2': '已完成'
			},
			payType: {
				wallet: '余额支付',
				wechat: '微信支付',
				alipay: '支付宝支付',
				iospay: 'ApplePay'
			},
			expressType: {
				express: '物流快递',
				selfetch: '到店/自提',
				store: '商家配送',
				autosend: '自动发货'
			}
		};
	},
	onShow() {
		this.getOrderDetail();
	},
	onLoad() {},
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
		// 详情发货信息
		goDistribution(dispatchType, orderId, orderItemId) {
			this.jump('/pages/order/express/distribution-detail', { expressType: dispatchType, orderId: orderId, orderItemId: orderItemId });
		},
		// 订单详情
		getOrderDetail() {
			let that = this;
			that.$http('order.detail', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					that.orderDetail.createtime = that.$u.timeFormat(res.data.createtime, 'yyyy-mm-dd hh:MM');
					that.orderDetail.paytime = that.$u.timeFormat(res.data.paytime, 'yyyy-mm-dd hh:MM');
				}
			});
		},
		// 复制
		onCopy(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
				success: function(data) {
					that.$u.toast('已复制到剪切板');
				}
			});
		},

		// 确认收货
		onConfirm(id, itemId) {
			let that = this;
			that.$http(
				'order.confirm',
				{
					id: id,
					order_item_id: itemId
				},
				'确认中...'
			).then(res => {
				if (res.code === 1) {
					that.getOrderDetail();
				}
			});
		},

		// 申请售后
		onAftersale(orderId, orderItemId) {
			this.$Router.push({
				path: '/pages/order/after-sale/refund',
				query: { orderId: orderId, orderItemId: orderItemId }
			});
		},

		// 售后详情
		onAftersaleDetail(id) {
			this.jump('/pages/order/after-sale/detail', { aftersaleId: id });
		},

		// 取消订单
		onCancel(id) {
			let that = this;
			that.$http(
				'order.cancel',
				{
					id: id
				},
				'取消中...'
			).then(res => {
				if (res.code === 1) {
					that.$Router.back();
				}
			});
		},

		// 立即购买
		onPay(id) {
			uni.navigateTo({
				url: `/pages/order/payment/method?orderId=${id}`
			});
		},

		// 删除订单
		onDelete(orderId) {
			let that = this;
			uni.showModal({
				title: '删除订单',
				content: '确定要删除这个订单么？',
				cancelText: '取消',
				confirmText: '删除',
				success: res => {
					if (res.confirm) {
						that.$http('order.deleteOrder', {
							id: orderId
						}).then(res => {
							if (res.code === 1) {
								that.$Router.back();
							}
						});
					}
				}
			});
		},

		// 待评价
		onComment(orderId, orderItemId) {
			this.jump('/pages/goods/comment/add-comment', { orderId: orderId, orderItemId: orderItemId });
		},

		// 查看物流
		onExpress(orderId, orderItemId) {
			let that = this;
			that.$http('order.expressList', {
				order_id: orderId
			}).then(res => {
				if (res.code === 1) {
					if (res.data.length == 1) {
						this.jump('/pages/order/express/express-detail', { orderId: orderId, expressId: res.data[0].id });
					} else if (res.data.length > 1) {
						this.jump('/pages/order/express/express-list', { orderId: orderId });
					} else {
						this.$u.toast('暂无包裹~');
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.detail-head {
	background: linear-gradient(0deg, rgba(239, 196, 128, 1) 0%, rgba(248, 220, 165, 1) 100%) no-repeat;
	background-size: 100% 180rpx;
	height: 180rpx;

	.state-box {
		padding: 30rpx 40rpx;
		color: rgba(#fff, 0.9);

		.state-img {
			width: 60rpx;
			height: 60rpx;
			// background: #ccc;
			margin-right: 40rpx;
		}
	}
}

// 收货地址
.address-wrap {
	position: relative;
	background-color: #fff;
	min-height: 160rpx;
	width: 100%;
	margin-bottom: 20rpx;
}
.order-address-box {
	width: 710rpx;
	left: 50%;
	transform: translateX(-50%);
	top: -50rpx;
	background-color: #fff;
	min-height: 160rpx;
	border-radius: 20rpx;
	padding: 20rpx;
	font-size: 30rpx;

	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	position: absolute;
	.address-username {
		margin-right: 20rpx;
	}
	.address-detail {
		font-size: 26rpx;

		font-weight: 500;
		color: rgba(153, 153, 153, 1);
		margin-top: 20rpx;
	}
}
.detail-goods {
	margin-bottom: 20rpx;
	.order-list {
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 0 20rpx;
		.order-card {
			padding: 20rpx 0;
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
		// 配送方式
		.express-type-box {
			width: 710rpx;
			height: 90rpx;
			background: rgba(247, 247, 247, 1);
			border-radius: 10rpx;
			padding: 0 20rpx;
			.express-type--title {
				font-size: 28rpx;

				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
			.express-type--content {
				font-size: 26rpx;

				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.express-type--detail {
				font-size: 24rpx;

				font-weight: 400;
				color: rgba(153, 153, 153, 1);
				line-height: 30rpx;
			}
		}
		.refund_msg {
			font-size: 28rpx;
			color: #999;
			flex: 1;
			text-align: left;
		}
		.order-bottom {
			background: #fff;
			justify-content: flex-end;
			padding: 20rpx 0;
			.btn1 {
				width: 160rpx;
				line-height: 60rpx;
				border: 1rpx solid rgba(223, 223, 223, 1);
				border-radius: 30rpx;
				font-size: 26rpx;
				background: #fff;
				padding: 0;
				margin-right: 20rpx;
			}
			.btn2 {
				width: 160rpx;
				line-height: 60rpx;
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
// 拼团项目
.group-box {
	background: #fff;
	padding: 40rpx 0;
	height: 250rpx;
	margin-bottom: 20rpx;
	.tip-box {
		font-size: 28rpx;
	}
	.title-box {
		font-size: 26rpx;
		font-weight: bold;
		color: #333;
		.group-num {
			color: #f8002c;
		}
		.count-down-tip {
			font-size: 24rpx;
			padding-left: 10rpx;
		}
		.time-box {
			font-size: 18rpx;
			.count-text {
				display: inline-block;
				background-color: #383a46;
				color: #fff;
				font-size: 18rpx;
				border-radius: 2rpx;
				padding: 0 5rpx;
				height: 28rpx;
				text-align: center;
				line-height: 28rpx;
				margin: 0 6rpx;
			}
		}
	}

	.group-people {
		.img-box {
			position: relative;
			margin-right: 20rpx;
			.tag {
				position: absolute;
				line-height: 36rpx;
				background: linear-gradient(132deg, rgba(243, 223, 177, 1), rgba(243, 223, 177, 1), rgba(236, 190, 96, 1));
				border-radius: 18rpx;
				padding: 0 10rpx;
				white-space: nowrap;
				font-size: 24rpx;
				color: #784f06;
				z-index: 2;
				top: -10rpx;
			}
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: #ccc;
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

		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 80rpx;
		border-bottom: 1rpx solid #dfdfdf;
		padding: 0 25rpx;
	}
	.notice-box__content {
		padding: 25rpx;
		.self-pickup-box {
			width: 100%;
			.self-pickup--img {
				width: 200rpx;
				height: 200rpx;
				margin: 40rpx 0;
			}
		}
	}
	.notice-item--center {
		margin-bottom: 10rpx;
	}
	.notice-item,
	.notice-item--center {
		height: 50rpx;
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
			width: 100rpx;
			line-height: 50rpx;
			border-radius: 25rpx;
			padding: 0;
			background: rgba(238, 238, 238, 1);
			font-size: 22rpx;

			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			margin-left: 30rpx;
		}
	}
	.notice-item--center {
		align-items: center;
	}
}

// 订单价格信息
.order-price-box {
	background-color: #fff;
	padding: 20rpx;
	margin-bottom: 20rpx;
	.notice-item {
		height: 50rpx;
		.title {
			font-size: 28rpx;
			color: #999;
		}

		.detail {
			font-size: 28rpx;
			color: #333;
		}
	}
	.all-rpice-item {
		justify-content: flex-end;
		.all-price {
			font-size: 26rpx;
			color: #ff0000;
		}
	}
}

.foot-wrap {
	width: 750rpx;
	height: 140rpx;
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
	position: fixed;
	bottom: 0;
	left: 0;
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
		.delete-btn {
			background: #ffeeee;
			color: #e50808;
			width: 160rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			font-size: 26rpx;
			font-weight: 400;
			margin-right: 20rpx;
			padding: 0;
		}
		.obtn1 {
			width: 160rpx;
			line-height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			margin-right: 20rpx;
			padding: 0;
		}
		.obtn2 {
			width: 160rpx;
			line-height: 60rpx;
			background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
			box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
			border-radius: 30rpx;
			margin-right: 20rpx;
			font-size: 26rpx;
			font-weight: 400;
			color: #fff;
			padding: 0;
		}
	}
}
</style>
