<template>
	<view class="page_box">
		<view class="head_box">
			<view class="order-nav x-f">
				<view class="nav-item y-f" v-for="nav in orderState" :key="nav.id" @tap="onNav(nav.type)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="order-list" v-for="order in orderList" :key="order.id" @tap.stop="jump('/pages/order/detail', { id: order.id })">
				<view class="order-head x-bc">
					<text class="no">订单编号：{{ order.order_sn }}</text>
					<text class="state">{{ order.status_name }}</text>
				</view>
				<view class="goods-order" v-for="goods in order.item" :key="goods.id">
					<view class="order-content"><shopro-mini-card :type="'order'" :detail="goods"></shopro-mini-card></view>

					<view class="goods-bottom  x-f">
						<view class="btn-box" v-for="(btn, index) in goods.btns" :key="btn">
							<button
								@tap.stop="jump('/pages/goods/detail/index', { id: goods.goods_id })"
								class="cu-btn btn1"
								:class="{ btn2: index + 1 === goods.btns.length }"
								v-if="btn === 'buy_again'"
							>
								再次购买
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === order.btns.length }" v-if="btn === 'express'" @tap.stop="checkExpress(order.id, goods.id)">
								查看物流
							</button>
							<button @tap.stop="onConfirm(order.id, goods.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }" v-if="btn === 'get'">
								确认收货
							</button>
							<button @tap.stop="onAftersale(order.id, goods.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }" v-if="btn === 'aftersale'">
								申请售后
							</button>
							<button v-if="btn === 'reapply_refund'" @tap.stop="onRefund(order.id, goods.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }">
								重新申请退款
							</button>
							<button @tap.stop="onRefund(order.id, goods.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }" v-if="btn === 'apply_refund'">
								申请退款
							</button>
							<button @tap.stop="onComment(order.id, goods.id)" class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }" v-if="btn === 'comment'">
								待评价
							</button>
							<button class="cu-btn btn1" :class="{ btn2: index + 1 === goods.btns.length }" v-if="btn === 'after_detail'">售后详情</button>
						</view>
					</view>
				</view>
				<view class="order-bottom x-f">
					<view class="btn-box" v-for="orderBtn in order.btns" :key="orderBtn">
						<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id)" class="cu-btn obtn1">取消订单</button>
						<button v-if="orderBtn === 'pay'" @tap.stop="onPay(order.id)" class="cu-btn obtn2">立即支付</button>
						<button v-if="orderBtn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: order.ext_arr.groupon_id })" class="cu-btn obtn2">
							拼团详情
						</button>
					</view>
				</view>
			</view>
			<!-- 空白页 -->
			<shopro-empty v-if="!orderList.length && !isLoading" :emptyData="emptyData"></shopro-empty>
			<!-- load -->
			<shoproLoad v-model="isLoading"></shoproLoad>
		</view>
		<view class="foot_box"></view>
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
			routerTo: this.$Router,
			isLoading: true,
			orderType: 'all',
			orderList: [],
			emptyData: {
				img: '/static/imgs/empty/empty_groupon.png',
				tip: '暂无商品，还有更多好货等着你噢~'
			},
			orderState: [
				{
					id: 0,
					title: '全部',
					type: 'all'
				},
				{
					id: 1,
					title: '待付款',
					type: 'nopay'
				},
				{
					id: 2,
					title: '待发货',
					type: 'nosend'
				},
				{
					id: 3,
					title: '待收货',
					type: 'noget'
				},
				{
					id: 4,
					title: '待评价',
					type: 'nocomment'
				},
				{
					id: 5,
					title: '退换货',
					type: 'aftersale'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.orderType = this.$Route.query.type;
		// this.init();
	},
	onShow() {
		this.init();
	},
	methods: {
		init() {
			return Promise.all([this.getOrderList()]);
		},
		jump(path, parmas) {
			this.$Router.push({
				path: path,
				query: parmas
			});
		},
		onNav(id) {
			this.orderType = id;
			this.getOrderList();
		},
		getOrderList() {
			let that = this;
			that.isLoading = true;
			that.$api('order.index', {
				type: that.orderType
			}).then(res => {
				if (res.code === 1) {
					that.isLoading = false;
					that.orderList = res.data.data;
				}
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
					that.getOrderList();
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
					that.getOrderList();
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
					that.getOrderList();
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
					that.getOrderList();
				}
			});
		},
		// 立即购买
		onPay(id) {
			uni.navigateTo({
				url: `/pages/order/payment/method?orderId=${id}`
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
.order-nav {
	background: #fff;
	height: 80rpx;

	.nav-item {
		flex: 1;

		.item-title {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			line-height: 76rpx;
		}

		.nav-line {
			width: 100rpx;
			height: 4rpx;
			background: #fff;
		}

		.line-active {
			background: rgba(230, 184, 115, 1);
		}
	}
}

.order-list {
	background: #fff;
	margin: 20rpx 0;
	.order-bottom {
		justify-content: flex-end;
		padding-bottom: 30rpx;
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
	.order-head {
		padding: 0 25rpx;
		height: 77rpx;
		border-bottom: 1rpx solid #dfdfdf;

		.no {
			font-size: 26rpx;
			color: #999;
		}

		.state {
			font-size: 26rpx;
			color: #a8700d;
		}
	}
	.goods-order {
		border-bottom: 1px solid rgba(223, 223, 223, 0.5);
		padding: 20rpx 20rpx 0;
		margin-bottom: 20rpx;
	}

	.goods-bottom {
		background: #fff;
		padding-bottom: 30rpx;
		justify-content: flex-end;
		.btn-box {
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
</style>
