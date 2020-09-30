<template>
	<view class="page_box">
		<view class="head_box"></view>
		<view class="content_box">
			<!-- 订单状态 -->
			<view class="detail-head" :style="orderDetail.consignee ? '' : 'height:120rpx'">
				<view class="state-box x-f">
					<image class="state-img" src="http://shopro.7wpp.com/imgs/order_state1.png" mode=""></image>
					<text>{{ orderDetail.status_desc }}</text>
				</view>
			</view>
			<!-- 收货地址 -->
			<view class="address-wrap" v-if="orderDetail.consignee">
				<view class="order-address-box">
					<view class="x-f">
						<text class="address-username">{{ orderDetail.consignee }}</text>
						<text class="address-phone">{{ orderDetail.phone }}</text>
					</view>
					<view class="address-detail">{{ orderDetail.province_name }}{{ orderDetail.city_name }}{{ orderDetail.area_name }}{{ orderDetail.address }}</view>
				</view>
			</view>

			<view class="detail-goods">
				<!-- 订单信息 -->
				<view class="order-list" v-for="order in orderDetail.item" :key="order.id">
					<view class="order-card" @tap="jump('/pages/goods/detail/index', { id: order.goods_id })">
						<shopro-mini-card :type="'order'" :detail="order"></shopro-mini-card>
					</view>
					<!-- 配送方式 -->
					<view class="express-type-box x-bc">
						<view class="x-f">
							<view class="express-type--title">配送：</view>
							<view class="express-type--content">{{ expressType[order.dispatch_type] }}</view>
						</view>
						<!-- 发货详情 -->
						<view
							class="x-f express-type--detail"
							v-if="order.dispatch_type !== 'express'"
							@tap="goDistribution(order.dispatch_type, orderDetail.id, order.id, order.dispatch_status)"
						>
							<text>详情</text>
							<text class="cuIcon-right"></text>
						</view>
					</view>

					<view class="order-bottom  x-f">
						<!-- 退款原因 -->
						<view class="refund_msg" v-if="order.refund_msg">
							<text class="refund-title">退款原因：</text>
							{{ order.refund_msg }}
						</view>
						<view class="btn-box" v-for="(btn, index) in order.btns" :key="btn">
							<button @tap.stop="onConfirm(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'get'">
								确认收货
							</button>
							<button @tap.stop="onComment(orderDetail.id, order.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'comment'">
								去评价
							</button>
							<button
								@tap.stop="jump('/pages/goods/detail/index', { id: order.goods_id })"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'buy_again'"
							>
								再次购买
							</button>
							<button
								@tap="onAftersaleDetail(order.ext_arr.aftersale_id)"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === order.btns.length }"
								v-if="btn === 'aftersale_info'"
							>
								售后详情
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
								@tap.stop="onAftersale(orderDetail.id, order.id)"
								class="cu-btn btn1"
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
					<view class="notice-item--center x-f">
						<text class="title">订单编号：</text>
						<text class="detail">{{ orderDetail.order_sn }}</text>
						<button class="cu-btn copy-btn" @tap="onCopy(orderDetail.order_sn)">复制</button>
					</view>
					<view class="notice-item x-f">
						<text class="title">下单时间：</text>
						<text class="detail">{{ orderDetail.createtime }}</text>
					</view>
					<view class="notice-item x-f" v-if="orderDetail.status > 0">
						<text class="title">支付方式：</text>
						<text class="detail">{{ payType[orderDetail.pay_type] }}</text>
					</view>
					<view class="notice-item x-f" v-if="orderDetail.status > 0">
						<text class="title">支付时间：</text>
						<text class="detail">{{ orderDetail.paytime }}</text>
					</view>
				</view>
			</view>
			<!--  价格信息 -->
			<view class="order-price-box" v-if="orderDetail.id">
				<view class="notice-item x-bc">
					<text class="title">商品总额</text>
					<text class="detail">￥{{ orderDetail.goods_amount }}</text>
				</view>
				<view class="notice-item x-bc">
					<text class="title">运费</text>
					<text class="detail">￥{{ orderDetail.dispatch_amount }}</text>
				</view>
				<view class="notice-item x-bc">
					<text class="title">优惠金额</text>
					<text class="detail">-￥{{ orderDetail.discount_fee }}</text>
				</view>
				<view class="notice-item x-bc" v-if="orderDetail.score_fee">
					<text class="title">积分</text>
					<text class="detail">-{{ orderDetail.score_fee }}积分</text>
				</view>
				<view class="notice-item all-rpice-item x-f" style="width: 100%;">
					<text class="title">实付款：</text>
					<text class="detail all-price">￥{{ orderDetail.total_fee }}</text>
				</view>
			</view>
		</view>
		<view class="foot_box">
			<view class="money-box x-f justify-end">
				<text class="money-title">共{{ allNum }}件商品 合计:</text>
				<text class="all-price">￥{{ orderDetail.total_fee }}</text>
			</view>
			<view class="btn-box x-f">
				<view class="" v-for="btn in orderDetail.btns" :key="btn">
					<button v-if="btn === 'cancel'" @tap.stop="onCancel(orderDetail.id)" class="cu-btn obtn1">取消订单</button>
					<button v-if="btn === 'pay'" @tap.stop="onPay(orderDetail.id)" class="cu-btn obtn2">付款</button>
					<button v-if="btn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: orderDetail.ext_arr.groupon_id })" class="cu-btn obtn2">
						拼团详情
					</button>
					<button v-if="btn === 'delete'" style="background:#FFEEEE;color:#E50808" @tap.stop="onDelete(orderDetail.id)" class="cu-btn obtn1">删除</button>
					<button v-if="btn === 'express'" @tap.stop="onExpress(orderDetail.id)" class="cu-btn obtn1">查看物流</button>
				</view>
			</view>
		</view>
		<!-- 登录提示 -->
		<shopro-login-modal></shopro-login-modal>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
export default {
	components: {
		shoproMiniCard
	},
	data() {
		return {
			time: 0,
			tools: this.$tools,
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
			this.jump('/pages/order/distribution', { expressType: dispatchType, orderId: orderId, orderItemId: orderItemId });
		},
		// 订单详情
		getOrderDetail() {
			let that = this;
			that.$api('order.detail', {
				id: that.$Route.query.id
			}).then(res => {
				if (res.code === 1) {
					that.orderDetail = res.data;
					let date = new Date(res.data.createtime * 1000);
					let date1 = new Date(res.data.paytime * 1000);
					that.orderDetail.createtime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', date);
					that.orderDetail.paytime = that.$tools.dateFormat('YYYY-mm-dd HH:MM', date1);
				}
			});
		},
		// 复制
		onCopy(code) {
			let that = this;
			uni.setClipboardData({
				data: code,
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
						that.$api('order.deleteOrder', {
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
			this.jump('/pages/order/add-comment', { orderId: orderId, orderItemId: orderItemId });
		},
		// 查看物流,Todo
		onExpress(orderId, orderItemId) {
			let that = this;
			that.$api('order.expressList', {
				order_id: orderId
			}).then(res => {
				if (res.code === 1) {
					if (res.data.length == 1) {
						this.jump('/pages/order/express', { orderId: orderId, expressId: res.data[0].id });
					} else if (res.data.length > 1) {
						this.jump('/pages/order/express-list', { orderId: orderId });
					} else {
						this.$tools.toast('暂无包裹~');
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
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	position: absolute;
	.address-username {
		margin-right: 20rpx;
	}
	.address-detail {
		font-size: 26rpx;
		font-family: PingFang SC;
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
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(153, 153, 153, 1);
			}
			.express-type--content {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
			}
			.express-type--detail {
				font-size: 24rpx;
				font-family: PingFang SC;
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
// 拼团项目
.group-box {
	background: #fff;
	padding: 40rpx 0;
	height: 250rpx;
	margin-bottom: 20rpx;
	.tip-box {
		font-size: 28rpx;

		.cuIcon-roundcheckfill {
			color: #ecbe60;
			font-size: 34rpx;
			margin-right: 20rpx;
		}
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
		font-family: PingFang SC;
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
			height: 50rpx;
			border-radius: 25rpx;
			padding: 0;
			background: rgba(238, 238, 238, 1);
			font-size: 22rpx;
			font-family: PingFang SC;
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
			color: #e1212b;
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
			color: #fff;
			padding: 0;
		}
	}
}
</style>
