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
					<text class="no">服务单号：{{ order.order_sn }}</text>
					<text class="state">{{ order.status_name }}</text>
				</view>
				<view class="goods-order" v-for="goods in order.item" :key="goods.id">
					<view class="order-content"><shopro-mini-card :type="'order'" :detail="goods"></shopro-mini-card></view>
				</view>
				<view class="order-bottom" v-if="order.btns.length">
					<view class="serve-status x-bc">
						<view class="x-f">
							<view class="serve-title">提交申请</view>
							<view class="serve-content">您的服务单已申请成功，等待售后处理</view>
						</view>

						<text class="cuIcon-right"></text>
					</view>
					<view class="btn-box x-f" v-for="orderBtn in order.btns" :key="orderBtn">
						<button v-if="orderBtn === 'cancel'" @tap.stop="onCancel(order.id)" class="cu-btn obtn">取消订单</button>
						<button v-if="orderBtn === 'pay'" @tap.stop="onPay(order.id)" class="cu-btn obtn">立即支付</button>
						<button v-if="orderBtn === 'groupon'" @tap.stop="jump('/pages/activity/groupon/detail', { id: order.ext_arr.groupon_id })" class="cu-btn obtn">
							拼团详情
						</button>
					</view>
				</view>
			</view>
		</view>
		<view class="foot_box"></view>
	</view>
</template>

<script>
import shoproMiniCard from '@/components/shopro-mini-card/shopro-mini-card.vue';
export default {
	components: {},
	data() {
		return {
			orderType: 'all', //分类id
			orderList: [], //售后列表
			orderState: [
				{
					id: 0,
					title: '全部',
					type: 'all'
				},
				{
					id: 1,
					title: '处理中',
					type: 'nopay'
				},
				{
					id: 2,
					title: '已完成',
					type: 'nosend'
				}
			]
		};
	},
	computed: {},
	onLoad() {
		this.getOrderList();
	},
	methods: {
		// 切换导航
		onNav(type) {
			this.orderType = type;
		},
		// 售后列表
		getOrderList() {
			let that = this;
			that.$api('order.index', {
				type: that.orderType
			}).then(res => {
				if (res.code === 1) {
					that.orderList = res.data.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
// 导航切换

.order-nav {
	background: #fff;
	height: 80rpx;
	border-top: 1rpx solid #f5f5f5;
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

// 售后列表卡片
.order-list {
	background: #fff;
	margin: 20rpx 0;
	.order-bottom {
		padding-bottom: 20rpx;
		.serve-status {
			height: 94rpx;
			background: rgba(246, 246, 246, 1);
			border-radius: 4rpx;
			margin: 0 20rpx 20rpx;
			padding: 0 20rpx;
			.serve-title {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-right: 30rpx;
			}
			.serve-content {
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
			}
			.cuIcon-right {
				color: #999999;
				font-size: 20rpx;
			}
		}
		.btn-box {
			justify-content: flex-end;
		}
		.obtn {
			width: 160rpx;
			height: 60rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 30rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(102, 102, 102, 1);
			margin-right: 20rpx;
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
	.order-content {
		padding-bottom: 20rpx;
		/deep/.status-btn {
			display: none;
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
	}
}
</style>
